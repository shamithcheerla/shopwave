// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu) {
    mobileMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Toggle bar animations
        const bars = this.querySelectorAll('.bar');
        if (this.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking on a menu item
document.querySelectorAll('.nav-menu a').forEach(item => {
    item.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            const bars = mobileMenu.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
});

// Sample product data (in a real app, this would come from a database or API)
const products = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 79.99,
        oldPrice: 99.99,
        discountPercentage: 20,
        image: "buds.jpg",
        rating: 4.5,
        featured: true
    },
    {
        id: 2,
        title: "Smart Fitness Tracker",
        category: "Electronics",
        price: 49.99,
        oldPrice: 69.99,
        discountPercentage: 29,
        image: "watch.jpg",
        rating: 4.3,
        featured: true
    },
    {
        id: 3,
        title: "Premium Cotton T-Shirt",
        category: "Fashion",
        price: 24.99,
        oldPrice: 29.99,
        discountPercentage: 17,
        image: "cottontshirt.jpg",
        rating: 4.8,
        featured: true
    },
    {
        id: 4,
        title: "Stainless Steel Water Bottle",
        category: "Home & Kitchen",
        price: 19.99,
        oldPrice: 29.99,
        discountPercentage: 33,
        image: "bottle.jpg",
        rating: 4.7,
        featured: true
    },
    {
        id: 5,
        title: "Organic Face Moisturizer",
        category: "Beauty",
        price: 34.99,
        oldPrice: 44.99,
        discountPercentage: 22,
        image: "face.jpg",
        rating: 4.6,
        featured: false
    },
    {
        id: 6,
        title: "Wireless Charging Pad",
        category: "Electronics",
        price: 29.99,
        oldPrice: 39.99,
        discountPercentage: 25,
        image: "charging.jpg",
        rating: 4.4,
        featured: false
    },
    {
        id: 7,
        title: "Apple macbook",
        category: "Fashion",
        price: 39.99,
        oldPrice: 49.99,
        discountPercentage: 20,
        image: "mac.jpg",
        rating: 4.5,
        featured: false
    },
    {
        id: 8,
        title: "Smart LED Bulb",
        category: "Home & Kitchen",
        price: 15.99,
        oldPrice: 19.99,
        discountPercentage: 20,
        image: "led.jpg",
        rating: 4.2,
        featured: true
    }
];

// Preload product images to ensure they're ready before display
function preloadImages() {
    products.forEach(product => {
        const img = new Image();
        img.src = product.image;
    });
}

// Function to generate product HTML with improved image handling
function generateProductHTML(product) {
    // Generate star rating
    let starsHTML = '';
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Calculate remaining empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" onerror="this.onerror=null;this.src='/api/placeholder/250/250';">
                ${product.discountPercentage ? `<span class="discount-tag">-${product.discountPercentage}%</span>` : ''}
                <div class="product-actions">
                    <button class="action-btn" title="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" title="Compare">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.title}</h3>
                <div class="rating">
                    ${starsHTML}
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Add to Cart Functionality
function addToCart(e) {
    e.preventDefault();
    const productCard = this.closest('.product-card');
    const productId = parseInt(productCard.dataset.id);
    const productTitle = productCard.querySelector('.product-title').textContent;
    const productPrice = parseFloat(productCard.querySelector('.current-price').textContent.replace('$', ''));
    const productImage = productCard.querySelector('.product-image img').src;

    // Retrieve cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product is already in the cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            title: productTitle,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show toast notification
    showToast(`Added "${productTitle}" to cart!`);

    // Update cart count
    updateCartCount();
}

// Update cart count in the navigation bar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);
    }
}

// Attach event listeners for cart functionality
function attachCartEventListeners() {
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Add event listeners to wishlist buttons
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            if (this.title === "Add to Wishlist") {
                toggleWishlist(this);
            } else if (this.title === "Quick View") {
                showQuickView(this);
            }
        });
    });
}

// Wishlist Functionality
function toggleWishlist(button) {
    const icon = button.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#dc3545';
        showToast("Added to your wishlist!");
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '';
        showToast("Removed from your wishlist!");
    }
}

