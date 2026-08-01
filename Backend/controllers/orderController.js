const Order = require('../models/order');

// Get user's orders
exports.getMyOrders = async (req, res) => {
    try {
        console.log('getMyOrders called for user:', req.user._id);
        const orders = await Order.find({ user: req.user._id });
        console.log('Found orders:', orders.length);
        res.json({
            success: true,
            count: orders.length,
            orders: orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create order
exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const userId = req.user._id;

        console.log('createOrder called for user:', userId);

        const order = await Order.create({
            user: userId,
            products: [],
            totalAmount: 0,
            shippingAddress: shippingAddress || { street: 'N/A', city: 'N/A', state: 'N/A', zipCode: 'N/A', country: 'N/A' },
            paymentMethod: paymentMethod || 'cod',
            orderStatus: 'Pending'
        });

        console.log('Order created:', order._id);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get single order
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ success: true, order: order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: orderStatus },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ success: true, order: order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json({
            success: true,
            count: orders.length,
            orders: orders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};