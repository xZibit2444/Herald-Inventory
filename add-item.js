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
function initAddItem() {
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
}

// Form submission
document.getElementById('addItemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('itemName').value,
        category: document.getElementById('category').value,
        quantity: document.getElementById('quantity').value,
        location: document.getElementById('location').value,
        status: document.getElementById('status').value,
        unitPrice: document.getElementById('unitPrice').value || null,
        supplier: document.getElementById('supplier').value || null,
        description: document.getElementById('description').value || null,
        addedBy: sessionStorage.getItem('username') || 'Unknown',
        addedDate: new Date().toISOString()
    };
    
    // Log to console (in real app, this would be sent to backend)
    console.log('New item to add:', formData);
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    
    // Reset form after delay
    setTimeout(() => {
        resetForm();
        successMessage.classList.remove('show');
    }, 3000);
    
    // Mock alert
    setTimeout(() => {
        alert(`Item "${formData.name}" has been added successfully!`);
    }, 500);
});

// Reset form
function resetForm() {
    document.getElementById('addItemForm').reset();
    document.getElementById('status').value = 'In Stock'; // Set default status
}

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

// Logout
const logoutModal = document.getElementById('logoutModal');
const logoutBtn = document.getElementById('logoutBtn');
const cancelLogout = document.getElementById('cancelLogout');
const confirmLogout = document.getElementById('confirmLogout');

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logoutModal.classList.add('active');
});

cancelLogout.addEventListener('click', () => {
    logoutModal.classList.remove('active');
});

confirmLogout.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    window.location.href = 'login.html';
});

logoutModal.addEventListener('click', (e) => {
    if (e.target === logoutModal) {
        logoutModal.classList.remove('active');
    }
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

// Placeholder function
function showPlaceholder(page) {
    console.log(`Navigating to: ${page}`);
    alert(`${page} page is under development. This is a placeholder.`);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initAddItem);