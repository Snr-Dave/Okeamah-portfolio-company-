// Authentication JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    // Password visibility toggle
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Password strength checker
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrength(strength, strengthBar, strengthText);
        });
    }

    // Confirm password validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch(passwordInput.value, this.value, this);
        });

        passwordInput.addEventListener('input', function() {
            if (confirmPasswordInput.value) {
                validatePasswordMatch(this.value, confirmPasswordInput.value, confirmPasswordInput);
            }
        });
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(this);
        });
    }

    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup(this);
        });
    }

    // Form validation
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    });

    // Google sign-in buttons
    const googleBtns = document.querySelectorAll('.btn-google');
    googleBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleGoogleAuth();
        });
    });

    // Utility Functions
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength += 1;
        if (password.match(/[a-z]/)) strength += 1;
        if (password.match(/[A-Z]/)) strength += 1;
        if (password.match(/[0-9]/)) strength += 1;
        if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
        
        return Math.min(strength, 4);
    }

    function updatePasswordStrength(strength, strengthBar, strengthText) {
        const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const strengthClasses = ['very-weak', 'weak', 'medium', 'good', 'strong'];
        
        // Remove all strength classes
        strengthClasses.forEach(cls => strengthBar.classList.remove(cls));
        
        if (strength > 0) {
            strengthBar.classList.add(strengthClasses[strength - 1]);
            strengthText.textContent = strengthLevels[strength - 1];
        } else {
            strengthText.textContent = 'Password strength';
        }
    }

    function validatePasswordMatch(password, confirmPassword, confirmInput) {
        const formGroup = confirmInput.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }
        
        formGroup.classList.remove('error', 'success');
        
        if (confirmPassword && password !== confirmPassword) {
            formGroup.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Passwords do not match';
            formGroup.appendChild(errorDiv);
            return false;
        } else if (confirmPassword) {
            formGroup.classList.add('success');
            return true;
        }
        
        return true;
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldContainer = field.closest('.form-group');
        let isValid = true;
        let errorMessage = '';

        // Remove existing error states
        fieldContainer.classList.remove('error', 'success');
        const existingError = fieldContainer.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Password validation
        if (field.type === 'password' && field.id === 'password' && value) {
            if (value.length < 8) {
                isValid = false;
                errorMessage = 'Password must be at least 8 characters long';
            } else if (calculatePasswordStrength(value) < 2) {
                isValid = false;
                errorMessage = 'Password is too weak';
            }
        }

        // Name validation
        if ((field.id === 'firstName' || field.id === 'lastName') && value) {
            const nameRegex = /^[a-zA-Z\s]{2,}$/;
            if (!nameRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid name (letters only, minimum 2 characters)';
            }
        }

        // Show validation result
        if (!isValid) {
            fieldContainer.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${errorMessage}`;
            fieldContainer.appendChild(errorDiv);
        } else if (value) {
            fieldContainer.classList.add('success');
        }

        return isValid;
    }

    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        // Additional validation for signup form
        if (form.id === 'signupForm') {
            const password = form.querySelector('#password').value;
            const confirmPassword = form.querySelector('#confirmPassword').value;
            const termsCheckbox = form.querySelector('input[name="terms"]');

            if (!validatePasswordMatch(password, confirmPassword, form.querySelector('#confirmPassword'))) {
                isValid = false;
            }

            if (!termsCheckbox.checked) {
                showNotification('Please accept the Terms of Service and Privacy Policy', 'error');
                isValid = false;
            }
        }

        return isValid;
    }

    function handleLogin(form) {
        if (!validateForm(form)) {
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(form);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        };

        // Simulate API call (replace with actual authentication)
        setTimeout(() => {
            // Simulate successful login
            if (loginData.email && loginData.password) {
                showNotification('Login successful! Redirecting to dashboard...', 'success');
                
                // Store user session (in real app, this would be handled by your auth system)
                localStorage.setItem('userSession', JSON.stringify({
                    email: loginData.email,
                    loginTime: new Date().toISOString(),
                    remember: loginData.remember
                }));

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showNotification('Invalid email or password', 'error');
                
                // Reset button
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
            }
        }, 2000);
    }

    function handleSignup(form) {
        if (!validateForm(form)) {
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(form);
        const signupData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            investmentType: formData.get('investmentType'),
            password: formData.get('password'),
            newsletter: formData.get('newsletter') === 'on'
        };

        // Simulate API call (replace with actual registration)
        setTimeout(() => {
            // Simulate successful registration
            showNotification('Account created successfully! Please check your email for verification.', 'success');
            
            // Store user session
            localStorage.setItem('userSession', JSON.stringify({
                email: signupData.email,
                firstName: signupData.firstName,
                lastName: signupData.lastName,
                loginTime: new Date().toISOString(),
                verified: false
            }));

            // Redirect to dashboard or verification page
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        }, 3000);
    }

    function handleGoogleAuth() {
        showNotification('Google authentication is not yet configured. Please use email/password login.', 'info');
        
        // In a real application, you would integrate with Google OAuth
        // Example: gapi.auth2.getAuthInstance().signIn()
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
    }

    function removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Add notification styles
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border-left: 4px solid var(--primary-color);
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 10000;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left-color: var(--secondary-color);
        }
        
        .notification-error {
            border-left-color: #EF4444;
        }
        
        .notification-info {
            border-left-color: #3B82F6;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
        }
        
        .notification-content i {
            color: var(--primary-color);
        }
        
        .notification-success .notification-content i {
            color: var(--secondary-color);
        }
        
        .notification-error .notification-content i {
            color: #EF4444;
        }
        
        .notification-info .notification-content i {
            color: #3B82F6;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 0.25rem;
            transition: all 0.3s ease;
        }
        
        .notification-close:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }
    `;

    // Inject notification styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);

    // Check for existing session on page load
    const existingSession = localStorage.getItem('userSession');
    if (existingSession) {
        const session = JSON.parse(existingSession);
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);

        // If session is less than 24 hours old (or remember me is checked), redirect to dashboard
        if (hoursSinceLogin < 24 || session.remember) {
            if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // Clear expired session
            localStorage.removeItem('userSession');
        }
    }
});

// Password strength CSS
const passwordStrengthStyles = `
    .strength-bar.very-weak::after {
        width: 20%;
        background: #EF4444;
    }
    
    .strength-bar.weak::after {
        width: 40%;
        background: #F59E0B;
    }
    
    .strength-bar.medium::after {
        width: 60%;
        background: #F59E0B;
    }
    
    .strength-bar.good::after {
        width: 80%;
        background: #10B981;
    }
    
    .strength-bar.strong::after {
        width: 100%;
        background: #10B981;
    }
`;

// Inject password strength styles
const passwordStyleSheet = document.createElement('style');
passwordStyleSheet.textContent = passwordStrengthStyles;
document.head.appendChild(passwordStyleSheet);