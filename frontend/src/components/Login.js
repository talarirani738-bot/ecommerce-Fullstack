
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { validateLogin } from '../utils/validation';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const validationErrors = validateLogin({ email, password });
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length > 0) {
            Object.values(validationErrors).forEach(err => toast.error(err));
            return;
        }
        
        setLoading(true);
        const result = await login({ email, password });
        setLoading(false);

        if (result.success) {
            toast.success('Welcome back! 🎉');
            navigate('/');
        } else {
            toast.error(result.error || 'Login failed');
        }
    };

    const handleChange = (field, value) => {
        setErrors({ ...errors, [field]: '' });
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);
    };

    return (
        <div className='auth-container'>
            <div className='auth-card'>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Email</label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={'form-input' + (errors.email ? ' error' : '')}
                        />
                        {errors.email && <small className='error-text'>{errors.email}</small>}
                    </div>
                    <div className='form-group'>
                        <label>Password</label>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            className={'form-input' + (errors.password ? ' error' : '')}
                        />
                        {errors.password && <small className='error-text'>{errors.password}</small>}
                    </div>
                    <button type='submit' disabled={loading} className='auth-btn'>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className='auth-link'>
                    Don't have an account? <Link to='/register'>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
