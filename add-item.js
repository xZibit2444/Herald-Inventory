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
    
    // Get max ID from Firestore first
    inventoryCollection.orderBy('id', 'desc').limit(1).get().then((snapshot) => {
        let maxId = 0;
        if (!snapshot.empty) {
            maxId = snapshot.docs[0].data().id;
        }
        const newId = maxId + 1;
        
        // Get form data
        const formData = {
            id: newId,
            name: document.getElementById('itemName').value,
            category: document.getElementById('category').value,
            quantity: parseInt(document.getElementById('quantity').value),
            location: document.getElementById('location').value || 'Not specified',
            status: document.getElementById('status').value,
            unitPrice: document.getElementById('unitPrice').value || null,
            supplier: document.getElementById('supplier').value || null,
            description: document.getElementById('description').value || null,
            addedBy: sessionStorage.getItem('username') || 'Unknown',
            addedDate: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Add to Firestore
        return inventoryCollection.add(formData);
    }).then((docRef) => {
        console.log('New item added with ID:', docRef.id);
        
        // Get the added document to show in modal
        return docRef.get();
    }).then((doc) => {
        const formData = doc.data();
        
        // Show success message
        const successMessage = document.getElementById('successMessage');
        successMessage.classList.add('show');
        
        // Show custom success modal
        showSuccessModal(formData);
    }).catch((error) => {
        console.error('Error adding item:', error);
        alert('Error adding item. Please try again.');
    });
});

// Show success modal
function showSuccessModal(formData) {
    const modal = document.getElementById('successModal');
    const detailsDiv = document.getElementById('successDetails');
    
    let detailsHTML = `
        <p><span class="label">Item Name:</span> <span class="value">${formData.name}</span></p>
        <p><span class="label">Category:</span> <span class="value">${formData.category}</span></p>
        <p><span class="label">Quantity:</span> <span class="value">${formData.quantity}</span></p>
    `;
    
    if (formData.location && formData.location !== 'Not specified') {
        detailsHTML += `<p><span class="label">Location:</span> <span class="value">${formData.location}</span></p>`;
    }
    
    detailsHTML += `<p><span class="label">Status:</span> <span class="value">${formData.status}</span></p>`;
    
    detailsDiv.innerHTML = detailsHTML;
    
    modal.classList.add('active');
}

// Reset form
function resetForm() {
    document.getElementById('addItemForm').reset();
    document.getElementById('status').value = 'In Stock'; // Set default status
}

// Success modal button
document.getElementById('viewInventory').addEventListener('click', () => {
    window.location.href = 'inventory-list.html';
});

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

// Close success modal on outside click
const successModal = document.getElementById('successModal');
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        window.location.href = 'inventory-list.html';
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