import axios from 'axios';
import { setAuthToken } from '../utils/setAuthToken';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const FETCH_USER_POSTS_SUCCESS = 'FETCH_USER_POSTS_SUCCESS';
export const FETCH_USER_POSTS_REQUEST = 'FETCH_USER_POSTS_REQUEST';
export const FETCH_USER_POSTS_FAILURE = 'FETCH_USER_POSTS_FAILURE';
export const UPDATE_POST_SUCCESS = 'UPDATE_POST_SUCCESS';
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
export const SEARCH_POSTS_SUCCESS = 'SEARCH_POSTS_SUCCESS';
export const FETCH_COMPLETED_POSTS_SUCCESS = 'FETCH_COMPLETED_POSTS_SUCCESS';
export const MARK_POST_COMPLETED_SUCCESS = 'MARK_POST_COMPLETED_SUCCESS';
export const FETCH_COMPLETED_POSTS_FAILURE = 'FETCH_COMPLETED_POSTS_FAILURE';

export const FETCH_POST_SUCCESS = 'FETCH_POST_SUCCESS';

export const fetchPostBySlug = (slug) => async dispatch => {
    try {
        const res = await axios.get(`https://0j9r0devif.execute-api.ap-south-1.amazonaws.com/prod/api/posts/post/${slug}`);
        dispatch({ type: FETCH_POST_SUCCESS, payload: res.data });
    } catch (error) {
    }
};
// Search blog posts
export const searchPosts = (keyword) => async (dispatch) => {
    try {
        const res = await axios.get(`https://0j9r0devif.execute-api.ap-south-1.amazonaws.com/prod/api/posts/search?keyword=${keyword}`);
        dispatch({ type: 'SEARCH_POSTS_SUCCESS', payload: res.data });
    } catch (error) {
    }
};
export const fetchPosts = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('https://0j9r0devif.execute-api.ap-south-1.amazonaws.com/prod/api/posts');
        dispatch({ type: FETCH_POSTS_SUCCESS, payload: res.data });
    } catch (error) {
    }
};
export const fetchUserPosts = () => async dispatch => {
    const token = localStorage.getItem("token");
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    dispatch({ type: FETCH_USER_POSTS_REQUEST });

    try {
        const res = await axios.get('https://0j9r0devif.execute-api.ap-south-1.amazonaws.com/prod/api/posts/user', {
            headers: {
                'x-auth-token': token
            }
        });
        dispatch({ type: FETCH_USER_POSTS_SUCCESS, payload: res.data });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        dispatch({ type: FETCH_USER_POSTS_FAILURE, payload: error.message });
    }
};

export const addPost = (title, content, category, subtitles, summary, titleImage, superTitles, titleVideo) => async (
    dispatch,
    getState
) => {
    const token = localStorage.getItem("token");

    const { user } = getState().auth || JSON.parse(localStorage.getItem('user'));
    if (!user) {
        return;
    }
    try {
        const res = await axios.post('https://0j9r0devif.execute-api.ap-south-1.amazonaws.com/prod/api/posts', {
            title,
            content,
            category,
            subtitles,
            summary,
            titleImage,
            superTitles,
            titleVideo,
            author: user._id
        }, {
            headers: {
                'x-auth-token': token
            }
        });

        dispatch({ type: ADD_POST_SUCCESS, payload: res.data });

    } catch (error) {
        console.error('Error adding post:', error);
    }
};


export const updatePost = (postId, title, content) => async (dispatch, getState) => {
    const token = localStorage.getItem("token");
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.put(`https://0j9r0devif.execute-api.ap-south-1.amazonaws.com/prod/api/posts/${postId}`, { title, content }, {
            headers: {
                'x-auth-token': token
            }
        });
        dispatch({ type: UPDATE_POST_SUCCESS, payload: res.data });
    } catch (error) {
    }
};

export const deletePost = (postId) => async dispatch => {
    const token = localStorage.getItem("token");
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        await axios.delete(`https://0j9r0devif.execute-api.ap-south-1.amazonaws.com/prod/api/posts/${postId}`, {
            headers: {
                'x-auth-token': token
            }
        });
        dispatch({ type: DELETE_POST_SUCCESS, payload: postId });
    } catch (error) {
    }
};

export const markPostAsCompleted = (postId) => async (dispatch, getState) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Check if the post is already marked as completed
    const { completedPosts } = getState().postReducer;
    if (completedPosts.includes(postId)) {
        return;
    }

    try {
        const res = await axios.put(`https://0j9r0devif.execute-api.ap-south-1.amazonaws.com/prod/api/posts/complete/${postId}`, null, {
            headers: {
                'x-auth-token': token
            }
        });
        dispatch({ type: MARK_POST_COMPLETED_SUCCESS, payload: res.data });
        toast.success('Post marked as completed!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } catch (error) {
        console.error('Error marking post as completed: ', error);
        toast.error('Failed to mark post as completed. Please try again.', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });    }
};


export const fetchCompletedPosts = () => async (dispatch, getState) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await axios.get('https://0j9r0devif.execute-api.ap-south-1.amazonaws.com/prod/api/posts/completed', {
            headers: {
                'x-auth-token': token
            }
        });
        dispatch({ type: FETCH_COMPLETED_POSTS_SUCCESS, payload: res.data });
    } catch (error) {
        console.error('Error fetching completed posts:', error);
    }
};
