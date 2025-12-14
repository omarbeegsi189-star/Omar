// ===============================================
// Cart Management Module
// ===============================================

import { Storage, STORAGE_KEYS, Utils } from './utils.js';

export class CartManager {
    constructor() {
        this.cart = Storage.get(STORAGE_KEYS.CART, []);
        this.init();
    }

    init() {
        this.renderCart();
        this.bindEvents();
    }

    addItem(name, price, image) {
        const existingItem = this.cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                name: name,
                price: parseFloat(price),
                image: image,
                quantity: 1
            });
        }
        this.saveCart();
        Utils.showNotification(`${name} added to cart!`, 'success');
        this.renderCart();
    }

    updateQuantity(name, newQuantity) {
        const item = this.cart.find(item => item.name === name);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
            this.renderCart();
        }
    }

    removeItem(index) {
        const itemName = this.cart[index].name;
        this.cart.splice(index, 1);
        this.saveCart();
        Utils.showNotification(`${itemName} removed from cart!`, 'success');
        this.renderCart();
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    saveCart() {
        Storage.set(STORAGE_KEYS.CART, this.cart);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCart();
    }

    getCartItems() {
        return [...this.cart];
    }

    renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartEmpty = document.getElementById('cart-empty');

        if (!cartItems) return; // Guard clause for pages without cart

        cartItems.innerHTML = '';

        if (this.cart.length === 0) {
            cartTotal.style.display = 'none';
            cartEmpty.style.display = 'block';
            return;
        }

        cartEmpty.style.display = 'none';
        cartTotal.style.display = 'block';

        this.cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-card';
            itemElement.innerHTML = `
                <button class="cart-delete-btn" data-index="${index}">🗑️</button>
                <div class="cart-img-wrapper">
                    <img src="${item.image}" alt="${item.name}" class="cart-img">
                </div>
                <h3 class="cart-name">${item.name}</h3>
                <p class="cart-price">$${(item.price * item.quantity).toFixed(2)}</p>
                <div class="cart-qty-controls">
                    <button class="cart-qty-btn" data-action="decrease" data-index="${index}">-</button>
                    <span class="cart-qty-display">${item.quantity}</span>
                    <button class="cart-qty-btn" data-action="increase" data-index="${index}">+</button>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });

        this.updateTotals();
    }

    updateTotals() {
        const subtotal = this.getTotal();
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;

        const subtotalEl = document.getElementById('subtotal');
        const taxEl = document.getElementById('tax');
        const totalEl = document.getElementById('total');

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }

    bindEvents() {
        // Bind cart events if elements exist
        const cartItems = document.getElementById('cart-items');
        if (!cartItems) return;

        cartItems.addEventListener('click', (e) => {
            const target = e.target;

            if (target.classList.contains('cart-delete-btn')) {
                const index = parseInt(target.dataset.index);
                this.removeItem(index);
            } else if (target.classList.contains('cart-qty-btn')) {
                const index = parseInt(target.dataset.index);
                const action = target.dataset.action;
                const item = this.cart[index];

                if (action === 'increase') {
                    this.updateQuantity(item.name, item.quantity + 1);
                } else if (action === 'decrease') {
                    this.updateQuantity(item.name, Math.max(1, item.quantity - 1));
                }
            }
        });

        // Bind checkout button
        const checkoutBtn = document.querySelector('.cart-checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }
    }

    proceedToCheckout() {
        window.location.href = 'checkout.html';
    }
}

// Export singleton instance for global access
export const cartManager = new CartManager();
