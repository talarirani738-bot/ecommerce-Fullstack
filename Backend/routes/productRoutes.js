const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateProduct, handleValidation } = require('../middleware/validators');
router.post('/', protect, adminOnly, upload.single('image'), validateProduct, handleValidation, createProduct);
router.post('/', protect, adminOnly, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/', protect, adminOnly, upload.single('image'), createProduct);

module.exports = router;