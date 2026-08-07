
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        totalCopies: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                axios.get(API_URL + '/products'),
                axios.get(API_URL + '/categories')
            ]);
            setProducts(productsRes.data.products || []);
            setCategories(categoriesRes.data.categories || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        // Reset file input
        document.getElementById('imageInput').value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            toast.error('Please login as admin');
            return;
        }

        // Validate form
        if (!formData.name || !formData.price || !formData.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('totalCopies', formData.totalCopies || 0);
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            const response = await axios.post(API_URL + '/products', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Product created successfully! 🎉');
            
            // Reset form
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                totalCopies: ''
            });
            setImageFile(null);
            setImagePreview(null);
            document.getElementById('imageInput').value = '';
            
            // Refresh products
            await fetchData();
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error(error.response?.data?.message || 'Failed to create product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        try {
            await axios.delete(API_URL + '/products/' + productId, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Product deleted successfully');
            await fetchData();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    if (loading) return <div className='loading'>Loading...</div>;

    return (
        <div className='admin-products'>
            <h2>Manage Products</h2>

            {/* Add Product Form */}
            <div className='admin-form'>
                <h3>Add New Product</h3>
                <form onSubmit={handleSubmit} className='product-form'>
                    <div className='form-row'>
                        <div className='form-group'>
                            <label>Product Name *</label>
                            <input
                                type='text'
                                name='name'
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className='form-input'
                            />
                        </div>
                        <div className='form-group'>
                            <label>Price *</label>
                            <input
                                type='number'
                                name='price'
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                min='0'
                                step='0.01'
                                className='form-input'
                            />
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='form-group'>
                            <label>Category *</label>
                            <select
                                name='category'
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className='form-input'
                            >
                                <option value=''>Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='form-group'>
                            <label>Stock</label>
                            <input
                                type='number'
                                name='totalCopies'
                                value={formData.totalCopies}
                                onChange={handleInputChange}
                                min='0'
                                className='form-input'
                            />
                        </div>
                    </div>

                    <div className='form-group'>
                        <label>Description</label>
                        <textarea
                            name='description'
                            value={formData.description}
                            onChange={handleInputChange}
                            rows='3'
                            className='form-input'
                        />
                    </div>

                    {/* Image Upload with Preview */}
                    <div className='form-group'>
                        <label>Product Image</label>
                        <div className='image-upload-area'>
                            <input
                                id='imageInput'
                                type='file'
                                accept='image/*'
                                onChange={handleImageChange}
                                className='file-input'
                            />
                            <label htmlFor='imageInput' className='file-label'>
                                Choose Image
                            </label>
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className='image-preview-container'>
                                    <div className='image-preview'>
                                        <img src={imagePreview} alt='Preview' />
                                        <button
                                            type='button'
                                            onClick={removeImage}
                                            className='remove-image-btn'
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <p className='preview-text'>Preview</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='submit-btn'
                    >
                        {isSubmitting ? 'Creating...' : 'Create Product'}
                    </button>
                </form>
            </div>

            {/* Product List */}
            <div className='product-list-admin'>
                <h3>All Products ({products.length})</h3>
                <table className='admin-table'>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan='6' className='no-data'>No products found</td>
                            </tr>
                        ) : (
                            products.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        {product.image ? (
                                            <img
                                                src={API_URL + product.image}
                                                alt={product.name}
                                                className='product-thumbnail'
                                            />
                                        ) : (
                                            <span className='no-image'>No image</span>
                                        )}
                                    </td>
                                    <td>{product.name}</td>
                                    <td>₹{product.price}</td>
                                    <td>{product.category?.name || 'N/A'}</td>
                                    <td>{product.availableCopies}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className='delete-btn-admin'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
