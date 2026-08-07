
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className='navbar'>
            <div className='nav-container'>
                <Link to='/' className='nav-brand'>🛍️ E-Commerce</Link>
                <div className='nav-links'>
                    <Link to='/' className='nav-link'>Products</Link>
                    {isAuthenticated && (
                        <>
                            <Link to='/cart' className='nav-link'>🛒 Cart</Link>
                            <Link to='/orders' className='nav-link'>📦 Orders</Link>
                            {user?.role === 'admin' && (
                                <>
                                    <Link to='/admin' className='nav-link'>📊 Dashboard</Link>
                                    <Link to='/admin/products' className='nav-link'>📦 Manage Products</Link>
                                </>
                            )}
                        </>
                    )}
                    {isAuthenticated ? (
                        <>
                            <span className='nav-user'>👋 {user?.name}</span>
                            <button onClick={logout} className='nav-btn'>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to='/login' className='nav-link'>Login</Link>
                            <Link to='/register' className='nav-link nav-register'>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
