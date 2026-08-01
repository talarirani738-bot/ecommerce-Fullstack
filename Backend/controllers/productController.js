const Product = require('../models/product');

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, totalCopies } = req.body;
        
        console.log('Creating product with:', { name, description, price, category, totalCopies });
        
        const product = new Product({
            name,
            description,
            price,
            category,
            image,
            totalCopies: totalCopies || 0,
            availableCopies: totalCopies || 0
        });
        
        await product.save();
        console.log('Product saved:', product);
        
        res.status(201).json(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name');
        res.json({
            success: true,
            count: products.length,
            products: products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ success: true, product: product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ success: true, product: product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update product with image
exports.updateProduct = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.image = `/uploads/${req.file.filename}`;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({
            success: true,
            message: 'Product updated successfully',
            product: product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(400).json({ message: error.message });
    }
};
