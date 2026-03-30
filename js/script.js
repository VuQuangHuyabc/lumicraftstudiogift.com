// Lumi Craft Studio Gift LLC - E-commerce JavaScript

// Product data based on available images
const products = [
    {
        id: 1,
        name: "Classic Crystal Chandelier",
        price: 899.99,
        oldPrice: 1299.99,
        description: "Elegant crystal chandelier with traditional design and premium materials.",
        images: ["main-image-1.jpeg", "main-image-2.jpeg", "main-image-3.jpeg", "main-image-4.jpeg"],
        category: "Traditional",
        variants: {
            size: ["Small", "Medium", "Large"],
            color: ["Brass", "Bronze", "Silver"]
        }
    },
    {
        id: 2,
        name: "Modern LED Chandelier",
        price: 749.99,
        oldPrice: 1099.99,
        description: "Contemporary LED chandelier with energy-efficient lighting and sleek design.",
        images: ["main-image-1.jpeg", "main-image-2.jpeg", "main-image-3.jpeg", "main-image-4.jpeg"],
        category: "Modern",
        variants: {
            size: ["Small", "Medium", "Large"],
            color: ["Chrome", "Black", "White"]
        }
    },
    {
        id: 3,
        name: "Rustic Farmhouse Chandelier",
        price: 599.99,
        oldPrice: 899.99,
        description: "Handcrafted farmhouse-style chandelier with rustic charm and warm lighting.",
        images: ["main-image-1.jpeg", "main-image-2.jpeg", "main-image-3.jpeg", "main-image-4.jpeg"],
        category: "Rustic",
        variants: {
            size: ["Medium", "Large"],
            color: ["Bronze", "Iron", "Wood"]
        }
    },
    {
        id: 4,
        name: "Luxury Palace Chandelier",
        price: 1599.99,
        oldPrice: 2299.99,
        description: "Grand palace-style chandelier with intricate crystal work and gold finish.",
        images: ["main-image-1.jpeg", "main-image-2.jpeg", "main-image-3.jpeg", "main-image-4.jpeg"],
        category: "Luxury",
        variants: {
            size: ["Large", "Extra Large"],
            color: ["Gold", "Silver", "Bronze"]
        }
    },
    {
        id: 5,
        name: "Minimalist Pendant Chandelier",
        price: 449.99,
        oldPrice: 699.99,
        description: "Sleek minimalist design perfect for modern interiors and clean spaces.",
        images: ["main-image-1.jpeg", "main-image-2.jpeg", "main-image-3.jpeg", "main-image-4.jpeg"],
        category: "Modern",
        variants: {
            size: ["Small", "Medium"],
            color: ["Black", "White", "Chrome"]
        }
    },
    {
        id: 6,
        name: "Vintage Art Deco Chandelier",
        price: 1199.99,
        oldPrice: 1799.99,
        description: "Art Deco inspired chandelier with geometric patterns and vintage elegance.",
        images: ["main-image-1.jpeg", "main-image-2.jpeg", "main-image-3.jpeg", "main-image-4.jpeg"],
        category: "Vintage",
        variants: {
            size: ["Medium", "Large"],
            color: ["Gold", "Silver", "Brass"]
        }
    }
];

// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const savedCart = localStorage.getItem('lumicraft_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('lumicraft_cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(product, quantity = 1, variants = {}) {
        const existingItem = this.items.find(item => 
            item.id === product.id && 
            JSON.stringify(item.variants) === JSON.stringify(variants)
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity,
                variants,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.showNotification(`${product.name} added to cart!`, 'success');
    }

    removeItem(productId, variants = {}) {
        this.items = this.items.filter(item => 
            !(item.id === productId && JSON.stringify(item.variants) === JSON.stringify(variants))
        );
        this.saveCart();
        this.showNotification('Item removed from cart', 'info');
    }

    updateQuantity(productId, quantity, variants = {}) {
        const item = this.items.find(item => 
            item.id === productId && JSON.stringify(item.variants) === JSON.stringify(variants)
        );
        
        if (item) {
            item.quantity = quantity;
            this.saveCart();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.showNotification('Cart cleared', 'info');
    }

    updateCartCount() {
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            countElement.textContent = this.getItemCount();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.className = `notification ${type} show`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
}

// Initialize cart
const cart = new ShoppingCart();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load products on home page
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }

    // Load products on products page
    if (document.getElementById('products-grid')) {
        loadAllProducts();
        setupProductFilters();
    }

    // Load product detail page
    if (document.getElementById('product-title')) {
        loadProductDetail();
    }

    // Load cart page
    if (document.getElementById('cart-items-container')) {
        loadCartItems();
    }

    // Setup event listeners
    setupEventListeners();
});

// Load featured products for home page
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const featuredProducts = products.slice(0, 3);
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

// Load all products for products page
function loadAllProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;

    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
    const imagePath = `Products/${product.id}/${product.images[0]}`;
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="product-card">
                <div class="product-image">
                    <img src="${imagePath}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price-section">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <span class="product-old-price">$${product.oldPrice.toFixed(2)}</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                    </button>
                    <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary w-100 mt-2">
                        View Details
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.addItem(product);
    }
}

