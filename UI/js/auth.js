// Enhanced authentication functions with better data handling
// Registration form handling
if (document.getElementById('registrationForm')) {
    const registrationForm = document.getElementById('registrationForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Email validation
    function validateEmail() {
        const email = emailInput.value.trim();
        
        // Check if email is empty
        if (!email) {
            emailInput.classList.add('input-error');
            showError('Email is required', emailInput);
            return false;
        }
    
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailInput.classList.add('input-error');
            showError('Please enter a valid email address', emailInput);
            return false;
        }
    
        // Check for existing email
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (emailExists) {
            emailInput.classList.add('input-error');
            showError('Email already registered. Please use a different email.', emailInput);
            return false;
        } else {
            emailInput.classList.remove('input-error');
            // Clear any existing error message
            const errorElement = emailInput.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
            return true;
        }
    }
    
    // Event listeners for real-time validation
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', function() {
        // Only validate if there's content and the field has been blurred at least once
        if (this.value.trim() && this.dataset.touched === 'true') {
            validateEmail();
        }
    });
    emailInput.addEventListener('focus', function() {
        this.dataset.touched = 'true';
    });
    
    // Password validation
    function validatePassword() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity("Passwords don't match");
            confirmPasswordInput.classList.add('input-error');
            showError("Passwords don't match", confirmPasswordInput);
            return false;
        } else {
            confirmPasswordInput.setCustomValidity('');
            confirmPasswordInput.classList.remove('input-error');
            return true;
        }
    }
    
    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePassword);
    
    // Form submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Validate form
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }
        
        const name = document.getElementById('name').value.trim();
        const email = emailInput.value.trim();
        const address = document.getElementById('address').value.trim();
        const password = passwordInput.value;
        
        // Generate random 7-digit customer ID
        const customerId = Math.floor(1000000 + Math.random() * 9000000);
        
        // Create user object
        const user = {
            id: customerId,
            name: name,
            email: email,
            address: address,
            password: password,
            profilePic: "images/default-profile.jpg",
            createdAt: new Date().toISOString()
        };
        
        // Save user
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message
        showRegistrationSuccess(user);
    });
    
    function showError(message, inputElement) {
        // Remove any existing error message for this input
        const existingError = inputElement.nextElementSibling;
        if (existingError && existingError.classList.contains('error-message')) {
            existingError.remove();
        }
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    }
    
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    }
    
    function showRegistrationSuccess(user) {
        document.getElementById('registrationForm').classList.add('hidden');
        document.getElementById('acknowledgment').classList.remove('hidden');
        
        document.getElementById('customerId').textContent = user.id;
        document.getElementById('customerName').textContent = user.name;
        document.getElementById('customerEmail').textContent = user.email;
    }
}
// Initialize sample data if none exists
// Enhanced authentication functions with better data handling