// Quick View Functionality
function showQuickView(button) {
    const productCard = button.closest('.product-card');
    const productId = productCard.dataset.id;
    const product = products.find(p => p.id === parseInt(productId));
    
    alert(`Quick view for ${product.title} - $${product.price}\nFeature coming soon!`);
}

// Toast Notification System
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
        
        // Add styles for toast if not already in CSS
        if (!document.querySelector('style#toast-style')) {
            const style = document.createElement('style');
            style.id = 'toast-style';
            style.textContent = `
                .toast {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #333;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 4px;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s, visibility 0.3s;
                    z-index: 1000;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
                }
                .toast.show {
                    opacity: 1;
                    visibility: visible;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Newsletter Subscription
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // In a real application, you would send this to a backend
        console.log(`Newsletter subscription for: ${email}`);
        
        // Show success message
        showToast("Thanks for subscribing to our newsletter!");
        
        // Reset form
        this.reset();
    });
}

// Cart object for managing shopping cart
const cart = {
    items: [],
    
    addItem: function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error(`Product with ID ${productId} not found`);
            return;
        }
        
        console.log("Adding product to cart:", product);
        
        const existingItem = this.items.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productId,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        console.log("Cart contents after adding:", this.items);
        this.saveCart();
    },
    
    removeItem: function(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        updateCartPanel();
    },
    
    updateQuantity: function(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
            updateCartPanel();
        }
    },
    
    getTotal: function() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },
    
    getItemCount: function() {
        return this.items.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
    },
    
    saveCart: function() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartUI();
    },
    
    loadCart: function() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                this.items = JSON.parse(savedCart);
                console.log("Loaded cart from storage:", this.items);
                this.updateCartUI();
            } catch (e) {
                console.error("Error loading cart from localStorage:", e);
                this.items = [];
            }
        }
    },
    
    updateCartUI: function() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
        
        // Also update the cart panel if it's open
        updateCartPanel();
    },
    
    clearCart: function() {
        this.items = [];
        this.saveCart();
        updateCartPanel();
    }
};

// Cart Panel Functionality
function createCartPanel() {
    // Check if the cart panel already exists
    if (document.getElementById('cart-panel')) return;
    
    // Create cart panel elements
    const cartPanel = document.createElement('div');
    cartPanel.id = 'cart-panel';
    cartPanel.className = 'cart-panel';
    
    const cartHeader = document.createElement('div');
    cartHeader.className = 'cart-header';
    cartHeader.innerHTML = `
        <h3>Your Cart</h3>
        <button id="close-cart" class="close-cart">×</button>
    `;
    
    const cartContent = document.createElement('div');
    cartContent.className = 'cart-content';
    cartContent.id = 'cart-content';
    
    const cartFooter = document.createElement('div');
    cartFooter.className = 'cart-footer';
    cartFooter.innerHTML = `
        <div class="cart-total">
            <span>Total:</span>
            <span id="cart-total-price">$0.00</span>
        </div>
        <div class="cart-actions">
            <button id="clear-cart" class="clear-cart">Clear Cart</button>
            <button id="checkout" class="checkout">Checkout</button>
        </div>
    `;
    
    // Append elements to cart panel
    cartPanel.appendChild(cartHeader);
    cartPanel.appendChild(cartContent);
    cartPanel.appendChild(cartFooter);
    
    // Append cart panel to body
    document.body.appendChild(cartPanel);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .cart-panel {
            position: fixed;
            top: 0;
            right: -400px;
            width: 350px;
            height: 100vh;
            background-color: white;
            box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        
        .cart-panel.active {
            right: 0;
        }
        
        .cart-header {
            padding: 15px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .cart-header h3 {
            margin: 0;
        }
        
        .close-cart {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
        
        .cart-content {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
        }
        
        .cart-item {
            display: flex;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .cart-item-image {
            width: 80px;
            height: 80px;
            margin-right: 15px;
        }
        
        .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .cart-item-details {
            flex: 1;
        }
        
        .cart-item-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .cart-item-price {
            color: #333;
            margin-bottom: 5px;
        }
        
        .cart-item-quantity {
            display: flex;
            align-items: center;
        }
        
        .quantity-btn {
            background: #f5f5f5;
            border: 1px solid #ddd;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        
        .quantity-input {
            width: 40px;
            height: 25px;
            text-align: center;
            border: 1px solid #ddd;
            margin: 0 5px;
        }
        
        .cart-item-remove {
            color: #dc3545;
            background: none;
            border: none;
            cursor: pointer;
            margin-left: 10px;
        }
        
        .cart-footer {
            padding: 15px;
            border-top: 1px solid #eee;
        }
        
        .cart-total {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .cart-actions {
            display: flex;
            justify-content: space-between;
        }
        
        .clear-cart, .checkout {
            padding: 10px 15px;
            border: none;
            cursor: pointer;
        }
        
        .clear-cart {
            background-color: #f5f5f5;
            color: #333;
        }
        
        .checkout {
            background-color: #4CAF50;
            color: white;
        }
        
        .empty-cart-message {
            text-align: center;
            margin-top: 50px;
            color: #999;
        }
    `;
    document.head.appendChild(style);
    
    // Add event listeners
    document.getElementById('close-cart').addEventListener('click', toggleCartPanel);
    document.getElementById('clear-cart').addEventListener('click', function() {
        cart.clearCart();
    });
    document.getElementById('checkout').addEventListener('click', function() {
        alert('Checkout functionality coming soon!');
    });
}

