
const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/users');

console.log('✅ Admin controller loaded');

exports.getDashboardStats = async (req, res) => {
    try {
        console.log('Dashboard stats requested by admin:', req.user.email);
        
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        res.json({
            success: true,
            stats: {
                totalProducts,
                totalUsers,
                totalOrders,
                message: 'Dashboard is working!'
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: error.message });
    }
};
