
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { validateRegister } from '../utils/validation';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const validationErrors = validateRegister(formData);
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length > 0) {
            Object.values(validationErrors).forEach(err => toast.error(err));
            return;
        }
        
        setLoading(true);
        const { confirmPassword, ...registerData } = formData;
        const result = await register(registerData);
        setLoading(false);

        if (result.success) {
            toast.success('Account created successfully! 🎉');
            navigate('/');
        } else {
            toast.error(result.error || 'Registration failed');
        }
    };

    return (
        <div className='auth-container'>
            <div className='auth-card'>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Name</label>
                        <input
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            className={'form-input' + (errors.name ? ' error' : '')}
                        />
                        {errors.name && <small className='error-text'>{errors.name}</small>}
                    </div>
                    <div className='form-group'>
                        <label>Email</label>
                        <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className={'form-input' + (errors.email ? ' error' : '')}
                        />
                        {errors.email && <small className='error-text'>{errors.email}</small>}
                    </div>
                    <div className='form-group'>
                        <label>Password</label>
                        <input
                            type='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className={'form-input' + (errors.password ? ' error' : '')}
                        />
                        {errors.password && <small className='error-text'>{errors.password}</small>}
                    </div>
                    <div className='form-group'>
                        <label>Confirm Password</label>
                        <input
                            type='password'
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={'form-input' + (errors.confirmPassword ? ' error' : '')}
                        />
                        {errors.confirmPassword && <small className='error-text'>{errors.confirmPassword}</small>}
                    </div>
                    <div className='form-group'>
                        <label>Phone (Optional)</label>
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