// Initialize sample data if none exists
function initializeSampleData() {
    if (!localStorage.getItem('products')) {
        const sampleProducts = [
            { id: 1, name: "Premium Laptop", price: 1299.99, category: "electronics", image: "images/laptop.jpg", description: "High-performance laptop with 16GB RAM and 1TB SSD" },
            { id: 2, name: "Smartphone Pro", price: 899.99, category: "electronics", image: "images/phone.jpg", description: "Latest smartphone with triple camera setup" },
            { id: 3, name: "Designer T-Shirt", price: 39.99, category: "clothing", image: "images/tshirt.jpg", description: "100% cotton premium t-shirt" },
            { id: 4, name: "Slim Fit Jeans", price: 59.99, category: "clothing", image: "images/jeans.jpg", description: "Comfortable slim fit jeans" },
            { id: 5, name: "JavaScript Mastery", price: 34.99, category: "books", image: "images/js-book.jpg", description: "Comprehensive guide to modern JavaScript" },
            { id: 6, name: "Python Programming", price: 29.99, category: "books", image: "images/python-book.jpg", description: "Learn Python from scratch" }
        ];
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
}

// Check authentication state
function checkAuth() {
    initializeSampleData();
    
    const currentUser = sessionStorage.getItem('currentUser');
    const allowedPages = ['index.html', 'register.html', 'login.html', ''];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!currentUser && !allowedPages.includes(currentPage)) {
        window.location.href = 'index.html';
        return;
    }
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        
        // Update username in all elements
        document.querySelectorAll('#username').forEach(el => {
            el.textContent = user.name;
        });
        
        // Update profile picture if exists
        document.querySelectorAll('.profile-icon').forEach(img => {
            if (user.profilePic) {
                img.src = user.profilePic;
            }
        });
        
        // Profile page specific updates
        if (document.getElementById('profileName')) {
            document.getElementById('profileName').textContent = user.name;
            document.getElementById('profileCustomerId').textContent = user.id;
            document.getElementById('profileEmail').textContent = user.email;
            document.getElementById('profileAddress').textContent = user.address;
            
            if (user.profilePic) {
                document.getElementById('profilePicture').src = user.profilePic;
            }
        }
    }
}

// Registration form handling
if (document.getElementById('registrationForm')) {
    const registrationForm = document.getElementById('registrationForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const profilePicInput = document.getElementById('profilePic');
    
    // Email validation
    function validateEmail() {
        const email = emailInput.value.trim();
        
        // Check if email is empty
        if (!email) {
            emailInput.classList.add('input-error');
            showError('Email is required', emailInput);
            return false;
        }
    
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailInput.classList.add('input-error');
            showError('Please enter a valid email address', emailInput);
            return false;
        }
    
        // Check for existing email
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (emailExists) {
            emailInput.classList.add('input-error');
            showError('Email already registered. Please use a different email.', emailInput);
            return false;
        } else {
            emailInput.classList.remove('input-error');
            // Clear any existing error message
            const errorElement = emailInput.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
            return true;
        }
    }
    
    // Password validation
    function validatePassword() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity("Passwords don't match");
            confirmPasswordInput.classList.add('input-error');
            showError("Passwords don't match", confirmPasswordInput);
            return false;
        } else {
            confirmPasswordInput.setCustomValidity('');
            confirmPasswordInput.classList.remove('input-error');
            return true;
        }
    }
    
    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', function() {
        // Only validate if there's content and the field has been blurred at least once
        if (this.value.trim() && this.dataset.touched === 'true') {
            validateEmail();
        }
    });
    emailInput.addEventListener('focus', function() {
        this.dataset.touched = 'true';
    });
    
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePassword);
    
    // Form submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Validate form
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }
        
        const name = document.getElementById('name').value.trim();
        const email = emailInput.value.trim();
        const address = document.getElementById('address').value.trim();
        const password = passwordInput.value;
        
        // Generate random 7-digit customer ID
        const customerId = Math.floor(1000000 + Math.random() * 9000000);
        
        // Create user object
        const user = {
            id: customerId,
            name: name,
            email: email,
            address: address,
            password: password,
            profilePic: "images/default-profile.jpg", // Default image
            createdAt: new Date().toISOString()
        };
        
        // Handle profile picture upload
        if (profilePicInput && profilePicInput.files.length > 0) {
            const file = profilePicInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                user.profilePic = e.target.result;
                completeRegistration(user);
            };
            
            reader.readAsDataURL(file);
        } else {
            completeRegistration(user);
        }
    });
    
    function showError(message, inputElement) {
        // Remove any existing error message for this input
        const existingError = inputElement.nextElementSibling;
        if (existingError && existingError.classList.contains('error-message')) {
            existingError.remove();
        }
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    }
    
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    }
    
    function completeRegistration(user) {
        // Save user
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message
        document.getElementById('registrationForm').classList.add('hidden');
        document.getElementById('acknowledgment').classList.remove('hidden');
        document.getElementById('customerId').textContent = user.id;
        document.getElementById('customerName').textContent = user.name;
        document.getElementById('customerEmail').textContent = user.email;
        
        if (document.getElementById('customerProfilePic')) {
            document.getElementById('customerProfilePic').src = user.profilePic;
        }
    }
}

