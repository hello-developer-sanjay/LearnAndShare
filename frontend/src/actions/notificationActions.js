import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    FETCH_NOTIFICATIONS_SUCCESS,
    ADD_NOTIFICATION_SUCCESS,
    MARK_NOTIFICATION_AS_READ_SUCCESS,
    FOLLOW_CATEGORY_SUCCESS,
    UNFOLLOW_CATEGORY_SUCCESS,
    FETCH_FOLLOWED_CATEGORIES_SUCCESS
} from './types';
import { setAuthToken } from '../utils/setAuthToken';
const updateLocalStorage = (followedCategories) => {
    try {
        const serializedState = JSON.stringify(followedCategories);
        localStorage.setItem('followedCategories', serializedState);
    } catch (err) {
    }
};
// Fetch notifications
export const fetchNotifications = () => async dispatch => {
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }
    setAuthToken(token);

    try {
        const response = await axios.get('https://learnandshare-api-27dec.onrender.com/api/categories/notifications', {
            headers: {
                'x-auth-token': token
            }
        });
        dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: response.data });
    } catch (error) {
    }
};

// Add a new notification
export const addNotification = (notification) => async dispatch => {
    console.log('Adding notification:', notification);
    try {
        const response = await axios.post('https://learnandshare-api-27dec.onrender.com/api/categories/notifications', notification);
        dispatch({ type: ADD_NOTIFICATION_SUCCESS, payload: response.data });
    } catch (error) {
    }
};
// Mark a notification as read
export const markNotificationAsRead = (id, token) => async dispatch => {

    const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        setAuthToken(token);
    try {
        

        const response = await axios.put(
            `https://learnandshare-api-27dec.onrender.com/api/notifications/${id}/read`,
            {},  // Ensure the body is correctly set
            {
                headers: {
                    'x-auth-token': token
                }
            }
        );
        dispatch({ type: MARK_NOTIFICATION_AS_READ_SUCCESS, payload: response.data });
        toast.success('Notification marked as read successfully ', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } catch (error) {
        toast.success('Error marking as read , Please Login and try again ', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
};
export const followCategory = (category, token) => async dispatch => {
    try {
        const response = await axios.post(
            'https://learnandshare-api-27dec.onrender.com/api/categories/follow-category',
            { category },
            {
                headers: {
                    'x-auth-token': token
                }
            }
        );
        const followedCategories = response.data;  
        updateLocalStorage(followedCategories);
        dispatch({ type: FOLLOW_CATEGORY_SUCCESS, payload: followedCategories });
        toast.success('You have successfully followed the category! Now you will receive timely notifications about updates in this category directly to your registered email.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } catch (error) {
        toast.error('Error following category. Please Login and try again.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });  
    }
};

export const unfollowCategory = (category, token) => async dispatch => {
    try {
        const response = await axios.post(
            'https://learnandshare-api-27dec.onrender.com/api/categories/unfollow-category',
            { category },
            {
                headers: {
                    'x-auth-token': token
                }
            }
        );
        const followedCategories = response.data;  
        updateLocalStorage(followedCategories);
        dispatch({ type: UNFOLLOW_CATEGORY_SUCCESS, payload: followedCategories });
        toast.success('Category unfollowed successfully ', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } catch (error) {
            toast.error('Error unfollowing category . Please Login and try again.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });  
    }
};
export const fetchFollowedCategories = () => async (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return;
    }
    setAuthToken(token);

    try {
        const response = await axios.get('https://learnandshare-api-27dec.onrender.com/api/categories/followed', {
            headers: {
                'x-auth-token': token,
            },
        });
        dispatch({ type: FETCH_FOLLOWED_CATEGORIES_SUCCESS, payload: response.data });
    } catch (error) {
    }
};
