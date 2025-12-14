// Admin Dashboard JavaScript
// Backend Integration with async API calls and error handling

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API URL
const API_ENDPOINTS = {
    // Dashboard
    DASHBOARD_STATS: '/admin/dashboard/stats',

    // Orders
    ORDERS: '/admin/orders',
    ORDER_STATUS: '/admin/orders/status',

    // Menu Management
    MENU_ITEMS: '/admin/menu/items',
    MENU_CATEGORIES: '/admin/menu/categories',

    // Promotions
    PROMOTIONS: '/admin/promotions',

    // Reports
    REPORTS: '/admin/reports'
};

// Utility functions for API calls
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
        }
    };

    try {
        const response = await fetch(url, { ...defaultOptions, ...options });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

// Error handling and notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;

    // Set colors based on type
    const colors = {
        success: '#66bb6a',
        error: '#ef5350',
        warning: '#ff9800',
        info: '#2196f3'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function showLoading(element, show = true) {
    if (show) {
        element.style.opacity = '0.6';
        element.style.pointerEvents = 'none';
        const loader = document.createElement('div');
        loader.className = 'loading-spinner';
        loader.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #E94560;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        element.style.position = 'relative';
        element.appendChild(loader);
    } else {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
        const loader = element.querySelector('.loading-spinner');
        if (loader) loader.remove();
    }
}

// Reusing existing theme toggle functionality

// Theme Toggle Functionality (reusing from theme.js)
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Function to set theme
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
    } else {
        body.classList.remove('dark-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀';
    }
    localStorage.setItem('theme', theme);
}

// Function to toggle theme
function toggleTheme() {
    const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Load saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Listen for theme changes from other tabs/windows
window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
        setTheme(e.newValue);
    }
});

// Add event listener to theme toggle button
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

// Sidebar toggle for both desktop and mobile
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const adminContainer = document.querySelector('.admin-container');

if (hamburger && sidebar && adminContainer) {
    hamburger.addEventListener('click', () => {
        if (window.innerWidth > 768) {
            // Desktop: toggle sidebar visibility
            adminContainer.classList.toggle('sidebar-hidden');
        } else {
            // Mobile: toggle sidebar open/close
            sidebar.classList.toggle('open');
        }
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// Navigation active state
const navLinks = document.querySelectorAll('.sidebar a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Logout functionality
const logoutBtn = document.querySelector('.logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Placeholder for logout functionality
        alert('Logout functionality to be implemented');
    });
}

// Form submissions with backend integration
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const formId = form.id;

        try {
            showLoading(form, true);

            switch (formId) {
                case 'add-category-form':
                    await addCategory(Object.fromEntries(formData));
                    break;
                case 'add-dish-form':
                    await addMenuItem(Object.fromEntries(formData));
                    break;
                case 'status-update-form':
                    await updateOrderStatus(Object.fromEntries(formData));
                    break;
                case 'add-promotion-form':
                    await addPromotion(Object.fromEntries(formData));
                    break;
                case 'search-filter-form':
                    await filterOrders(Object.fromEntries(formData));
                    break;
                default:
                    showNotification('Form submission not implemented yet', 'warning');
            }
        } catch (error) {
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            showLoading(form, false);
        }
    });
});

// Dashboard functions
async function loadDashboardStats() {
    try {
        const stats = await apiRequest(API_ENDPOINTS.DASHBOARD_STATS);
        updateDashboardStats(stats);
    } catch (error) {
        showNotification('Failed to load dashboard stats', 'error');
        console.error('Dashboard stats error:', error);
    }
}

function updateDashboardStats(stats) {
    // Update stats cards with data from API
    const statElements = document.querySelectorAll('[data-api-target]');
    statElements.forEach(element => {
        const target = element.dataset.apiTarget;
        if (stats[target] !== undefined) {
            element.textContent = stats[target];
        }
    });
}

