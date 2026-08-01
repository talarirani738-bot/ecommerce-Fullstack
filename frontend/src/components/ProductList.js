import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { token } = useAuth();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [search, category, page]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = API_URL + '/products?';
            if (search) url += 'search=' + search + '&';
            if (category) url += 'category=' + category + '&';
            url += 'page=' + page + '&limit=6';
            const response = await axios.get(url);
            setProducts(response.data.products || []);
            setTotalPages(response.data.totalPages || 1);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(API_URL + '/categories');
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const addToCart = async (productId) => {
        if (!token) {
            alert('Please login first!');
            return;
        }
        try {
            await axios.post(API_URL + '/cart', { productId, quantity: 1 });
            alert('Item added to cart!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding to cart');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setPage(1);
    };

    if (loading) return <div className='loading'>Loading products...</div>;

    return (
        <div className='product-list'>
            <h2>Our Products</h2>
            
            <div className='filters'>
                <form onSubmit={handleSearch} className='search-form'>
                    <input
                        type='text'
                        placeholder='Search products...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='search-input'
                    />
                    <button type='submit' className='search-btn'>Search</button>
                </form>
                
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    className='category-filter'
                >
                    <option value=''>All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className='products-grid'>
                {products.length === 0 ? (
                    <p className='no-products'>No products found.</p>
                ) : (
                    products.map(product => (
                        <div key={product._id} className='product-card'>
                            <h3>{product.name}</h3>
                            <p className='price'>₹{product.price}</p>
                            <p className='description'>{product.description}</p>
                            <p className='category'>Category: {product.category?.name || 'N/A'}</p>
                            <p className='stock'>Stock: {product.availableCopies}</p>
                            <button onClick={() => addToCart(product._id)} className='add-to-cart-btn'>
                                Add to Cart
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className='pagination'>
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductList;