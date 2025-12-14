const DEV_MODE = true; // Set to false for production

// Utility functions for localStorage
const Storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    }
};

// Standardized localStorage keys
const STORAGE_KEYS = {
    USER: 'healthy_user',
    CART: 'healthy_cart',
    FAVORITES: 'healthy_favorites',
    ORDERS: 'healthy_orders'
};

// API helper functions (backend-ready)
const API = {
    async request(endpoint, options = {}) {
        const baseURL = DEV_MODE ? 'http://localhost:3000/api' : '/api'; // Adjust for production
        const url = `${baseURL}${endpoint}`;

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            // In DEV_MODE, return mock data or throw error
            if (DEV_MODE) {
                console.warn('DEV_MODE: Returning mock data for failed API call');
                return this.getMockData(endpoint);
            }
            throw error;
        }
    },

    getMockData(endpoint) {
        // Mock data for development
        const mocks = {
            '/user/profile': { name: 'John Doe', email: 'john@example.com' },
            '/menu': [
                { id: 1, name: 'Salad', price: 10.99 },
                { id: 2, name: 'Pasta', price: 12.99 }
            ],
            '/cart': [],
            '/orders': []
        };
        return mocks[endpoint] || {};
    },

    // Specific API methods
    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: credentials
        });
    },

    async signup(userData) {
        return this.request('/auth/signup', {
            method: 'POST',
            body: userData
        });
    },



    async getMenu() {
        return this.request('/menu');
    },

    async addToCart(item) {
        return this.request('/cart', {
            method: 'POST',
            body: item
        });
    },

    async getCart() {
        return this.request('/cart');
    },

    async updateCart(cartData) {
        return this.request('/cart', {
            method: 'PUT',
            body: cartData
        });
    },

    async checkout(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: orderData
        });
    },



    async getFavorites() {
        return this.request('/favorites');
    },

    async addFavorite(favoriteData) {
        return this.request('/favorites', {
            method: 'POST',
            body: favoriteData
        });
    },

    async removeFavorite(name) {
        return this.request(`/favorites/${encodeURIComponent(name)}`, {
            method: 'DELETE'
        });
    }
};

// General utility functions
const Utils = {
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    showNotification: (message, type = 'info') => {
        // Simple notification system - can be enhanced
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: ${type === 'error' ? '#ff4d4d' : type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Add notification styles
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

export { DEV_MODE, Storage, STORAGE_KEYS, API, Utils };