// Order management functions
async function loadOrders(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const orders = await apiRequest(`${API_ENDPOINTS.ORDERS}?${queryParams}`);
        updateOrdersTable(orders);
    } catch (error) {
        showNotification('Failed to load orders', 'error');
        console.error('Load orders error:', error);
    }
}

async function updateOrderStatus(data) {
    try {
        const response = await apiRequest(API_ENDPOINTS.ORDER_STATUS, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        showNotification('Order status updated successfully', 'success');
        // Refresh orders list
        await loadOrders();
    } catch (error) {
        showNotification('Failed to update order status', 'error');
        throw error;
    }
}

async function filterOrders(filters) {
    await loadOrders(filters);
}

function updateOrdersTable(orders) {
    const tbody = document.querySelector('#orders-table tbody');
    if (!tbody) return;

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.items}</td>
            <td>$${order.total}</td>
            <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
            <td>${order.date}</td>
            <td><button class="btn btn-secondary">View</button></td>
        </tr>
    `).join('');
}

// Menu management functions
async function loadMenuItems() {
    try {
        const items = await apiRequest(API_ENDPOINTS.MENU_ITEMS);
        updateMenuTable(items);
    } catch (error) {
        showNotification('Failed to load menu items', 'error');
        console.error('Load menu items error:', error);
    }
}

async function addMenuItem(data) {
    try {
        const response = await apiRequest(API_ENDPOINTS.MENU_ITEMS, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        showNotification('Menu item added successfully', 'success');
        await loadMenuItems();
    } catch (error) {
        showNotification('Failed to add menu item', 'error');
        throw error;
    }
}

async function addCategory(data) {
    try {
        const response = await apiRequest(API_ENDPOINTS.MENU_CATEGORIES, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        showNotification('Category added successfully', 'success');
        // Refresh categories in forms
        await loadCategories();
    } catch (error) {
        showNotification('Failed to add category', 'error');
        throw error;
    }
}

async function loadCategories() {
    try {
        const categories = await apiRequest(API_ENDPOINTS.MENU_CATEGORIES);
        updateCategorySelects(categories);
    } catch (error) {
        console.error('Load categories error:', error);
    }
}

function updateCategorySelects(categories) {
    const selects = document.querySelectorAll('#dish-category');
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select Category</option>' +
            categories.map(cat => `<option value="${cat.id}" ${cat.id === currentValue ? 'selected' : ''}>${cat.name}</option>`).join('');
    });
}

function updateMenuTable(items) {
    const tbody = document.querySelector('#menu-items-table tbody');
    if (!tbody) return;

    tbody.innerHTML = items.map(item => `
        <tr>
            <td><img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"></td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>$${item.price}</td>
            <td>${item.description}</td>
            <td>
                <button class="btn btn-secondary" style="margin-right: 5px;">Edit</button>
                <button class="btn" style="background-color: #ef5350;">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Promotion management functions
async function loadPromotions() {
    try {
        const promotions = await apiRequest(API_ENDPOINTS.PROMOTIONS);
        updatePromotionsTable(promotions);
    } catch (error) {
        showNotification('Failed to load promotions', 'error');
        console.error('Load promotions error:', error);
    }
}

async function addPromotion(data) {
    try {
        const response = await apiRequest(API_ENDPOINTS.PROMOTIONS, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        showNotification('Promotion added successfully', 'success');
        await loadPromotions();
    } catch (error) {
        showNotification('Failed to add promotion', 'error');
        throw error;
    }
}

async function togglePromotion(id, enabled) {
    try {
        const response = await apiRequest(`${API_ENDPOINTS.PROMOTIONS}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ enabled })
        });
        showNotification(`Promotion ${enabled ? 'enabled' : 'disabled'} successfully`, 'success');
    } catch (error) {
        showNotification('Failed to update promotion status', 'error');
        throw error;
    }
}

function updatePromotionsTable(promotions) {
    const tbody = document.querySelector('#promotions-table tbody');
    if (!tbody) return;

    tbody.innerHTML = promotions.map(promo => `
        <tr>
            <td>${promo.name}</td>
            <td>${promo.description}</td>
            <td>${promo.discount}%</td>
            <td>${promo.expiryDate}</td>
            <td><span class="promo-status" style="color: ${promo.enabled ? '#66bb6a' : '#ef5350'};">${promo.enabled ? 'Enabled' : 'Disabled'}</span></td>
            <td>
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" class="promo-toggle" ${promo.enabled ? 'checked' : ''} data-id="${promo.id}">
                    <button class="btn btn-secondary" style="margin-left: 10px;">Edit</button>
                    <button class="btn" style="background-color: #ef5350;">Delete</button>
                </label>
            </td>
        </tr>
    `).join('');
}

// Reports functions
async function loadReports(period = 'monthly') {
    try {
        const reports = await apiRequest(`${API_ENDPOINTS.REPORTS}?period=${period}`);
        updateReports(reports);
    } catch (error) {
        showNotification('Failed to load reports', 'error');
        console.error('Load reports error:', error);
    }
}

function updateReports(data) {
    // Update revenue summary cards
    if (data.summary) {
        Object.keys(data.summary).forEach(key => {
            const element = document.querySelector(`[data-report-target="${key}"]`);
            if (element) element.textContent = data.summary[key];
        });
    }

    // Update charts (placeholder for Chart.js integration)
    if (data.charts) {
        initializeCharts(data.charts);
    }

    // Update top selling items table
    if (data.topItems) {
        updateTopItemsTable(data.topItems);
    }
}

function updateTopItemsTable(items) {
    const tbody = document.querySelector('#top-items-table tbody');
    if (!tbody) return;

    tbody.innerHTML = items.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.orders}</td>
            <td>$${item.revenue}</td>
        </tr>
    `).join('');
}

// Order status update functionality
const statusSelects = document.querySelectorAll('.status-select');
statusSelects.forEach(select => {
    select.addEventListener('change', function() {
        const status = this.value;
        const row = this.closest('tr');
        const statusBadge = row.querySelector('.status');

        // Update status badge
        statusBadge.className = `status ${status.toLowerCase()}`;
        statusBadge.textContent = status;

        // Show feedback animation
        statusBadge.style.animation = 'none';
        setTimeout(() => {
            statusBadge.style.animation = 'fadeIn 0.5s ease-out';
        }, 10);

        // Placeholder for backend update
        console.log(`Order status updated to: ${status}`);
    });
});

// Promotion toggle functionality
const promoToggles = document.querySelectorAll('.promo-toggle');
promoToggles.forEach(toggle => {
    toggle.addEventListener('change', function() {
        const isEnabled = this.checked;
        const row = this.closest('tr');
        const statusCell = row.querySelector('.promo-status');

        statusCell.textContent = isEnabled ? 'Enabled' : 'Disabled';
        statusCell.style.color = isEnabled ? '#66bb6a' : '#ef5350';

        // Placeholder for backend update
        console.log(`Promotion ${isEnabled ? 'enabled' : 'disabled'}`);
    });
});

// Image preview for dish upload
const imageInputs = document.querySelectorAll('.image-input');
imageInputs.forEach(input => {
    input.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = input.nextElementSibling;
                if (preview && preview.classList.contains('image-preview')) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    });
});

// Cards are visible by default - no animation needed

// Placeholder for Chart.js integration (Reports page)
function initializeCharts() {
    // This would normally initialize Chart.js charts
    // For now, just log that charts are ready
    console.log('Charts placeholder - ready for Chart.js integration');
}

// Page-specific initialization
document.addEventListener('DOMContentLoaded', function() {
    // Dashboard page
    if (document.querySelector('#dashboard-stats')) {
        loadDashboardStats();
    }

    // Orders page
    if (document.querySelector('#orders-table')) {
        loadOrders();
    }

    // Menu management page
    if (document.querySelector('#menu-items-table')) {
        loadMenuItems();
        loadCategories();
    }

    // Order status page
    if (document.querySelector('#status-update-section')) {
        // Load pending orders for status updates
        loadPendingOrders();
    }

    // Promotions page
    if (document.querySelector('#promotions-table')) {
        loadPromotions();
    }

    // Reports page
    if (document.querySelector('#sales-chart-container')) {
        loadReports();
        initializeCharts();

        // Handle report period changes
        const reportPeriodSelect = document.getElementById('report-period');
        const generateReportBtn = document.getElementById('generate-report-btn');

        if (reportPeriodSelect && generateReportBtn) {
            generateReportBtn.addEventListener('click', () => {
                loadReports(reportPeriodSelect.value);
            });
        }
    }
});

// Load pending orders for status updates
async function loadPendingOrders() {
    try {
        const orders = await apiRequest(`${API_ENDPOINTS.ORDERS}?status=pending,accepted`);
        updatePendingOrdersTable(orders);
    } catch (error) {
        showNotification('Failed to load pending orders', 'error');
        console.error('Load pending orders error:', error);
    }
}

function updatePendingOrdersTable(orders) {
    const pendingTable = document.querySelector('#pending-orders-section table tbody');
    const acceptedTable = document.querySelector('#accepted-orders-table tbody');

    if (pendingTable) {
        const pendingOrders = orders.filter(order => order.status === 'pending');
        pendingTable.innerHTML = pendingOrders.map(order => `
            <tr data-order-id="${order.id}">
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.items}</td>
                <td>$${order.total}</td>
                <td><span class="status pending">Pending</span></td>
                <td>
                    <select class="status-select" data-order-id="${order.id}">
                        <option value="pending" selected>Pending</option>
                        <option value="accepted">Accept</option>
                        <option value="rejected">Reject</option>
                    </select>
                </td>
            </tr>
        `).join('');
    }

    if (acceptedTable) {
        const acceptedOrders = orders.filter(order => order.status === 'accepted');
        acceptedTable.innerHTML = acceptedOrders.map(order => `
            <tr data-order-id="${order.id}">
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.items}</td>
                <td>$${order.total}</td>
                <td><span class="status accepted">Accepted</span></td>
                <td>
                    <select class="status-select" data-order-id="${order.id}">
                        <option value="accepted" selected>Accepted</option>
                        <option value="delivered">Mark as Delivered</option>
                    </select>
                </td>
            </tr>
        `).join('');
    }

    // Re-attach event listeners for status selects
    attachStatusSelectListeners();
}

function attachStatusSelectListeners() {
    const statusSelects = document.querySelectorAll('.status-select');
    statusSelects.forEach(select => {
        select.addEventListener('change', async function() {
            const newStatus = this.value;
            const orderId = this.dataset.orderId;
            const row = this.closest('tr');
            const statusBadge = row.querySelector('.status');

            try {
                showLoading(row, true);
                await updateOrderStatus({ orderId, status: newStatus });

                // Update UI
                statusBadge.className = `status ${newStatus.toLowerCase()}`;
                statusBadge.textContent = newStatus;

                // Move order to appropriate section if needed
                if (newStatus === 'accepted' || newStatus === 'delivered') {
                    setTimeout(() => loadPendingOrders(), 1000); // Refresh after animation
                }
            } catch (error) {
                // Revert select on error
                const currentStatus = statusBadge.textContent.toLowerCase();
                this.value = currentStatus;
                showNotification('Failed to update order status', 'error');
            } finally {
                showLoading(row, false);
            }
        });
    });
}

// Utility functions for backend integration placeholders
function showNotification(message, type = 'info') {
    // Placeholder for notification system
    alert(`${type.toUpperCase()}: ${message}`);
}

function confirmAction(message) {
    return confirm(message);
}

// Export functions for potential backend integration
window.AdminUtils = {
    showNotification,
    confirmAction,
    setTheme,
    toggleTheme
};
