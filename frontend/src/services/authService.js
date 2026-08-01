import api from './api';

export const registerUser = (userData) => {
    return api.post('/auth/register', userData);
};

export const loginUser = (credentials) => {
    return api.post('/auth/login', credentials);
};

export const getProfile = () => {
    return api.get('/auth/profile');
};