// Load product detail page
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Update breadcrumb
    const breadcrumb = document.getElementById('product-name-breadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = product.name;
    }

    // Update main image
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = `Products/${product.id}/${product.images[0]}`;
        mainImage.alt = product.name;
    }

    // Update thumbnails
    const thumbnailContainer = document.getElementById('thumbnail-images');
    if (thumbnailContainer) {
        thumbnailContainer.innerHTML = product.images.map((img, index) => `
            <img src="Products/${product.id}/${img}" alt="Thumbnail ${index + 1}" 
                 class="thumbnail ${index === 0 ? 'active' : ''}" 
                 onclick="changeMainImage('Products/${product.id}/${img}', this)">
        `).join('');
    }

    // Update product info
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-old-price').textContent = `$${product.oldPrice.toFixed(2)}`;
    document.getElementById('product-description').textContent = product.description;

    // Setup add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            const quantity = parseInt(document.getElementById('quantity-input').value);
            const selectedSize = document.querySelector('.variant-option[data-size].selected')?.dataset.size;
            const selectedColor = document.querySelector('.variant-option[data-color].selected')?.dataset.color;
            
            const variants = {};
            if (selectedSize) variants.size = selectedSize;
            if (selectedColor) variants.color = selectedColor;
            
            cart.addItem(product, quantity, variants);
        };
    }

    // Load related products
    loadRelatedProducts(productId);
}

// Change main product image
function changeMainImage(imageSrc, thumbnail) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = imageSrc;
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        thumbnail.classList.add('active');
    }
}

// Load related products
function loadRelatedProducts(currentProductId) {
    const container = document.getElementById('related-products');
    if (!container) return;

    const relatedProducts = products.filter(p => p.id !== currentProductId).slice(0, 3);
    container.innerHTML = relatedProducts.map(product => createProductCard(product)).join('');
}

// Load cart items
function loadCartItems() {
    const container = document.getElementById('cart-items-container');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!container) return;

    if (cart.items.length === 0) {
        container.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    emptyCart.style.display = 'none';

    container.innerHTML = cart.items.map(item => createCartItem(item)).join('');
    updateCartSummary();
}

// Create cart item HTML
function createCartItem(item) {
    const imagePath = `Products/${item.id}/${item.images[0]}`;
    const variantsText = Object.entries(item.variants).map(([key, value]) => `${key}: ${value}`).join(', ');
    
    return `
        <div class="cart-item">
            <img src="${imagePath}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="text-muted small">${variantsText}</p>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1}, ${JSON.stringify(item.variants).replace(/"/g, '&quot;')})">-</button>
                <span class="mx-3">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1}, ${JSON.stringify(item.variants).replace(/"/g, '&quot;')})">+</button>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${item.id}, ${JSON.stringify(item.variants).replace(/"/g, '&quot;')})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

// Update cart quantity
function updateCartQuantity(productId, quantity, variants) {
    if (quantity <= 0) {
        removeFromCart(productId, variants);
    } else {
        cart.updateQuantity(productId, quantity, variants);
        loadCartItems();
    }
}

// Remove from cart
function removeFromCart(productId, variants) {
    cart.removeItem(productId, variants);
    loadCartItems();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.getTotal();
    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Setup product filters
function setupProductFilters() {
    const sortSelect = document.getElementById('sort-select');
    const itemsPerPage = document.getElementById('items-per-page');

    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }

    if (itemsPerPage) {
        itemsPerPage.addEventListener('change', function() {
            displayProducts(this.value);
        });
    }
}

// Sort products
function sortProducts(sortBy) {
    let sortedProducts = [...products];

    switch(sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            sortedProducts = products;
    }

    displaySortedProducts(sortedProducts);
}

// Display sorted products
function displaySortedProducts(sortedProducts) {
    const container = document.getElementById('products-grid');
    if (container) {
        container.innerHTML = sortedProducts.map(product => createProductCard(product)).join('');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Quantity selectors
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const quantityInput = document.getElementById('quantity-input');

    if (decreaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function() {
            const current = parseInt(quantityInput.value);
            if (current > 1) {
                quantityInput.value = current - 1;
            }
        });
    }

    if (increaseBtn && quantityInput) {
        increaseBtn.addEventListener('click', function() {
            const current = parseInt(quantityInput.value);
            if (current < 10) {
                quantityInput.value = current + 1;
            }
        });
    }

    // Variant selection
    document.querySelectorAll('.variant-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from siblings
            this.parentElement.querySelectorAll('.variant-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // Add active class to clicked option
            this.classList.add('selected');
        });
    });

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            cart.showNotification('Thank you for subscribing to our newsletter!', 'success');
            this.reset();
        });
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            cart.showNotification('Your message has been sent successfully!', 'success');
            this.reset();
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.items.length === 0) {
                cart.showNotification('Your cart is empty!', 'error');
            } else {
                cart.showNotification('Proceeding to checkout...', 'success');
                // In a real application, this would redirect to a checkout page
            }
        });
    }

    // Promo code application
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', function() {
            const promoCode = document.getElementById('promo-code').value;
            if (promoCode) {
                cart.showNotification('Promo code applied successfully!', 'success');
            } else {
                cart.showNotification('Please enter a promo code', 'error');
            }
        });
    }
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    cart.showNotification(message, type);
}

// Export cart for global access
window.cart = cart;
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.changeMainImage = changeMainImage;
window.showNotification = showNotification;
