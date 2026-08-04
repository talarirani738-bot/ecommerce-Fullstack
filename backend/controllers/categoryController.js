const Category = require('../models/category');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.create({ name });
        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json({
            success: true,
            count: categories.length,
            categories: categories
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};