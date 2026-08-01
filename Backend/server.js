require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test routes
app.get('/api/ecommerce', (req, res) => {
    res.json({ status: 'ok', message: 'Ecommerce API is running' });
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Test route is working!' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);  // ✅ Admin routes registered
console.log('✅ Admin routes registered at /api/admin');

app.get('/api/admin/debug', (req, res) => {
    res.json({ message: 'Debug route is working!' });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('📋 Available routes:');
    console.log('  - GET  /api/ecommerce');
    console.log('  - GET  /api/test');
    console.log('  - POST /api/auth/register');
    console.log('  - POST /api/auth/login');
    console.log('  - GET  /api/auth/profile');
    console.log('  - GET  /api/categories');
    console.log('  - POST /api/categories');
    console.log('  - GET  /api/products');
    console.log('  - POST /api/products');
    console.log('  - GET  /api/cart');
    console.log('  - POST /api/cart');
    console.log('  - POST /api/orders');
    console.log('  - GET  /api/orders/my');
    console.log('  - GET  /api/admin/dashboard');  // ✅ ADD THIS LINE
});