// Sample products data
const products = [
  { "id": 1, "name": "Laptop", "price": 999.99, "category": "electronics", "image": "https://source.unsplash.com/featured/?laptop" },
  { "id": 2, "name": "Smartphone", "price": 699.99, "category": "electronics", "image": "https://source.unsplash.com/featured/?smartphone" },
  { "id": 3, "name": "T-Shirt", "price": 19.99, "category": "clothing", "image": "https://source.unsplash.com/featured/?tshirt" },
  { "id": 4, "name": "Jeans", "price": 49.99, "category": "clothing", "image": "https://source.unsplash.com/featured/?jeans" },
  { "id": 5, "name": "JavaScript Book", "price": 29.99, "category": "books", "image": "https://source.unsplash.com/featured/?javascript,book" },
  { "id": 6, "name": "Python Book", "price": 34.99, "category": "books", "image": "https://source.unsplash.com/featured/?python,book" },
  { "id": 7, "name": "Wireless Headphones", "price": 149.99, "category": "electronics", "image": "https://source.unsplash.com/featured/?headphones" },
  { "id": 8, "name": "Smart Watch", "price": 199.99, "category": "electronics", "image": "https://source.unsplash.com/featured/?smartwatch" },
  { "id": 9, "name": "Hoodie", "price": 39.99, "category": "clothing", "image": "https://source.unsplash.com/featured/?hoodie" },
  { "id": 10, "name": "Dress Shirt", "price": 29.99, "category": "clothing", "image": "https://source.unsplash.com/featured/?dressshirt" },
  { "id": 11, "name": "React Book", "price": 32.99, "category": "books", "image": "https://source.unsplash.com/featured/?reactjs,book" },
  { "id": 12, "name": "Node.js Book", "price": 36.99, "category": "books", "image": "https://source.unsplash.com/featured/?nodejs,book" },
  { "id": 13, "name": "Tablet", "price": 349.99, "category": "electronics", "image": "https://source.unsplash.com/featured/?tablet" },
  { "id": 14, "name": "Bluetooth Speaker", "price": 89.99, "category": "electronics", "image": "https://source.unsplash.com/featured/?speaker" },
  { "id": 15, "name": "Sweater", "price": 45.99, "category": "clothing", "image": "https://source.unsplash.com/featured/?sweater" },
  { "id": 16, "name": "Shorts", "price": 24.99, "category": "clothing", "image": "https://source.unsplash.com/featured/?shorts" },
  { "id": 17, "name": "HTML/CSS Book", "price": 27.99, "category": "books", "image": "https://source.unsplash.com/featured/?html,css,book" },
  { "id": 18, "name": "Data Science Book", "price": 42.99, "category": "books", "image": "https://source.unsplash.com/featured/?datascience,book" },
  { "id": 19, "name": "Gaming Mouse", "price": 59.99, "category": "electronics", "image": "https://source.unsplash.com/featured/?gaming,mouse" },
  { "id": 20, "name": "External Hard Drive", "price": 79.99, "category": "electronics", "image": "https://source.unsplash.com/featured/?harddrive" },
  { "id": 21, "name": "Jacket", "price": 89.99, "category": "clothing", "image": "https://source.unsplash.com/featured/?jacket" },
  { "id": 22, "name": "Socks", "price": 9.99, "category": "clothing", "image": "https://source.unsplash.com/featured/?socks" },
  { "id": 23, "name": "Vue.js Book", "price": 31.99, "category": "books", "image": "https://source.unsplash.com/featured/?vuejs,book" },
  { "id": 24, "name": "TypeScript Book", "price": 37.99, "category": "books", "image": "https://source.unsplash.com/featured/?typescript,book" }
]


// Load products on home page
if (document.getElementById('productsList')) {
    loadProducts();
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', function() {
        loadProducts();
    });
}

