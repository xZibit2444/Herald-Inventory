// Password visibility toggle for both fields
const togglePassword = document.querySelector('.toggle-password');
const togglePasswordConfirm = document.querySelector('.toggle-password-confirm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

togglePasswordConfirm.addEventListener('click', function() {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

// Form submission
const signupForm = document.getElementById('signupForm');
const signupBtn = document.querySelector('.login-btn');

signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Form validation
    if (!fullName) {
        showError('Please enter your full name');
        return;
    }
    
    if (fullName.length < 3) {
        showError('Full name must be at least 3 characters long');
        return;
    }
    
    if (!email) {
        showError('Please enter your username');
        return;
    }
    
    // Validate username format (no spaces, no @, etc.)
    const usernamePattern = /^[a-zA-Z0-9._-]+$/;
    if (!usernamePattern.test(email)) {
        showError('Username can only contain letters, numbers, dots, hyphens and underscores');
        return;
    }
    
    // Append domain to create full email
        // Add fixed domain suffix
    const fullEmail = username + '@heraldbusiness.org';
    
    if (!password) {
        showError('Please enter your password');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    if (!confirmPassword) {
        showError('Please confirm your password');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    // Add loading state
    signupBtn.classList.add('loading');
    signupBtn.disabled = true;
    
    // Simulate signup process (replace with actual backend call)
    setTimeout(() => {
        // Mock account creation
        const token = 'mock-jwt-token-' + Date.now();
        
        // Store session data
        localStorage.setItem('authToken', token);
        
        // Only admin@heraldbusiness.org gets admin role, everyone else is employee
        if (fullEmail === 'admin@heraldbusiness.org') {
            localStorage.setItem('userRole', 'admin');
        } else {
            localStorage.setItem('userRole', 'employee');
        }
        
        localStorage.setItem('userFullName', fullName);
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', fullEmail);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }, 1500);
});

// Error handling
function showError(message) {
    // Create error element if it doesn't exist
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        signupForm.insertBefore(errorDiv, signupForm.firstChild);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Remove error after 4 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 4000);
}

// Input animations
const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.01)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});
