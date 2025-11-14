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

// Mock maintenance reports data
const maintenanceReports = [
    { 
        id: 1, 
        itemName: 'HP Printer', 
        issue: 'Paper jam and printing quality issues', 
        reportedBy: 'Ama Frimpong',
        technician: 'Kwame Mensah',
        dateReported: '2025-11-10',
        status: 'In Progress',
        category: 'Electronics',
        priority: 'High',
        location: 'Office Floor 2'
    },
    { 
        id: 2, 
        itemName: 'Office Chair', 
        issue: 'Broken wheel and armrest', 
        reportedBy: 'Kofi Danso',
        technician: 'Ama Osei',
        dateReported: '2025-11-12',
        status: 'Pending',
        category: 'Furniture',
        priority: 'Medium',
        location: 'Office Floor 1'
    },
    { 
        id: 3, 
        itemName: 'Air Conditioner', 
        issue: 'Not cooling properly', 
        reportedBy: 'Yaa Serwaa',
        technician: 'External Contractor',
        dateReported: '2025-11-08',
        status: 'Completed',
        category: 'Equipment',
        priority: 'Urgent',
        location: 'Conference Room'
    },
    { 
        id: 4, 
        itemName: 'Desktop Computer', 
        issue: 'System slow and frequent crashes', 
        reportedBy: 'Kwesi Boateng',
        technician: 'Kofi Asante',
        dateReported: '2025-11-13',
        status: 'Pending',
        category: 'Electronics',
        priority: 'High',
        location: 'IT Department'
    },
    { 
        id: 5, 
        itemName: 'Conference Table', 
        issue: 'Surface damage and loose legs', 
        reportedBy: 'Efua Mensah',
        technician: 'Ama Osei',
        dateReported: '2025-11-09',
        status: 'Completed',
        category: 'Furniture',
        priority: 'Low',
        location: 'Meeting Room A'
    },
    { 
        id: 6, 
        itemName: 'Projector', 
        issue: 'Display flickering', 
        reportedBy: 'Adjoa Asante',
        technician: 'Kwame Mensah',
        dateReported: '2025-11-11',
        status: 'In Progress',
        category: 'Electronics',
        priority: 'Medium',
        location: 'Conference Room'
    }
];

let filteredReports = [...maintenanceReports];

// Initialize page
function initMaintenance() {
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
            el.style.display = 'flex';
        });
    }
    
    // Render reports table
    renderReportsTable();
    
    // Setup event listeners
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Status filter
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    
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
});    // Top nav scroll effect
    const topNav = document.querySelector('.top-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            topNav.classList.add('scrolled');
        } else {
            topNav.classList.remove('scrolled');
        }
    });
}

// Render reports table
function renderReportsTable() {
    const tbody = document.getElementById('reportsTableBody');
    tbody.innerHTML = '';
    
    if (filteredReports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: #9ca3af;">No reports found</td></tr>';
        return;
    }
    
    filteredReports.forEach(report => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${report.id}</strong></td>
            <td>${report.itemName}</td>
            <td>${report.issue}</td>
            <td>${report.reportedBy}</td>
            <td>${report.technician}</td>
            <td>${new Date(report.dateReported).toLocaleDateString('en-GB')}</td>
            <td><span class="status-badge status-${report.status.toLowerCase().replace(/ /g, '-')}">${report.status}</span></td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="action-btn" onclick="viewReportDetails(${report.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn" onclick="editReport(${report.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Apply filters
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredReports = [...maintenanceReports];
    
    if (statusFilter !== 'all') {
        filteredReports = filteredReports.filter(report => report.status === statusFilter);
    }
    
    renderReportsTable();
}

// Open report form
function openReportForm() {
    document.getElementById('reportModal').classList.add('active');
}

// Close report form
function closeReportForm() {
    document.getElementById('reportModal').classList.remove('active');
    document.getElementById('maintenanceForm').reset();
}

// Handle form submission
document.getElementById('maintenanceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        id: maintenanceReports.length + 1,
        itemName: document.getElementById('itemName').value,
        category: document.getElementById('category').value,
        priority: document.getElementById('priority').value,
        issue: document.getElementById('issueDescription').value,
        technician: document.getElementById('technician').value || 'Not assigned',
        location: document.getElementById('location').value || 'Not specified',
        reportedBy: sessionStorage.getItem('username')?.split('@')[0] || 'User',
        dateReported: new Date().toISOString().split('T')[0],
        status: 'Pending'
    };
    
    // Add to reports array
    maintenanceReports.unshift(formData);
    filteredReports = [...maintenanceReports];
    
    // Log to console
    console.log('New maintenance report submitted:', formData);
    
    // Close modal and re-render
    closeReportForm();
    renderReportsTable();
    
    // Show success message
    alert(`Maintenance report submitted successfully!\n\nReport ID: #${formData.id}\nItem: ${formData.itemName}\nStatus: Pending`);
});

