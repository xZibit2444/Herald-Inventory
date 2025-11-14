// Authentication check
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    if (!token || !isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize page
function initSettings() {
    if (!checkAuth()) return;
    
    // Get user data
    const username = sessionStorage.getItem('username') || localStorage.getItem('rememberedUser') || 'User';
    const role = localStorage.getItem('userRole') || 'employee';
    
    // Display name (use saved full name if available, otherwise use username)
    const savedFullName = localStorage.getItem('userFullName');
    let displayName;
    if (savedFullName) {
        displayName = savedFullName;
    } else {
        displayName = username.split('@')[0];
        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    }
    document.getElementById('usernameDisplay').textContent = displayName;
    
    // Show admin elements if user is admin
    if (role === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'block';
        });
    }
    
    // Load saved settings
    loadSettings();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup modals
    setupModals();
}

// Setup modals
function setupModals() {
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    const closeSuccess = document.getElementById('closeSuccess');
    const closeError = document.getElementById('closeError');
    
    closeSuccess.addEventListener('click', () => {
        successModal.classList.remove('active');
    });
    
    closeError.addEventListener('click', () => {
        errorModal.classList.remove('active');
    });
    
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });
    
    errorModal.addEventListener('click', (e) => {
        if (e.target === errorModal) {
            errorModal.classList.remove('active');
        }
    });
}

// Load saved settings
function loadSettings() {
    // Load saved name
    const savedName = localStorage.getItem('userFullName') || '';
    if (savedName) {
        document.getElementById('fullName').value = savedName;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Name form
    document.getElementById('nameForm').addEventListener('submit', handleNameSubmit);
    
    // Password form
    document.getElementById('passwordForm').addEventListener('submit', handlePasswordSubmit);
    
    // Sidebar navigation
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }
    
    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Top nav scroll effect
    const topNav = document.querySelector('.top-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            topNav.classList.add('scrolled');
        } else {
            topNav.classList.remove('scrolled');
        }
    });
}

// Show success modal
function showSuccess(title, message) {
    const modal = document.getElementById('successModal');
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMessage').textContent = message;
    modal.classList.add('active');
}

// Show error modal
function showError(message) {
    const modal = document.getElementById('errorModal');
    document.getElementById('errorMessage').textContent = message;
    modal.classList.add('active');
}

// Handle name form submission
function handleNameSubmit(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    
    if (!fullName) {
        showError('Please enter your name.');
        return;
    }
    
    if (fullName.length < 3) {
        showError('Name must be at least 3 characters long.');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('userFullName', fullName);
    
    // Update display name in header
    document.getElementById('usernameDisplay').textContent = fullName;
    
    // Log the change
    console.log('Name updated:', fullName);
    console.log('Updated by:', sessionStorage.getItem('username') || 'User');
    console.log('Date:', new Date().toISOString());
    
    // Show success message
    showSuccess('Name Updated', 'Your display name has been updated successfully!');
}

// Handle password form submission
function handlePasswordSubmit(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showError('Please fill in all password fields.');
        return;
    }
    
    if (newPassword.length < 6) {
        showError('New password must be at least 6 characters long.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showError('New passwords do not match.');
        return;
    }
    
    // Log the change (in real app, this would call an API)
    console.log('Password change requested');
    console.log('User:', sessionStorage.getItem('username') || 'User');
    console.log('Date:', new Date().toISOString());
    
    // Clear form
    document.getElementById('passwordForm').reset();
    
    // Show success message
    showSuccess('Password Updated', 'Your password has been updated successfully!');
}

// Placeholder function
function showPlaceholder(page) {
    console.log(`Navigating to: ${page}`);
    alert(`${page} page is under development. This is a placeholder.`);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initSettings);