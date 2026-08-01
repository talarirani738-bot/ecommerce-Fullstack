
import api from './api';

/**
 * Admin Service - All admin-related API calls
 */

// Get dashboard statistics (Admin only)
export const getDashboard = () => {
    return api.get('/admin/dashboard');
};

// Get all users (Admin only)
export const getAllUsers = () => {
    return api.get('/admin/users');
};
