import api from './api';

export const createOrder = (orderData) => {
    return api.post('/orders', orderData);
};

export const getMyOrders = () => {
    return api.get('/orders/my');
};

export const getOrder = (id) => {
    return api.get(`/orders/${id}`);
};

export const getAllOrders = () => {
    return api.get('/orders/admin/all');
};

export const updateOrderStatus = (id, status) => {
    return api.put(`/orders/${id}/status`, { orderStatus: status });
};