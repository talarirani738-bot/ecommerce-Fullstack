
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/users');

console.log('✅ Admin routes file is being loaded!');

// Protected dashboard route with real stats
router.get('/dashboard', protect, adminOnly, async (req, res) => {
    try {
        console.log('✅ Dashboard route was called by:', req.user.email);
        
        // Get counts
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Calculate total revenue
        const revenueData = await Order.aggregate([
            { $match: { orderStatus: 'Delivered' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueData[0]?.total || 0;

        // Get order status breakdown
        const orderStatus = await Order.aggregate([
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
        ]);

        // Get top selling products
        const topProducts = await Order.aggregate([
            { $unwind: '$products' },
            {
                $group: {
                    _id: '$products.product',
                    totalSold: { $sum: '$products.quantity' },
                    revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    name: '$productDetails.name',
                    price: '$productDetails.price',
                    totalSold: 1,
                    revenue: 1
                }
            }
        ]);

        // Get recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            stats: {
                totalProducts,
                totalUsers,
                totalOrders,
                totalRevenue,
                orderStatus,
                topProducts,
                recentOrders
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
