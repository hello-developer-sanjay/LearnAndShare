import axios from 'axios';
import { setAuthToken } from '../utils/setAuthToken';
import { FETCH_USER_SUCCESS, LOGIN_SUCCESS, FOLLOW_CATEGORY_SUCCESS, AUTHENTICATE_USER,ACCEPT_POLICY_SUCCESS } from './types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
        dispatch({ type: AUTHENTICATE_USER, payload: true });
    }
    try {
        const res = await axios.get('https://learnandshare-api-27dec.onrender.com/api/auth/user');
        const user = res.data.user; // Ensure user object is correctly extracted

        localStorage.setItem('user', JSON.stringify(res.data.user));
        dispatch({ type: FETCH_USER_SUCCESS, payload: { user: res.data.user, token: localStorage.token, policyAccepted: res.data.policyAccepted } });
        dispatch({ type: FOLLOW_CATEGORY_SUCCESS, payload: res.data.user.followedCategories });

        console.log('User loaded successfully:', res.data.user);
    } catch (error) {
        console.error('Error loading user:', error);
    }
};

export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('https://learnandshare-api-27dec.onrender.com/api/auth/login', body, config);
        const { token, user } = res.data;
        console.log('Login response:', res.data);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({ type: LOGIN_SUCCESS, payload: { user, token } });
        setAuthToken(token);
        dispatch(loadUser());
        console.log('Login successful:', res.data);
        return { success: true, role: user.role };
    } catch (error) {
        console.error('Error logging in:', error.response.data.message);
        return { success: false, message: error.response.data.message || 'Login failed' };
    }
};

export const loginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user,
});

export const register = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await axios.post('https://learnandshare-api-27dec.onrender.com/api/auth/register', formData, config);
        const { token, user } = res.data;
        console.log('Register response:', res.data);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({ type: LOGIN_SUCCESS, payload: { user, token } });
        setAuthToken(token);
        dispatch(loadUser());
        console.log('Registration successful:', res.data);
        return { success: true, role: user.role };
    } catch (error) {
        console.error('Error registering user:', error);
    }
};
export const acceptPolicy = () => async dispatch => {
    try {
        const res = await axios.post('https://learnandshare-api-27dec.onrender.com/api/auth/accept-policy');
        const { user } = res.data;
        console.log('Policy acceptance response:', res.data);

        localStorage.setItem('user', JSON.stringify(user));

        dispatch({ type: ACCEPT_POLICY_SUCCESS, payload: user });
        toast.success('Policy acceptance successful !', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        console.log('Policy acceptance successful:', res.data);
    } catch (error) {
        console.error('Error accepting policy:', error);
        toast.error('Error accepting policy. Please Login and try again.', {
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
