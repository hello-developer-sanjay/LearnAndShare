import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../actions/authActions';
import axios from 'axios';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { user, loading, isAuthenticated } = useSelector(state => state.auth);
    const [allUsers, setAllUsers] = useState([]);
    const [userLoading, setUserLoading] = useState(true); // Additional state for user loading

    useEffect(() => {
        if (!isAuthenticated) {
            console.log('User is not authenticated');
            return;
        }
        if (!user) {
            console.log('Dispatching loadUser');
            dispatch(loadUser());
        } else {
            console.log('User is authenticated and loaded:', user);
        }
    }, [dispatch, user, isAuthenticated]);

    useEffect(() => {
        if (user) {
            console.log('User loaded in Admin Dashboard:', user);
            if (user.role === 'admin') {
                axios.get('https://learnandshare-api-27dec.onrender.com/api/users')
                    .then(response => {
                        setAllUsers(response.data);
                        setUserLoading(false); // Update state once users are loaded
                    })
                    .catch(error => {
                        console.error('Error fetching users:', error);
                        setUserLoading(false); // Update state even if there's an error
                    });
            } else {
                setUserLoading(false); // Update state if the user is not an admin
            }
        }
    }, [user]);

    if (loading || userLoading) {
        console.log('Loading...');
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        console.log('Not authenticated');
        return <div>Please log in to view this page.</div>;
    }

    if (!user) {
        console.log('User not loaded');
        return <div>Error loading user data.</div>;
    }

    if (user.role !== 'admin') {
        return <div>Access denied. Admins only.</div>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user.name}!</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <h2>All Users</h2>
            <ul>
                {allUsers.map(u => (
                    <li key={u.id}>{u.name} - {u.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;