// Toggle Cart Panel
function toggleCartPanel() {
    // Create the cart panel if it doesn't exist
    if (!document.getElementById('cart-panel')) {
        createCartPanel();
    }
    
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.classList.toggle('active');
    
    // Update cart content when opening
    if (cartPanel.classList.contains('active')) {
        updateCartPanel();
    }
}

// Update Cart Panel Contents
function updateCartPanel() {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;
    
    if (cart.items.length === 0) {
        cartContent.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
    } else {
        let cartItemsHTML = '';
        
        cart.items.forEach(item => {
            cartItemsHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}" onerror="this.onerror=null;this.src='/api/placeholder/80/80';">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateItemQuantity(${item.id}, this.value)">
                            <button class="quantity-btn plus" onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            <button class="cart-item-remove" onclick="removeCartItem(${item.id})">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartContent.innerHTML = cartItemsHTML;
    }
    
    // Update total price
    const totalPriceElement = document.getElementById('cart-total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `$${cart.getTotal().toFixed(2)}`;
    }
}

// Add these global functions to update cart items
function updateItemQuantity(productId, quantity) {
    quantity = parseInt(quantity);
    if (quantity < 1) quantity = 1;
    cart.updateQuantity(productId, quantity);
}

function removeCartItem(productId) {
    cart.removeItem(productId);
}

// Initialize animations for product cards
function initializeAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    
    // Use Intersection Observer to add animations as products come into view
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        productCards.forEach(card => {
            observer.observe(card);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        productCards.forEach(card => {
            card.classList.add('animated');
        });
    }
}

// Filter products by category
function filterProducts(category) {
    const productContainer = document.getElementById('products-container');
    if (!productContainer) return;
    
    let filteredProducts;
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    let productsHTML = '';
    filteredProducts.forEach(product => {
        productsHTML += generateProductHTML(product);
    });
    
    productContainer.innerHTML = productsHTML;
    
    // Add event listeners to new product cards
    attachCartEventListeners();
    
    // Initialize animations for newly loaded products
    initializeAnimations();
}

// Load featured products
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (!featuredProductsContainer) return;
    
    const featuredProducts = products.filter(product => product.featured);
    let productsHTML = '';
    
    featuredProducts.forEach(product => {
        productsHTML += generateProductHTML(product);
    });
    
    featuredProductsContainer.innerHTML = productsHTML;
    
    // Add event listeners to product buttons
    attachCartEventListeners();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Preload product images
    preloadImages();
    
    // Load featured products
    loadFeaturedProducts();
    
    // Load the cart from local storage
    cart.loadCart();
    
    // Setup shopping cart icon click handler
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleCartPanel();
        });
    }
    
    // Initialize animations
    initializeAnimations();
    
    // Add category filter event listeners
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all filters
            categoryFilters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Get category and filter products
            const category = this.dataset.category;
            filterProducts(category);
        });
    });

    // Update cart count on page load
    updateCartCount();
});