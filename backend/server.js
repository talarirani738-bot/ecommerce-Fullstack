require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/ecommerce', (req, res) => {
    res.json({ status: 'ok', message: 'Ecommerce API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
    console.log('Available routes:');
    console.log('  - GET  /api/ecommerce');
    console.log('  - POST /api/auth/register');
    console.log('  - POST /api/auth/login');
    console.log('  - GET  /api/auth/profile');
    console.log('  - GET  /api/products');
    console.log('  - POST /api/products');
    console.log('  - GET  /api/categories');
    console.log('  - POST /api/categories');
});