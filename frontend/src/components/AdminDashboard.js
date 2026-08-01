
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await axios.get(API_URL + '/admin/dashboard');
            setStats(response.data.stats);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className='loading'>Loading dashboard...</div>;

    if (!stats) return <div className='error'>Failed to load dashboard</div>;

    return (
        <div className='admin-dashboard'>
            <h2>Admin Dashboard</h2>
            
            <div className='stats-grid'>
                <div className='stat-card'>
                    <h3>{stats.totalProducts}</h3>
                    <p>Total Products</p>
                </div>
                <div className='stat-card'>
                    <h3>{stats.totalUsers}</h3>
                    <p>Total Users</p>
                </div>
                <div className='stat-card'>
                    <h3>{stats.totalOrders}</h3>
                    <p>Total Orders</p>
                </div>
                <div className='stat-card'>
                    <h3>₹{stats.totalRevenue || 0}</h3>
                    <p>Revenue</p>
                </div>
            </div>

            <div className='dashboard-section'>
                <h3>Order Status</h3>
                <div className='status-list'>
                    {stats.orderStatus?.map((status, index) => (
                        <div key={index} className='status-item'>
                            <span>{status._id || 'Unknown'}</span>
                            <span>{status.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className='dashboard-section'>
                <h3>Top Selling Products</h3>
                {stats.topProducts?.length > 0 ? (
                    <div className='top-products'>
                        {stats.topProducts.map((product, index) => (
                            <div key={index} className='product-rank'>
                                <span>#{index + 1}</span>
                                <span>{product.name}</span>
                                <span>Sold: {product.totalSold}</span>
                                <span>₹{product.revenue}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No sales yet</p>
                )}
            </div>

            <div className='dashboard-section'>
                <h3>Recent Orders</h3>
                {stats.recentOrders?.length > 0 ? (
                    stats.recentOrders.map(order => (
                        <div key={order._id} className='recent-order'>
                            <span>Order #{order._id.slice(-6)}</span>
                            <span>{order.user?.name}</span>
                            <span>₹{order.totalAmount}</span>
                            <span className={'status-' + (order.orderStatus?.toLowerCase() || 'pending')}>
                                {order.orderStatus}
                            </span>
                        </div>
                    ))
                ) : (
                    <p>No recent orders</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;