import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../actions/postActions';
import { Link, useParams } from 'react-router-dom';
import { useSpring, useTrail, animated } from 'react-spring';
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import '../styles/CategoryPage.css';

const CategoryPage = () => {
    const { category } = useParams();
    const dispatch = useDispatch();
    const posts = useSelector(state => state.postReducer.posts);

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem(`chat-${category}`)) || []);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [suggestedPost, setSuggestedPost] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedText, setEditedText] = useState('');

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem(`chat-${category}`, JSON.stringify(messages));
    }, [messages, category]);

    const filteredPosts = posts.filter(post => post.category === category);

    if (!posts) {
        return <div>Loading...</div>;
    }

    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { duration: 1000 }
    });

    const trail = useTrail(filteredPosts.length, {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { duration: 500 },
        delay: 1000
    });

    const sendMessageToGemini = async (message, isPostSuggestion = false) => {
        if (!message.trim()) return;

        const userMessage = { sender: 'user', text: message, id: Date.now() };
        if (!isPostSuggestion) setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const postTitles = filteredPosts.map(post => post.title).join(', ');
        const formatInstruction = "Respond in a concise, organized format using markdown with bullet points (`-`) or numbered lists where applicable. Use `**` for bold headings or emphasis.";
        const context = isPostSuggestion
            ? `${formatInstruction} Suggest a creative post title and brief description for the category "${category}". Current posts: ${postTitles || 'None'}.`
            : `${formatInstruction} You are a creative AI assistant on a page for the category "${category}". Current posts: ${postTitles || 'None'}. User query: ${message}`;

        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBsEIJ38VxWk_o5FbbOUP0WS7MCt5-bSX8', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: context }] }]
                })
            });

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text;
            if (isPostSuggestion) {
                setSuggestedPost(aiResponse);
            } else {
                setMessages(prev => [...prev, { sender: 'ai', text: aiResponse, id: Date.now() }]);
            }
        } catch (error) {
            console.error('Error fetching Gemini API:', error);
            const errorMsg = { sender: 'ai', text: 'Oops, my circuits got tangled. Try again!', id: Date.now() };
            if (isPostSuggestion) setSuggestedPost('Error generating suggestion.');
            else setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            sendMessageToGemini(input);
        }
    };

    const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speech = recognition ? new recognition() : null;

    if (speech) {
        speech.continuous = false;
        speech.interimResults = false;
        speech.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
        };
        speech.onerror = () => setIsListening(false);
        speech.onend = () => setIsListening(false);
    }

    const toggleVoiceInput = () => {
        if (!speech) {
            alert('Speech recognition not supported in this browser.');
            return;
        }
        if (isListening) {
            speech.stop();
        } else {
            setIsListening(true);
            speech.start();
        }
    };

    const startEditing = (msg) => {
        if (msg.sender === 'user') {
            setEditingMessageId(msg.id);
            setEditedText(msg.text);
        }
    };

    const saveEditedMessage = (msgId) => {
        if (editedText.trim()) {
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === msgId ? { ...msg, text: editedText } : msg
                )
            );
            sendMessageToGemini(editedText);
        }
        setEditingMessageId(null);
        setEditedText('');
    };

    const deleteMessage = (msgId) => {
        setMessages(prev => prev.filter(msg => msg.id !== msgId));
    };

    const suggestedPrompts = [
        `Craft a wild story inspired by "${category}"!`,
        `What’s the strangest fact about "${category}"?`,
        `Imagine "${category}" as a sci-fi universe—what happens?`
    ];

    const handlePromptClick = (prompt) => {
        setInput(prompt);
        sendMessageToGemini(prompt);
    };

    const generatePostSuggestion = () => {
        sendMessageToGemini(`Suggest a post for "${category}"`, true);
    };

    return (
        <animated.div style={fadeIn} className="category-page">
            <h2 className="category-title">Category: {category}</h2>
            {filteredPosts.length === 0 ? (
                <p className="no-posts">No posts found in this category.</p>
            ) : (
                <ul className="post-list">
                    {trail.map((style, index) => (
                        <animated.li key={filteredPosts[index]._id} style={style} className="post-item">
                            <Link to={`/post/${filteredPosts[index].slug}`} className="post-link">
                                <h3 className="post-title">{filteredPosts[index].title}</h3>
                            </Link>
                        </animated.li>
                    ))}
                </ul>
            )}

            <button className="chat-toggle-btn" onClick={() => setIsChatOpen(!isChatOpen)}>
                {isChatOpen ? 'Close Chat' : 'Chat Help'}
            </button>

            {isChatOpen && (
                <div className="chat-window">
                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
                            >
                                {editingMessageId === msg.id ? (
                                    <div className="edit-message">
                                        <input
                                            type="text"
                                            value={editedText}
                                            onChange={(e) => setEditedText(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && saveEditedMessage(msg.id)}
                                        />
                                        <button onClick={() => saveEditedMessage(msg.id)}>Save</button>
                                        <button onClick={() => setEditingMessageId(null)}>Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                        {msg.sender === 'ai' ? (
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        ) : (
                                            msg.text
                                        )}
                                        <div className="message-actions">
                                            {msg.sender === 'user' && (
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => startEditing(msg)}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteMessage(msg.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        {isLoading && <div className="chat-loading">AI is dreaming up a response...</div>}
                    </div>
                    <div className="chat-suggestions">
                        {suggestedPrompts.map((prompt, index) => (
                            <button
                                key={index}
                                className="suggestion-btn"
                                onClick={() => handlePromptClick(prompt)}
                                disabled={isLoading}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                    <div className="post-suggestion-area">
                        <button
                            className="post-suggestion-btn"
                            onClick={generatePostSuggestion}
                            disabled={isLoading}
                        >
                            Suggest a Post
                        </button>
                        {suggestedPost && (
                            <div className="suggested-post">
                                <strong>Suggested Post:</strong> <ReactMarkdown>{suggestedPost}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                    <div className="chat-input-area">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything..."
                            disabled={isLoading}
                        />
                        <button
                            className="voice-btn"
                            onClick={toggleVoiceInput}
                            disabled={isLoading || !speech}
                        >
                            {isListening ? 'Stop' : '🎤'}
                        </button>
                        <button onClick={() => sendMessageToGemini(input)} disabled={isLoading}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </animated.div>
    );
};

export default CategoryPage;