function loadProducts() {
    const category = document.getElementById('categoryFilter').value;
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class=" add-to-cart"  style="background-color:rgb(227, 153, 15); color: white; padding: 5px 10px; border: none; border-radius: 4px;"
                
                data-id="${product.id} ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path> ADD To CART
            </svg>
          ADD To CART
           
            
        </button>
            `
            productsList.appendChild(productCard);
        });
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cart));
    alert(`${product.name} added to cart`);
}

// Load cart items on cart page
if (document.getElementById('cartItems')) {
    loadCartItems();
    
    // Load address
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('customerAddress').textContent = currentUser.address;
    }
    
    // Edit address
    document.getElementById('editAddress').addEventListener('click', function() {
        const newAddress = prompt('Enter your new address:', currentUser.address);
        if (newAddress && newAddress.length <= 100) {
            currentUser.address = newAddress;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update in users array
            const users = JSON.parse(localStorage.getItem('users'));
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].address = newAddress;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            document.getElementById('customerAddress').textContent = newAddress;
        } else if (newAddress) {
            alert('Address must be 100 characters or less');
        }
    });
    
    // Proceed to payment
    document.getElementById('proceedToPayment').addEventListener('click', function() {
        const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || [];
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        window.location.href = 'payment.html';
    });
}

function loadCartItems() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;
        
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-info">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)} each</p>
            </div>
            <div class="quantity-controls">
                <button class="decrease-quantity" data-id="${product.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-quantity" data-id="${product.id}">+</button>
            </div>
            <div class="item-total">
                <p>$${itemTotal.toFixed(2)}</p>
            </div>
            <button class="remove-item btn" data-id="${product.id}">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add total row
    const totalRow = document.createElement('div');
    totalRow.className = 'cart-total';
    totalRow.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
    cartItemsContainer.appendChild(totalRow);
    
    // Add event listeners
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            updateCartItemQuantity(parseInt(this.getAttribute('data-id')), 1);
        });
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            updateCartItemQuantity(parseInt(this.getAttribute('data-id')), -1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            removeCartItem(parseInt(this.getAttribute('data-id')));
        });
    });
}

function updateCartItemQuantity(productId, change) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || [];
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        // Remove if quantity is 0 or less
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cart));
        loadCartItems();
    }
}

function removeCartItem(productId) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || [];
    cart = cart.filter(item => item.productId !== productId);
    
    localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cart));
    loadCartItems();
}

// Payment page
if (document.getElementById('makePayment')) {
    document.getElementById('makePayment').addEventListener('click', function() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) return;
        
        const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || [];
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        
        // Generate order ID
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        
        // Create order
        const order = {
            id: orderId,
            date: new Date().toISOString(),
            items: cart.map(item => {
                const product = products.find(p => p.id === item.productId);
                return {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity
                };
            }),
            status: 'confirmed',
            address: currentUser.address
        };
        
        // Save order
        let orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
        orders.push(order);
        localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));
        
        // Clear cart
        localStorage.removeItem(`cart_${currentUser.id}`);
        
        // Show invoice
        document.querySelector('.payment-methods').classList.add('hidden');
        document.getElementById('invoice').classList.remove('hidden');
        document.getElementById('orderId').textContent = orderId;
        
        const invoiceDetails = document.getElementById('invoiceDetails');
        invoiceDetails.innerHTML = '';
        
        let total = 0;
        order.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemRow = document.createElement('div');
            itemRow.className = 'invoice-item';
            itemRow.innerHTML = `
                <p>${item.name} x ${item.quantity} - $${itemTotal.toFixed(2)}</p>
            `;
            invoiceDetails.appendChild(itemRow);
        });
        
        const totalRow = document.createElement('div');
        totalRow.className = 'invoice-total';
        totalRow.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
        invoiceDetails.appendChild(totalRow);
        
        const addressRow = document.createElement('div');
        addressRow.className = 'invoice-address';
        addressRow.innerHTML = `<p>Shipping Address: ${order.address}</p>`;
        invoiceDetails.appendChild(addressRow);
    });
}