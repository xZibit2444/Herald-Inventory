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

// Mock inventory data (default items)
const defaultInventoryData = [
    { id: 1, name: 'Ballpoint Pens (Blue)', category: 'Stationery', quantity: 145, location: 'Shelf 3', status: 'In Stock' },
    { id: 2, name: 'A4 Paper Reams', category: 'Stationery', quantity: 28, location: 'Storage Room', status: 'In Stock' },
    { id: 3, name: 'Printer Ink Cartridges', category: 'Supplies', quantity: 8, location: 'Cabinet A', status: 'Low Stock' },
    { id: 4, name: 'Desk Chairs', category: 'Furniture', quantity: 2, location: 'Office Floor', status: 'In Stock' },
    { id: 5, name: 'Staplers', category: 'Stationery', quantity: 12, location: 'Shelf 2', status: 'In Stock' },
    { id: 6, name: 'Laptops (Dell)', category: 'Electronics', quantity: 1, location: 'IT Room', status: 'In Stock' },
    { id: 7, name: 'Notebooks (A5)', category: 'Stationery', quantity: 67, location: 'Shelf 1', status: 'In Stock' },
    { id: 8, name: 'USB Flash Drives', category: 'Electronics', quantity: 5, location: 'Drawer B', status: 'Low Stock' },
    { id: 9, name: 'Paper Clips (Box)', category: 'Supplies', quantity: 0, location: 'Shelf 3', status: 'Out of Stock' },
    { id: 10, name: 'Whiteboard Markers', category: 'Stationery', quantity: 24, location: 'Cabinet C', status: 'In Stock' },
    { id: 11, name: 'Office Desks', category: 'Furniture', quantity: 8, location: 'Office Floor', status: 'In Stock' },
    { id: 12, name: 'Wireless Mouse', category: 'Electronics', quantity: 15, location: 'Drawer A', status: 'In Stock' },
    { id: 13, name: 'File Folders', category: 'Supplies', quantity: 42, location: 'Shelf 4', status: 'In Stock' },
    { id: 14, name: 'Printer Paper (Legal)', category: 'Stationery', quantity: 6, location: 'Storage Room', status: 'Low Stock' },
    { id: 15, name: 'Monitor Stands', category: 'Equipment', quantity: 3, location: 'IT Room', status: 'In Stock' }
];

// Load inventory data from localStorage or use default
function loadInventoryData() {
    const stored = localStorage.getItem('inventoryData');
    if (stored) {
        return JSON.parse(stored);
    } else {
        // First time, initialize with default data
        localStorage.setItem('inventoryData', JSON.stringify(defaultInventoryData));
        return [...defaultInventoryData];
    }
}

let inventoryData = loadInventoryData();

// State
let currentPage = 1;
const itemsPerPage = 10;
let filteredData = [...inventoryData];
let sortColumn = null;
let sortDirection = 'asc';
let userRole = 'employee';

// Initialize
function initInventory() {
    if (!checkAuth()) return;
    
    // Get user data
    const username = sessionStorage.getItem('username') || localStorage.getItem('rememberedUser') || 'User';
    userRole = localStorage.getItem('userRole') || 'employee';
    
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
    if (userRole === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'flex';
        });
    }
    
    // Render initial table
    renderTable();
    
    // Setup event listeners
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Search with debouncing
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => handleSearch(e), 300);
    });
    
    // Filters
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Pagination
    document.getElementById('prevBtn').addEventListener('click', () => changePage(-1));
    document.getElementById('nextBtn').addEventListener('click', () => changePage(1));
    
    // Table sorting
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => handleSort(th.dataset.sort));
    });
    
    // Sidebar and navigation
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    
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
        // Focus on cancel button for accessibility
        setTimeout(() => cancelLogout.focus(), 100);
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
}

