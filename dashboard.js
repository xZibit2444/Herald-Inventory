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

// Initialize dashboard
function initDashboard() {
    if (!checkAuth()) return;
    
    // Get user data
    const username = sessionStorage.getItem('username') || localStorage.getItem('rememberedUser') || 'User';
    const role = localStorage.getItem('userRole') || 'employee'; // Mock role
    
    // Display name (use saved full name if available, otherwise use username)
    const savedFullName = localStorage.getItem('userFullName');
    let displayName;
    if (savedFullName) {
        displayName = savedFullName;
    } else {
        displayName = username.split('@')[0]; // Remove email domain if present
        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1); // Capitalize first letter
    }
    
    document.getElementById('usernameDisplay').textContent = displayName;
    document.getElementById('welcomeUsername').textContent = displayName;
    
    // Count maintenance items from inventory
    updateMaintenanceCount();
    
    // Show admin sections if user is admin
    if (role === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'block';
        });
    }
}

// Update maintenance count from inventory data
function updateMaintenanceCount() {
    const inventoryData = localStorage.getItem('inventoryData');
    let maintenanceCount = 0;
    
    if (inventoryData) {
        try {
            const items = JSON.parse(inventoryData);
            maintenanceCount = items.filter(item => item.status === 'Under Maintenance').length;
        } catch (e) {
            console.error('Error parsing inventory data:', e);
        }
    }
    
    const countElement = document.getElementById('maintenanceCount');
    if (countElement) {
        countElement.textContent = maintenanceCount;
    }
}

// Top nav scroll effect with debouncing
const topNav = document.querySelector('.top-nav');
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        if (window.scrollY > 10) {
            topNav.classList.add('scrolled');
        } else {
            topNav.classList.remove('scrolled');
        }
    });
}, { passive: true });

    // Sidebar
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
});// Close sidebar on link click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
        }
    });
});

// Logout functionality
const logoutModal = document.getElementById('logoutModal');
const logoutBtn = document.getElementById('logoutBtn');
const cancelLogout = document.getElementById('cancelLogout');
const confirmLogout = document.getElementById('confirmLogout');

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logoutModal.classList.add('active');
    // Focus on cancel button for accessibility
    setTimeout(() => cancelLogout.focus(), 100);
});

cancelLogout.addEventListener('click', () => {
    logoutModal.classList.remove('active');
});

confirmLogout.addEventListener('click', () => {
    // Clear session data
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    
    // Redirect to login
    window.location.href = 'login.html';
});

// Close modal on overlay click
logoutModal.addEventListener('click', (e) => {
    if (e.target === logoutModal) {
        logoutModal.classList.remove('active');
    }
});

// Placeholder function for navigation
function showPlaceholder(page) {
    console.log(`Navigating to: ${page}`);
    alert(`${page} page is under development. This is a placeholder.`);
}

// Refresh activity log
function refreshActivity() {
    const refreshBtn = document.querySelector('.refresh-btn i');
    refreshBtn.style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        refreshBtn.style.animation = '';
        console.log('Activity log refreshed');
        alert('Activity log refreshed successfully!');
    }, 1000);
}

// Add spin animation for refresh
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);



// Initialize on page load
window.addEventListener('DOMContentLoaded', initDashboard);

// Demo: Set mock admin role for testing (comment out in production)
// Uncomment the line below to test admin features
// localStorage.setItem('userRole', 'admin');