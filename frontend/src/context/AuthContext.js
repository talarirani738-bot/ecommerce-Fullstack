
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(API_URL + '/auth/profile');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
            setToken(null);
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post(API_URL + '/auth/register', userData);
            const { token, ...userInfo } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            setUser(userInfo);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Registration failed' };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post(API_URL + '/auth/login', credentials);
            const { token, ...userInfo } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            setUser(userInfo);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
