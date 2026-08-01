
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Components
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Orders from './components/Orders';
import AdminDashboard from './components/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div className='loading'>Loading...</div>;
    return isAuthenticated ? children : <Navigate to='/login' />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className='loading'>Loading...</div>;
    return user?.role === 'admin' ? children : <Navigate to='/' />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className='App'>
                    <Navbar />
                    <div className='container'>
                        <Routes>
                            <Route path='/' element={<ProductList />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/register' element={<Register />} />
                            <Route path='/cart' element={
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            } />
                            <Route path='/orders' element={
                                <ProtectedRoute>
                                    <Orders />
                                </ProtectedRoute>
                            } />
                            <Route path='/admin' element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            } />
                            <Route path='*' element={<Navigate to='/' />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
