
export const validateLogin = (data) => {
    const errors = {};
    
    if (!data.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!data.password?.trim()) {
        errors.password = 'Password is required';
    } else if (data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
};

export const validateRegister = (data) => {
    const errors = {};
    
    if (!data.name?.trim()) {
        errors.name = 'Name is required';
    } else if (data.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }
    
    if (!data.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!data.password?.trim()) {
        errors.password = 'Password is required';
    } else if (data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }
    
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
};

export const validateProduct = (data) => {
    const errors = {};
    
    if (!data.name?.trim()) {
        errors.name = 'Product name is required';
    }
    
    if (!data.description?.trim()) {
        errors.description = 'Description is required';
    } else if (data.description.length < 10) {
        errors.description = 'Description must be at least 10 characters';
    }
    
    if (!data.price || data.price <= 0) {
        errors.price = 'Price must be greater than 0';
    }
    
    if (!data.category) {
        errors.category = 'Please select a category';
    }
    
    if (data.totalCopies < 0) {
        errors.totalCopies = 'Stock cannot be negative';
    }
    
    return errors;
};
