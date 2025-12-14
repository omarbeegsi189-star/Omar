import { DEV_MODE, Storage, STORAGE_KEYS, API, Utils } from './js/utils.js';
import { Favorites } from './js/favorites.js';
import { cartManager } from './js/cart.js';

gsap.registerPlugin(ScrollTrigger);

// Global variables for animation contexts and timelines
let currentCategory = 'main'; // Track current active category
let dishAnimationCtx = null; // GSAP context for dish animations
let volatileAnimationCtx = null; // GSAP context for volatile element animations

// ===============================================
// 1. Header Scroll Animation (unchanged)
// ===============================================
gsap.to(".navbar", {
    y: -100,
    ease: "power2.inOut",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: 99999,
        scrub: true,
        onUpdate: (self) => {
            if (self.direction === 1 && self.progress > 0.05) {
                gsap.to(".navbar", { y: -100, duration: 0.3 });
            } else if (self.direction === -1) {
                gsap.to(".navbar", { y: 0, duration: 0.3 });
            }
        }
    }
});

// ===============================================
// 2. Hero Section Animations (unchanged)
// ===============================================
gsap.from(".hero-content > *", {
    opacity: 0,
    y: 20,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
});

gsap.to(".main-dish-image", {
    y: -80,
    rotation: 5,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

gsap.to(".spoon", {
    y: 100,
    rotation: -15,
    x: 50,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

gsap.to(".deco-top-left-container", {
    y: -300,
    x: -100,
    rotation: -20,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// ===============================================
// 3. Dish Animation Function (with GSAP context)
// ===============================================
function animateDishes() {
    // Kill previous dish animation context to prevent overlaps
    if (dishAnimationCtx) {
        dishAnimationCtx.revert();
    }

    // Create new context for dish animations
    dishAnimationCtx = gsap.context(() => {
        const dishCards = gsap.utils.toArray('.active-category .dish-card, .active-category .menu-card');

        gsap.from(dishCards, {
            scrollTrigger: {
                trigger: ".menu-showcase",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 100,
            rotation: (i) => i % 2 === 0 ? 5 : -5,
            duration: 1.2,
            ease: "power2.out",
            stagger: 0.2,
            immediateRender: false
        });
    });
}

// ===============================================
// 4. Volatile Elements Animation Function (with GSAP context)
// ===============================================
function animateVolatileElements(category) {
    // Kill previous volatile animation context to prevent overlaps
    if (volatileAnimationCtx) {
        volatileAnimationCtx.revert();
    }

    // Create new context for volatile element animations
    volatileAnimationCtx = gsap.context(() => {
        // Define animations for each category
        const animations = {
            main: [
                { selector: ".deco-lobster", y: 200, rotation: 20 },
                { selector: ".deco-peas", y: -150, rotation: -30 }
            ],
            juices: [
                { selector: ".deco-lemon-juice", y: 100, rotation: 10 },
                { selector: ".deco-mint-juice", y: -80, rotation: -15 }
            ],
            dessert: [
                { selector: ".deco-almond-dessert", y: 120, rotation: 20 },
                { selector: ".deco-coconut-dessert", y: -100, rotation: -25 }
            ]
        };

        // Apply animations for the active category
        if (animations[category]) {
            animations[category].forEach(anim => {
                gsap.to(anim.selector, {
                    y: anim.y,
                    rotation: anim.rotation,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".menu-showcase",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            });
        }
    });
}

// ===============================================
// 5. Category Switching Logic (Fixed for proper visibility and accessibility)
// ===============================================
const filterLinks = document.querySelectorAll('.category-link');
const dishContainers = document.querySelectorAll('.dish-category');
const volatileElements = document.querySelectorAll('.volatile-float');

function switchCategory(targetCategory) {
    // Prevent switching to the same category (idempotent)
    if (targetCategory === currentCategory) {
        return;
    }

    // Update current category
    currentCategory = targetCategory;

    // 1. Update active link styling
    filterLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-category') === targetCategory) {
            link.classList.add('active');
        }
    });

    // 2. Handle dish category visibility and accessibility
    // Fixed: Added data-category attributes to dish containers and updated logic to use them for proper toggling.
    // Previously, the logic was incomplete and didn't toggle dish visibility, causing dishes from other categories to appear.
    dishContainers.forEach(container => {
        const containerCategory = container.getAttribute('data-category');
        if (containerCategory === targetCategory) {
            // Show active category dishes
            container.classList.add('active-category');
            container.setAttribute('aria-hidden', 'false');
        } else {
            // Hide inactive category dishes
            container.classList.remove('active-category');
            container.setAttribute('aria-hidden', 'true');
        }
    });

    // 3. Handle volatile elements visibility and accessibility
    volatileElements.forEach(element => {
        const elementCategory = element.getAttribute('data-category');

        if (elementCategory === targetCategory) {
            // Show elements for active category
            element.classList.remove('hidden');
            element.setAttribute('aria-hidden', 'false');
        } else {
            // Hide elements for inactive categories
            element.classList.add('hidden');
            element.setAttribute('aria-hidden', 'true');
        }
    });

    // 4. Animate dishes and volatile elements for new category
    animateDishes();
    animateVolatileElements(targetCategory);

    // 5. Refresh ScrollTrigger to handle new elements
    ScrollTrigger.refresh();
}

// ===============================================
// 6. Event Listeners for Category Links
// ===============================================
const mainCatEl = document.querySelector('[data-category="main"]');
if (mainCatEl) mainCatEl.addEventListener('click', () => switchCategory('main'));
const juicesCatEl = document.querySelector('[data-category="juices"]');
if (juicesCatEl) juicesCatEl.addEventListener('click', () => switchCategory('juices'));
const dessertCatEl = document.querySelector('[data-category="dessert"]');
if (dessertCatEl) dessertCatEl.addEventListener('click', () => switchCategory('dessert'));

// ===============================================
// 6. Today’s Special Animations (New GSAP Context)
// ===============================================
let todaysSpecialCtx = null; // GSAP context for Today’s Special animations

function animateTodaysSpecial() {
    // Kill previous context if exists
    if (todaysSpecialCtx) {
        todaysSpecialCtx.revert();
    }

    // Create new context for Today’s Special animations
    todaysSpecialCtx = gsap.context(() => {
        // Card entrance animation: fade, slide up, and scale on scroll
        gsap.from(".todays-special .dish-card", {
            scrollTrigger: {
                trigger: ".todays-special",
                start: "top 85%", // Trigger when top of section is 85% from viewport top
                toggleActions: "play none none none" // Play once on enter
            },
            y: 100, // Slide up from below
            opacity: 0, // Start transparent
            scale: 0.9, // Slightly smaller
            duration: 1.2, // Animation duration
            ease: "power2.out" // Smooth easing
        });

        // Chopsticks continuous rotation animation (only when visible)
        gsap.to(".chopsticks-float", {
            rotation: 360, // Full rotation
            duration: 3, // Time for one cycle
            ease: "none", // Linear for continuous
            repeat: -1, // Infinite loop
            scrollTrigger: {
                trigger: ".todays-special",
                start: "top 85%", // Start when section is 85% visible
                end: "bottom top", // End when section leaves viewport
                scrub: false, // No scrubbing, just on/off
                toggleActions: "play pause resume pause" // Play when visible, pause when not
            }
        });

        // Parallax effect for chopsticks on scroll (slight bobbing)
        gsap.to(".chopsticks-float", {
            y: -20, // Slight move up as user scrolls
            ease: "none",
            scrollTrigger: {
                trigger: ".todays-special",
                start: "top bottom",
                end: "bottom top",
                scrub: true // Smooth parallax with scroll
            }
        });
    });
}

// Theme toggle handled by theme.js

// ===============================================
// 8. Initialize on Page Load
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    // Set initial state for menu showcase
    switchCategory('main');

    // Initialize Today’s Special animations
    animateTodaysSpecial();

    // Initialize cart functionality
    document.querySelectorAll('.menu-add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.menu-card');
            const name = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.menu-price').textContent;
            const price = parseFloat(priceText.replace('$', ''));
            const image = card.querySelector('.menu-img').src;
            cartManager.addItem(name, price, image);
        });
    });

    // Initialize wishlist functionality
    const favorites = new Favorites();
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const price = e.target.getAttribute('data-price');
            const image = e.target.getAttribute('data-image');
            favorites.toggleFavorite(name, price, image);
        });
    });
});