// View report details
function viewReportDetails(id) {
    const report = maintenanceReports.find(r => r.id === id);
    if (!report) return;
    
    const detailsBody = document.getElementById('detailsBody');
    detailsBody.innerHTML = `
        <div class="detail-item">
            <div class="detail-label">Report ID</div>
            <div class="detail-value"><strong>#${report.id}</strong></div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Item Name</div>
            <div class="detail-value">${report.itemName}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Category</div>
            <div class="detail-value">${report.category}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Priority</div>
            <div class="detail-value">${report.priority}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Issue Description</div>
            <div class="detail-value">${report.issue}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Reported By</div>
            <div class="detail-value">${report.reportedBy}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Assigned Technician</div>
            <div class="detail-value">${report.technician}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Location</div>
            <div class="detail-value">${report.location}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Date Reported</div>
            <div class="detail-value">${new Date(report.dateReported).toLocaleDateString('en-GB')}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Status</div>
            <div class="detail-value"><span class="status-badge status-${report.status.toLowerCase().replace(/ /g, '-')}">${report.status}</span></div>
        </div>
    `;
    
    document.getElementById('detailsModal').classList.add('active');
}

// Close details modal
function closeDetailsModal() {
    document.getElementById('detailsModal').classList.remove('active');
}

// Edit report
let currentEditReport = null;

function editReport(id) {
    const report = maintenanceReports.find(r => r.id === id);
    if (!report) return;
    
    currentEditReport = report;
    document.getElementById('editReportId').value = `#${report.id}`;
    document.getElementById('editItemName').value = report.itemName;
    document.getElementById('editTechnician').value = report.technician;
    document.getElementById('editReportStatus').value = report.status;
    document.getElementById('updateNotes').value = '';
    
    document.getElementById('editReportModal').classList.add('active');
}

// Close edit report modal
function closeEditReportModal() {
    document.getElementById('editReportModal').classList.remove('active');
    currentEditReport = null;
}

// Handle edit report form submission
document.getElementById('editReportForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (currentEditReport) {
        const newTechnician = document.getElementById('editTechnician').value;
        const newStatus = document.getElementById('editReportStatus').value;
        const notes = document.getElementById('updateNotes').value;
        
        const oldTechnician = currentEditReport.technician;
        const oldStatus = currentEditReport.status;
        
        // Update report
        currentEditReport.technician = newTechnician;
        currentEditReport.status = newStatus;
        
        // Log the change
        console.log(`Maintenance report updated: #${currentEditReport.id}`);
        console.log(`Item: ${currentEditReport.itemName}`);
        console.log(`Technician: ${oldTechnician} → ${newTechnician}`);
        console.log(`Status: ${oldStatus} → ${newStatus}`);
        if (notes) console.log(`Notes: ${notes}`);
        console.log(`Updated by: ${sessionStorage.getItem('username')?.split('@')[0] || 'User'}`);
        console.log(`Date: ${new Date().toISOString()}`);
        
        // Close modal
        closeEditReportModal();
        
        // Re-render table
        applyFilters();
        
        // Show success message
        let message = `Report updated successfully!\n\nReport ID: #${currentEditReport.id}\nItem: ${currentEditReport.itemName}\nStatus: ${newStatus}`;
        if (newStatus === 'Completed') {
            message += '\n\n✓ Issue marked as resolved!';
        }
        alert(message);
    }
});

// Placeholder function
function showPlaceholder(page) {
    console.log(`Navigating to: ${page}`);
    alert(`${page} page is under development. This is a placeholder.`);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initMaintenance);

// Close modals on outside click
window.addEventListener('click', (e) => {
    const reportModal = document.getElementById('reportModal');
    const detailsModal = document.getElementById('detailsModal');
    const editReportModal = document.getElementById('editReportModal');
    
    if (e.target === reportModal) {
        closeReportForm();
    }
    if (e.target === detailsModal) {
        closeDetailsModal();
    }
    if (e.target === editReportModal) {
        closeEditReportModal();
    }
});