/// Login function - cleaned version
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    // Added error message element (was missing in HTML)
    const loginError = document.createElement('div');
    loginError.id = 'loginError';
    loginError.className = 'error-message hidden';
    loginForm.insertBefore(loginError, loginForm.firstChild);
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Basic validation
        if (!email || !password) {
            showError('Please fill in all fields', loginError);
            return;
        }
        
        // Check credentials
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store current user in session
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirect to home page
            window.location.href = 'home.html';
        } else {
            showError('Invalid email or password', loginError);
        }
    });
    
    function showError(message, element) {
        element.textContent = message;
        element.classList.remove('hidden');
        
        // Hide error after 5 seconds
        setTimeout(() => {
            element.classList.add('hidden');
        }, 5000);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const currentUser = sessionStorage.getItem('currentUser');
    const allowedPages = ['index.html', 'register.html', 'login.html', ''];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentUser && currentPage === 'login.html') {
        window.location.href = 'home.html';
    }
    
    if (!currentUser && !allowedPages.includes(currentPage)) {
        window.location.href = 'login.html';
    }
});

// Sign Out
if (document.getElementById('signout')) {
    document.getElementById('signout').addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

// Update Profile (including picture)
if (document.getElementById('updateProfileForm')) {
    document.getElementById('updateProfileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users'));
        
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex === -1) return;
        
        // Get form values
        const name = document.getElementById('updateName').value || currentUser.name;
        const email = document.getElementById('updateEmail').value || currentUser.email;
        const address = document.getElementById('updateAddress').value || currentUser.address;
        const profilePicInput = document.getElementById('updateProfilePic');
        
        // Check if email is being changed to one that already exists
        if (email !== currentUser.email && users.some(u => u.email === email && u.id !== currentUser.id)) {
            alert('Email already in use by another account');
            return;
        }
        
        // Update user data
        users[userIndex].name = name;
        users[userIndex].email = email;
        users[userIndex].address = address;
        
        // Handle profile picture update
        if (profilePicInput.files.length > 0) {
            const file = profilePicInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                users[userIndex].profilePic = e.target.result;
                currentUser.profilePic = e.target.result;
                completeProfileUpdate(users, currentUser);
            };
            
            reader.readAsDataURL(file);
        } else {
            completeProfileUpdate(users, currentUser);
        }
    });
}

function completeProfileUpdate(users, currentUser) {
    // Save updates
    localStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Show success message
    alert('Profile updated successfully');
    
    // Refresh profile display
    checkAuth();
}

// Update Password
if (document.getElementById('updatePassword')) {
    document.getElementById('updatePassword').addEventListener('click', function() {
        document.getElementById('passwordUpdateForm').classList.remove('hidden');
    });
    
    document.getElementById('cancelPasswordUpdate').addEventListener('click', function() {
        document.getElementById('passwordUpdateForm').classList.add('hidden');
    });
    
    document.getElementById('submitPasswordUpdate').addEventListener('click', function() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        
        if (newPassword.length < 10 || newPassword.length > 30) {
            alert('Password must be between 10 and 30 characters');
            return;
        }
        
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users'));
        
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (users[userIndex].password !== currentPassword) {
            alert('Current password is incorrect');
            return;
        }
        
        // Update password
        users[userIndex].password = newPassword;
        currentUser.password = newPassword;
        
        // Save updates
        localStorage.setItem('users', JSON.stringify(users));
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert('Password updated successfully');
        document.getElementById('passwordUpdateForm').classList.add('hidden');
    });
}

// Check auth on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Add animation to cards on home page
    if (document.querySelector('.products')) {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    }
});