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

// Mock updates data
const mockUpdates = [
    {
        id: 1,
        type: 'created',
        category: 'inventory',
        title: 'New Item Added',
        description: 'Added "Dell Monitor 27 inch" to inventory under Electronics category',
        user: 'john.doe@heraldbusiness.org',
        userName: 'John Doe',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        details: 'Category: Electronics, Quantity: 5, Location: Office A'
    },
    {
        id: 2,
        type: 'updated',
        category: 'inventory',
        title: 'Inventory Updated',
        description: 'Updated quantity for "HP Printer" from 3 to 8 units',
        user: 'jane.smith@heraldbusiness.org',
        userName: 'Jane Smith',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        details: 'Old Quantity: 3, New Quantity: 8'
    },
    {
        id: 3,
        type: 'maintenance',
        category: 'maintenance',
        title: 'Maintenance Report Submitted',
        description: 'Created maintenance report for "Office Chair - broken armrest"',
        user: 'kwame.mensah@heraldbusiness.org',
        userName: 'Kwame Mensah',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        details: 'Priority: High, Technician: Ama Osei'
    },
    {
        id: 4,
        type: 'user',
        category: 'users',
        title: 'User Settings Changed',
        description: 'Updated profile name from "J. Smith" to "Jane Smith"',
        user: 'jane.smith@heraldbusiness.org',
        userName: 'Jane Smith',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
        details: 'Profile settings updated'
    },
    {
        id: 5,
        type: 'updated',
        category: 'maintenance',
        title: 'Maintenance Status Updated',
        description: 'Changed status of maintenance report #12 to "Completed"',
        user: 'ama.osei@heraldbusiness.org',
        userName: 'Ama Osei',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hours ago
        details: 'Status: Pending → Completed'
    },
    {
        id: 6,
        type: 'deleted',
        category: 'inventory',
        title: 'Item Removed',
        description: 'Deleted "Old Keyboard (Damaged)" from inventory',
        user: 'john.doe@heraldbusiness.org',
        userName: 'John Doe',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        details: 'Reason: Damaged beyond repair'
    },
    {
        id: 7,
        type: 'updated',
        category: 'inventory',
        title: 'Item Status Changed',
        description: 'Changed status of "Laptop Lenovo" to "Under Maintenance"',
        user: 'kofi.asante@heraldbusiness.org',
        userName: 'Kofi Asante',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
        details: 'Status: Available → Under Maintenance'
    },
    {
        id: 8,
        type: 'user',
        category: 'users',
        title: 'New User Registered',
        description: 'New staff member "Abena Darko" created an account',
        user: 'abena.darko@heraldbusiness.org',
        userName: 'Abena Darko',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        details: 'Account created successfully'
    },
    {
        id: 9,
        type: 'created',
        category: 'inventory',
        title: 'Bulk Items Added',
        description: 'Added 15 items to inventory from new shipment',
        user: 'john.doe@heraldbusiness.org',
        userName: 'John Doe',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        details: 'Categories: Office Supplies, Electronics'
    },
    {
        id: 10,
        type: 'maintenance',
        category: 'maintenance',
        title: 'Urgent Maintenance Request',
        description: 'Emergency repair request for "Server Room AC Unit"',
        user: 'kwame.mensah@heraldbusiness.org',
        userName: 'Kwame Mensah',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
        details: 'Priority: Urgent, Status: In Progress'
    }
];

// Store updates globally
let allUpdates = [...mockUpdates];
let filteredUpdates = [...mockUpdates];
let currentTab = 'all';

// Initialize page
function initRecentUpdates() {
    if (!checkAuth()) return;
    
    // Display username
    const username = sessionStorage.getItem('username') || 'User';
    const savedFullName = localStorage.getItem('userFullName');
    let displayName;
    if (savedFullName) {
        displayName = savedFullName;
    } else {
        displayName = username.split('@')[0];
        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    }
    document.getElementById('usernameDisplay').textContent = displayName;
    
    // Populate user filter
    populateUserFilter();
    
    // Render updates
    renderUpdates();
    
    // Setup tab switching
    setupTabs();
    
    // Setup filters
    setupFilters();
    
    // Setup logout
    setupLogout();
}

// Populate user filter dropdown
function populateUserFilter() {
    const userFilter = document.getElementById('userFilter');
    const uniqueUsers = [...new Set(allUpdates.map(u => u.user))];
    
    uniqueUsers.forEach(email => {
        const option = document.createElement('option');
        option.value = email;
        const name = allUpdates.find(u => u.user === email).userName;
        option.textContent = name;
        userFilter.appendChild(option);
    });
}

// Format time ago
function timeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Get icon for update type
function getUpdateIcon(type) {
    const icons = {
        created: 'fa-plus-circle',
        updated: 'fa-edit',
        deleted: 'fa-trash-alt',
        maintenance: 'fa-tools',
        user: 'fa-user-circle'
    };
    return icons[type] || 'fa-circle';
}

// Render updates timeline
function renderUpdates() {
    const container = document.getElementById('timelineContainer');
    
    if (filteredUpdates.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No updates found for the selected filters</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredUpdates.map((update, index) => `
        <div class="timeline-item" style="animation-delay: ${index * 0.1}s">
            <div class="timeline-icon ${update.type}">
                <i class="fas ${getUpdateIcon(update.type)}"></i>
            </div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <div class="timeline-title">${update.title}</div>
                    <div class="timeline-time">${timeAgo(update.timestamp)}</div>
                </div>
                <div class="timeline-description">${update.description}</div>
                <div class="timeline-meta">
                    <div class="timeline-badge">
                        <i class="fas fa-user"></i>
                        ${update.userName}
                    </div>
                    <div class="timeline-badge">
                        <i class="fas fa-info-circle"></i>
                        ${update.details}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup tabs
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked tab
            btn.classList.add('active');
            
            // Get tab type
            currentTab = btn.dataset.tab;
            
            // Filter and render
            applyFilters();
        });
    });
}

// Setup filters
function setupFilters() {
    const dateFilter = document.getElementById('dateFilter');
    const userFilter = document.getElementById('userFilter');
    
    dateFilter.addEventListener('change', applyFilters);
    userFilter.addEventListener('change', applyFilters);
}

// Apply all filters
function applyFilters() {
    const dateFilter = document.getElementById('dateFilter').value;
    const userFilter = document.getElementById('userFilter').value;
    
    filteredUpdates = allUpdates.filter(update => {
        // Tab filter
        if (currentTab !== 'all' && update.category !== currentTab) {
            return false;
        }
        
        // Date filter
        const updateDate = new Date(update.timestamp);
        const now = new Date();
        const daysDiff = (now - updateDate) / (1000 * 60 * 60 * 24);
        
        if (dateFilter === 'today' && daysDiff > 1) return false;
        if (dateFilter === 'week' && daysDiff > 7) return false;
        if (dateFilter === 'month' && daysDiff > 30) return false;
        
        // User filter
        if (userFilter !== 'all' && update.user !== userFilter) {
            return false;
        }
        
        return true;
    });
    
    renderUpdates();
}

// Refresh updates
function refreshUpdates() {
    const btn = document.querySelector('.btn-refresh i');
    btn.style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        btn.style.animation = '';
        applyFilters();
    }, 1000);
}

// Add spin animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Logout functionality
function setupLogout() {
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
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
            }
        });
    });

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
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initRecentUpdates);
