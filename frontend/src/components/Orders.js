
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(API_URL + '/orders/my');
            setOrders(response.data.orders || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'status-pending',
            'Processing': 'status-processing',
            'Shipped': 'status-shipped',
            'Delivered': 'status-delivered',
            'Cancelled': 'status-cancelled'
        };
        return colors[status] || 'status-pending';
    };

    if (loading) return <div className='loading'>Loading orders...</div>;

    if (orders.length === 0) {
        return <div className='empty-orders'>No orders yet.</div>;
    }

    return (
        <div className='orders-container'>
            <h2>My Orders</h2>
            {orders.map(order => (
                <div key={order._id} className='order-card'>
                    <div className='order-header'>
                        <span className='order-id'>Order #{order._id.slice(-6)}</span>
                        <span className={'order-status ' + getStatusColor(order.orderStatus)}>
                            {order.orderStatus}
                        </span>
                        <span className='order-date'>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className='order-items'>
                        {order.products.map((item, index) => (
                            <div key={index} className='order-item'>
                                <span>{item.product?.name || 'Product'}</span>
                                <span>{item.quantity} × ₹{item.price}</span>
                            </div>
                        ))}
                    </div>
                    <div className='order-total'>
                        <strong>Total: ₹{order.totalAmount}</strong>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Orders;
