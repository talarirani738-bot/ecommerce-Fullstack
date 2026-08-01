
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register(formData);
        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className='auth-container'>
            <div className='auth-card'>
                <h2>Register</h2>
                {error && <div className='error-message'>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Name</label>
                        <input
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className='form-input'
                        />
                    </div>
                    <div className='form-group'>
                        <label>Email</label>
                        <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className='form-input'
                        />
                    </div>
                    <div className='form-group'>
                        <label>Password</label>
                        <input
                            type='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength='6'
                            className='form-input'
                        />
                    </div>
                    <div className='form-group'>
                        <label>Phone</label>
                        <input
                            type='tel'
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            className='form-input'
                        />
                    </div>
                    <button type='submit' disabled={loading} className='auth-btn'>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className='auth-link'>
                    Already have an account? <Link to='/login'>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
