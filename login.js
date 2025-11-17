// Password visibility toggle
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle icon
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

// Form submission
const loginForm = document.getElementById('loginForm');
const loginBtn = document.querySelector('.login-btn');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Form validation
    if (!username) {
        showError('Please enter your username');
        return;
    }
    
    // Validate username format (no spaces, no @, etc.)
    const usernamePattern = /^[a-zA-Z0-9._-]+$/;
    if (!usernamePattern.test(username)) {
        showError('Username can only contain letters, numbers, dots, hyphens and underscores');
        return;
    }
    
    // Append domain to create full email
    const fullEmail = username + '@heraldbusiness.org';
    
    if (!password) {
        showError('Please enter your password');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    // Add loading state
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    // Simulate login process (replace with actual backend call)
    setTimeout(() => {
        // Mock authentication (accept any username/password for demo)
        const token = 'mock-jwt-token-' + Date.now();
        
        // Store session data
        if (rememberMe) {
            localStorage.setItem('rememberedUser', username);
        }
        localStorage.setItem('authToken', token);
        
        // Only admin@heraldbusiness.org gets admin role, everyone else is employee
        if (fullEmail === 'admin@heraldbusiness.org') {
            localStorage.setItem('userRole', 'admin');
        } else {
            localStorage.setItem('userRole', 'employee');
        }
        
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
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Remove error after 4 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 4000);
}

// Check for remembered user
window.addEventListener('DOMContentLoaded', () => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
});

// Forgot password handler
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'forgot-password.html';
});

// Input animations
const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.01)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});