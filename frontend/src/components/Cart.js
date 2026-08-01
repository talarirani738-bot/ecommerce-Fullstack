import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const Cart = () => {
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchCart = async () => {
        try {
            const response = await axios.get(API_URL + '/cart');
            setCart(response.data.cart || { items: [], totalAmount: 0 });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setLoading(false);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axios.delete(API_URL + '/cart/' + productId);
            await fetchCart();
        } catch (error) {
            alert('Error removing item from cart');
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        try {
            await axios.put(API_URL + '/cart/' + productId, { quantity });
            await fetchCart();
        } catch (error) {
            alert('Error updating quantity');
        }
    };

    const checkout = async () => {
        try {
            const shippingAddress = {
                street: '123 Main St',
                city: 'Mumbai',
                state: 'Maharashtra',
                zipCode: '400001',
                country: 'India'
            };
            await axios.post(API_URL + '/orders', { shippingAddress, paymentMethod: 'card' });
            alert('Order placed successfully!');
            navigate('/orders');
        } catch (error) {
            alert(error.response?.data?.message || 'Error placing order');
        }
    };

    if (loading) return <div className='loading'>Loading cart...</div>;

    if (cart.items.length === 0) {
        return <div className='empty-cart'>Your cart is empty.</div>;
    }

    return (
        <div className='cart-container'>
            <h2>Shopping Cart</h2>
            <div className='cart-items'>
                {cart.items.map(item => (
                    <div key={item.product._id} className='cart-item'>
                        <div className='cart-item-info'>
                            <h4>{item.product.name}</h4>
                            <p>Price: ₹{item.product.price}</p>
                        </div>
                        <div className='cart-item-actions'>
                            <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                            <button onClick={() => removeFromCart(item.product._id)} className='remove-btn'>Remove</button>
                        </div>
                        <div className='cart-item-total'>
                            ₹{item.product.price * item.quantity}
                        </div>
                    </div>
                ))}
            </div>
            <div className='cart-total'>
                <h3>Total: ₹{cart.totalAmount}</h3>
                <button onClick={checkout} className='checkout-btn'>Proceed to Checkout</button>
            </div>
        </div>
    );
};

export default Cart;