// Render table
function renderTable() {
    const tbody = document.getElementById('tableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);
    
    tbody.innerHTML = '';
    
    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #9ca3af;">No items found</td></tr>';
        return;
    }
    
    pageData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td><strong>${item.name}</strong></td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>${item.location}</td>
            <td><span class="status-badge status-${item.status.toLowerCase().replace(/ /g, '-')}">${item.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="viewDetails(${item.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn" onclick="editItem(${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    ${userRole === 'admin' ? `
                        <button class="action-btn delete-btn admin-only" onclick="deleteItem(${item.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updatePagination();
}

// Handle search
function handleSearch(e) {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase();
    
    // Start with filtered data from other filters
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredData = [...inventoryData];
    
    // Apply category filter
    if (categoryFilter) {
        filteredData = filteredData.filter(item => item.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
        filteredData = filteredData.filter(item => item.status === statusFilter);
    }
    
    // Apply search query
    if (query) {
        filteredData = filteredData.filter(item => 
            item.name.toLowerCase().includes(query) || 
            item.category.toLowerCase().includes(query)
        );
    }
    
    currentPage = 1;
    renderTable();
}

// Apply filters
function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredData = [...inventoryData];
    
    // Apply category filter
    if (categoryFilter) {
        filteredData = filteredData.filter(item => item.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
        filteredData = filteredData.filter(item => item.status === statusFilter);
    }
    
    // Apply search query
    if (query) {
        filteredData = filteredData.filter(item => 
            item.name.toLowerCase().includes(query) || 
            item.category.toLowerCase().includes(query)
        );
    }
    
    currentPage = 1;
    renderTable();
}

// Reset filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('statusFilter').value = '';
    
    filteredData = [...inventoryData];
    currentPage = 1;
    renderTable();
}

// Handle sorting
function handleSort(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    filteredData.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
        
        if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }
        
        if (sortDirection === 'asc') {
            return valA > valB ? 1 : -1;
        } else {
            return valA < valB ? 1 : -1;
        }
    });
    
    renderTable();
}

// Change page
function changePage(direction) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    currentPage += direction;
    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    renderTable();
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages || totalPages === 0;
}

// View details
function viewDetails(id) {
    const item = inventoryData.find(i => i.id === id);
    if (!item) return;
    
    const modal = document.getElementById('detailsModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Item ID:</span>
            <span class="detail-value">${item.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">${item.name}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Category:</span>
            <span class="detail-value">${item.category}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Quantity:</span>
            <span class="detail-value">${item.quantity}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">${item.location}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value"><span class="status-badge status-${item.status.toLowerCase().replace(/ /g, '-')}">${item.status}</span></span>
        </div>
    `;
    
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('detailsModal').classList.remove('active');
}

// Edit item
let currentEditItem = null;

function editItem(id) {
    const item = inventoryData.find(i => i.id === id);
    if (!item) return;
    
    currentEditItem = item;
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editCategory').value = item.category;
    document.getElementById('editQuantity').value = item.quantity;
    document.getElementById('editStatus').value = item.status;
    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    currentEditItem = null;
}

// Handle edit form submission
document.getElementById('editStatusForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (currentEditItem) {
        const newCategory = document.getElementById('editCategory').value;
        const newQuantity = parseInt(document.getElementById('editQuantity').value);
        const newStatus = document.getElementById('editStatus').value;
        
        const oldCategory = currentEditItem.category;
        const oldQuantity = currentEditItem.quantity;
        const oldStatus = currentEditItem.status;
        
        // Update item
        currentEditItem.category = newCategory;
        currentEditItem.quantity = newQuantity;
        currentEditItem.status = newStatus;
        
        // Save to localStorage
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        
        // Log the change
        console.log(`Item updated: "${currentEditItem.name}"`);
        console.log(`Category: ${oldCategory} → ${newCategory}`);
        console.log(`Quantity: ${oldQuantity} → ${newQuantity}`);
        console.log(`Status: ${oldStatus} → ${newStatus}`);
        console.log(`Updated by: ${sessionStorage.getItem('username') || 'User'}`);
        console.log(`Date: ${new Date().toISOString()}`);
        
        // Close modal
        closeEditModal();
        
        // Re-render table
        applyFilters();
        
        // Show success message
        alert(`Item updated successfully!\n\nItem: ${currentEditItem.name}\nCategory: ${newCategory}\nQuantity: ${newQuantity}\nStatus: ${newStatus}`);
    }
});

// Delete item (admin only)
function deleteItem(id) {
    const item = inventoryData.find(i => i.id === id);
    if (!item) return;
    
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
        // Remove item from array
        const index = inventoryData.findIndex(i => i.id === id);
        if (index > -1) {
            inventoryData.splice(index, 1);
            
            // Save to localStorage
            localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
            
            // Reload data and re-render
            filteredData = [...inventoryData];
            currentPage = 1;
            renderTable();
            
            console.log('Deleted item:', id);
            alert(`Item "${item.name}" has been deleted successfully.`);
        }
    }
}

// Placeholder function
function showPlaceholder(page) {
    console.log(`Navigating to: ${page}`);
    alert(`${page} page is under development. This is a placeholder.`);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initInventory);

// Close modal on outside click
window.addEventListener('click', (e) => {
    const detailsModal = document.getElementById('detailsModal');
    const editModal = document.getElementById('editModal');
    
    if (e.target === detailsModal) {
        closeModal();
    }
    if (e.target === editModal) {
        closeEditModal();
    }
});