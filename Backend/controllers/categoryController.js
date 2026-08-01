
const Category = require('../models/category');

// Create category
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        
        const category = await Category.create({ name });
        res.status(201).json({
            success: true,
            message: 'Category created successfully!',
            data: category
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all categories - RETURNS FULL OBJECTS
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        console.log('Categories from DB:', categories); // Debug log
        res.json({
            success: true,
            count: categories.length,
            categories: categories
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single category
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true, runValidators: true }
        );
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
