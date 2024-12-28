import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../actions/postActions';
import { loadUser } from '../actions/authActions';
import axios from 'axios';
import DOMPurify from 'dompurify';
import styled from 'styled-components';
import { Tooltip } from '@material-ui/core';

// Styled Components
const FormContainer = styled.div`
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
`;

const Section = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const FullWidthSection = styled(Section)`
    grid-column: span 2;
`;

const SectionTitle = styled.h3`
    margin-bottom: 20px;
    color: #333;
    border-bottom: 2px solid #007bff;
    padding-bottom: 5px;
`;

const FormGroup = styled.div`
    display: grid;
    gap: 10px;
`;

const Label = styled.label`
    font-weight: bold;
    margin-bottom: 5px;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Select = styled.select`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background-color: #0056b3;
    }
`;

const IconButton = styled(Button)`
    background: none;
    color: #007bff;
    border: 1px solid #007bff;
    padding: 5px 10px;
    font-size: 0.9em;
    margin: 5px 0;

    &:hover {
        background-color: #e6f7ff;
        border-color: #0056b3;
    }
`;

const AddPostForm = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [titleImage, setTitleImage] = useState(null);
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('VS Code');
    const [subtitles, setSubtitles] = useState([{ title: '', image: null, bulletPoints: [{ text: '', image: null, codeSnippet: '' }] }]);
    const [summary, setSummary] = useState('');
    const { user } = useSelector(state => state.auth);
    const [video, setVideo] = useState(null);
    const categories = [
        'VS Code', 'HTML', 'CSS', 'JavaScript', 'Node.js', 'React', 'Angular', 'Vue.js', 'Next.js', 'Nuxt.js',
        'Gatsby', 'Svelte', 'TypeScript', 'GraphQL', 'PHP', 'Python', 'Ruby', 'Java', 'C#', 'C++', 'Swift',
        'Kotlin', 'Dart', 'Flutter', 'React Native'
    ];
    const [superTitles, setSuperTitles] = useState([{ superTitle: '', attributes: [{ attribute: '', items: [{ title: '', bulletPoints: [''] }] }] }]);

    const handleSuperTitleChange = (index, field, value) => {
        const newSuperTitles = [...superTitles];
        newSuperTitles[index][field] = value;
        setSuperTitles(newSuperTitles);
    };

    const handleAttributeChange = (superTitleIndex, attributeIndex, field, value) => {
        const newSuperTitles = [...superTitles];
        newSuperTitles[superTitleIndex].attributes[attributeIndex][field] = value;
        setSuperTitles(newSuperTitles);
    };

    const handleItemChange = (superTitleIndex, attributeIndex, itemIndex, field, value) => {
        const newSuperTitles = [...superTitles];
        newSuperTitles[superTitleIndex].attributes[attributeIndex].items[itemIndex][field] = value;
        setSuperTitles(newSuperTitles);
    };

    const addSuperTitle = () => {
        setSuperTitles([...superTitles, { superTitle: '', attributes: [{ attribute: '', items: [{ title: '', bulletPoints: [''] }] }] }]);
    };

    const addAttribute = (superTitleIndex) => {
        const newSuperTitles = [...superTitles];
        newSuperTitles[superTitleIndex].attributes.push({ attribute: '', items: [{ title: '', bulletPoints: [''] }] });
        setSuperTitles(newSuperTitles);
    };

    const addItem = (superTitleIndex, attributeIndex) => {
        const newSuperTitles = [...superTitles];
        newSuperTitles[superTitleIndex].attributes[attributeIndex].items.push({ title: '', bulletPoints: [''] });
        setSuperTitles(newSuperTitles);
    };

    useEffect(() => {
        if (!user) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                dispatch({ type: 'FETCH_USER_SUCCESS', payload: { user: storedUser, token: localStorage.getItem('token') } });
            } else {
                dispatch(loadUser());
            }
        }
    }, [dispatch, user]);

    const handleSubtitleChange = (index, field, value) => {
        const newSubtitles = [...subtitles];
        newSubtitles[index][field] = value;
        setSubtitles(newSubtitles);
    };

    const handleBulletPointChange = (subtitleIndex, pointIndex, field, value) => {
        const newSubtitles = [...subtitles];
        newSubtitles[subtitleIndex].bulletPoints[pointIndex][field] = value;
        setSubtitles(newSubtitles);
    };

    const handleImageUpload = async (e, setImage) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post('https://learnandshare-api-27dec.onrender.com/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImage(res.data.filePath);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('video', file);

        try {
            const res = await axios.post('https://learnandshare-api-27dec.onrender.com/upload/video', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setVideo(res.data.filePath);
        } catch (error) {
            console.error('Error uploading video:', error);
        }
    };

    const addSubtitle = () => {
        setSubtitles([...subtitles, { title: '', image: null, bulletPoints: [{ text: '', image: null, codeSnippet: '' }] }]);
    };

    const addBulletPoint = (subtitleIndex) => {
        const newSubtitles = [...subtitles];
        newSubtitles[subtitleIndex].bulletPoints.push({ text: '', image: null, codeSnippet: '' });
        setSubtitles(newSubtitles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            console.error('User not found');
            return;
        }
        try {
            const sanitizedSubtitles = subtitles.map(sub => ({
                ...sub,
                bulletPoints: sub.bulletPoints.map(point => ({
                    ...point,
                    codeSnippet: DOMPurify.sanitize(point.codeSnippet)
                }))
            }));
            dispatch(addPost(title, content, category, sanitizedSubtitles, summary, titleImage, superTitles, video));
            setTitle('');
            setTitleImage(null);
            setContent('');
            setVideo(null);
            setCategory('VS Code');
            setSubtitles([{ title: '', image: null, bulletPoints: [{ text: '', image: null, codeSnippet: '' }] }]);
            setSummary('');
            setSuperTitles([{ superTitle: '', attributes: [{ attribute: '', items: [{ title: '', bulletPoints: [''] }] }] }]);
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    return (
        <FormContainer>
            <FullWidthSection>
                <h2>Add New Post</h2>
                <form onSubmit={handleSubmit}>
                    <Section>
                        <SectionTitle>Post Details</SectionTitle>
                        <FormGroup>
                            <Tooltip title="Enter the title of your post">
                                <Label>Title</Label>
                            </Tooltip>
                            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </FormGroup>
                        <FormGrid>
                            <FormGroup>
                                <Label>Title Image</Label>
                                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setTitleImage)} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Video</Label>
                                <Input type="file" accept="video/*" onChange={handleVideoUpload} />
                            </FormGroup>
                        </FormGrid>
                        <FormGroup>
                            <Tooltip title="Enter the main content of your post">
                                <Label>Content</Label>
                            </Tooltip>
                            <TextArea rows="10" value={content} onChange={(e) => setContent(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <Tooltip title="Select the category for your post">
                                <Label>Category</Label>
                            </Tooltip>
                            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </Select>
                        </FormGroup>
                    </Section>

                    <Section>
                        <SectionTitle>Comparison Section</SectionTitle>
                        {superTitles.map((superTitle, superTitleIndex) => (
                            <div key={superTitleIndex}>
                                <FormGroup>
                                    <Label>Super Title</Label>
                                    <Input
                                        type="text"
                                        value={superTitle.superTitle}
                                        onChange={(e) => handleSuperTitleChange(superTitleIndex, 'superTitle', e.target.value)}
                                    />
                                </FormGroup>
                                {superTitle.attributes.map((attribute, attributeIndex) => (
                                    <div key={attributeIndex}>
                                        <FormGroup>
                                            <Label>Attribute</Label>
                                            <Input
                                                type="text"
                                                value={attribute.attribute}
                                                onChange={(e) => handleAttributeChange(superTitleIndex, attributeIndex, 'attribute', e.target.value)}
                                            />
                                        </FormGroup>
                                        {attribute.items.map((item, itemIndex) => (
                                            <div key={itemIndex}>
                                                <FormGroup>
                                                    <Label>Item Title</Label>
                                                    <Input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={(e) => handleItemChange(superTitleIndex, attributeIndex, itemIndex, 'title', e.target.value)}
                                                    />
                                                </FormGroup>
                                                {item.bulletPoints.map((bulletPoint, bpIndex) => (
                                                    <FormGroup key={bpIndex}>
                                                        <Label>Bullet Point</Label>
                                                        <Input
                                                            type="text"
                                                            value={bulletPoint}
                                                            onChange={(e) => {
                                                                const newSuperTitles = [...superTitles];
                                                                newSuperTitles[superTitleIndex].attributes[attributeIndex].items[itemIndex].bulletPoints[bpIndex] = e.target.value;
                                                                setSuperTitles(newSuperTitles);
                                                            }}
                                                        />
                                                    </FormGroup>
                                                ))}
                                                <IconButton type="button" onClick={() => {
                                                    const newSuperTitles = [...superTitles];
                                                    newSuperTitles[superTitleIndex].attributes[attributeIndex].items[itemIndex].bulletPoints.push('');
                                                    setSuperTitles(newSuperTitles);
                                                }}>
                                                    Add Bullet Point
                                                </IconButton>
                                            </div>
                                        ))}
                                        <IconButton type="button" onClick={() => addItem(superTitleIndex, attributeIndex)}>Add Item</IconButton>
                                    </div>
                                ))}
                                <IconButton type="button" onClick={() => addAttribute(superTitleIndex)}>Add Attribute</IconButton>
                            </div>
                        ))}
                        <IconButton type="button" onClick={addSuperTitle}>Add Super Title</IconButton>
                    </Section>

                    <Section>
                        <SectionTitle>Subtitles</SectionTitle>
                        {subtitles.map((subtitle, index) => (
                            <div key={index}>
                                <FormGroup>
                                    <Label>Subtitle</Label>
                                    <Input
                                        type="text"
                                        value={subtitle.title}
                                        onChange={(e) => handleSubtitleChange(index, 'title', e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Subtitle Image</Label>
                                    <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (imagePath) => {
                                        const newSubtitles = [...subtitles];
                                        newSubtitles[index].image = imagePath;
                                        setSubtitles(newSubtitles);
                                    })} />
                                </FormGroup>
                                {subtitle.bulletPoints.map((point, pointIndex) => (
                                    <div key={pointIndex}>
                                        <FormGroup>
                                            <Label>Bullet Point</Label>
                                            <Input
                                                type="text"
                                                value={point.text}
                                                onChange={(e) => handleBulletPointChange(index, pointIndex, 'text', e.target.value)}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Bullet Point Image</Label>
                                            <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (imagePath) => {
                                                const newSubtitles = [...subtitles];
                                                newSubtitles[index].bulletPoints[pointIndex].image = imagePath;
                                                setSubtitles(newSubtitles);
                                            })} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Code Snippet</Label>
                                            <TextArea
                                                rows="4"
                                                value={point.codeSnippet}
                                                onChange={(e) => handleBulletPointChange(index, pointIndex, 'codeSnippet', e.target.value)}
                                            />
                                        </FormGroup>
                                    </div>
                                ))}
                                <IconButton type="button" onClick={() => addBulletPoint(index)}>Add Bullet Point</IconButton>
                            </div>
                        ))}
                        <IconButton type="button" onClick={addSubtitle}>Add Subtitle</IconButton>
                    </Section>

                    <Section>
                        <SectionTitle>Summary</SectionTitle>
                        <FormGroup>
                            <Tooltip title="Enter a brief summary of your post">
                                <Label>Summary</Label>
                            </Tooltip>
                            <TextArea rows="5" value={summary} onChange={(e) => setSummary(e.target.value)} />
                        </FormGroup>
                    </Section>

                    <Button type="submit">Add Post</Button>
                </form>
            </FullWidthSection>
        </FormContainer>
    );
};

export default AddPostForm;
