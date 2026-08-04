const express = require('express');
const router = express.Router();
const { createCategory, getCategories } = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, adminOnly, createCategory);
router.get('/', getCategories);

module.exports = router;