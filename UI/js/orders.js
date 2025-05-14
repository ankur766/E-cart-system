// Initialize orders data if none exists
function initializeOrders() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;

    if (!localStorage.getItem(`orders_${currentUser.id}`)) {
        const sampleOrders = [
            {
                id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
                date: new Date().toISOString(),
                items: [
                    { productId: 1, name: "Laptop", price: 999.99, quantity: 1 },
                    { productId: 3, name: "T-Shirt", price: 19.99, quantity: 2 }
                ],
                status: 'confirmed',
                address: currentUser.address,
                deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                items: [
                    { productId: 2, name: "Smartphone", price: 699.99, quantity: 1 }
                ],
                status: 'transit',
                address: currentUser.address,
                deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
                date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                items: [
                    { productId: 5, name: "JavaScript Book", price: 29.99, quantity: 1 },
                    { productId: 6, name: "Python Book", price: 34.99, quantity: 1 }
                ],
                status: 'delivered',
                address: currentUser.address,
                deliveryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(sampleOrders));
    }
}

// Load orders based on filter
function loadOrders() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const statusFilter = document.getElementById('orderStatusFilter').value;
    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
    const ordersTable = document.getElementById('ordersTable').querySelector('tbody');
    ordersTable.innerHTML = '';

    if (orders.length === 0) {
        ordersTable.innerHTML = '<tr><td colspan="6" style="text-align: center;">No orders found</td></tr>';
        return;
    }

    orders.forEach(order => {
        if (statusFilter !== 'all' && order.status !== statusFilter) return;

        const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemsCount = order.items.reduce((count, item) => count + item.quantity, 0);
        const itemsList = order.items.map(item => item.name).join(', ');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${itemsCount} items (${itemsList})</td>
            <td>$${total.toFixed(2)}</td>
            <td><span class="order-status status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
            <td>
                <button class="btn btn-secondary view-details" data-order-id="${order.id}">View Details</button>
            </td>
        `;
        ordersTable.appendChild(row);
    });

    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            showOrderDetails(orderId);
        });
    });
}

// Show order details in modal
function showOrderDetails(orderId) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;

    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('orderDetailsModal');
    document.getElementById('modalOrderId').textContent = `Order #${order.id}`;
    document.getElementById('modalOrderDate').textContent = new Date(order.date).toLocaleString();
    document.getElementById('modalOrderAddress').textContent = order.address;

    const statusElement = document.getElementById('modalOrderStatus');
    statusElement.textContent = order.status.charAt(0).toUpperCase() + order.status.slice(1);
    statusElement.className = `order-status status-${order.status}`;

    const itemsTable = document.getElementById('modalOrderItems');
    itemsTable.innerHTML = '';
    order.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
        `;
        itemsTable.appendChild(row);
    });

    // Show/hide action buttons based on order status
    document.getElementById('cancelOrderBtn').style.display = order.status === 'confirmed' ? 'block' : 'none';
    document.getElementById('updateAddressBtn').style.display = order.status === 'confirmed' || order.status === 'transit' ? 'block' : 'none';
    document.getElementById('returnOrderBtn').style.display = order.status === 'delivered' ? 'block' : 'none';
    document.getElementById('leaveFeedbackBtn').style.display = order.status === 'delivered' ? 'block' : 'none';

    // Set data attribute for action buttons
    document.getElementById('cancelOrderBtn').setAttribute('data-order-id', order.id);
    document.getElementById('updateAddressBtn').setAttribute('data-order-id', order.id);
    document.getElementById('returnOrderBtn').setAttribute('data-order-id', order.id);
    document.getElementById('leaveFeedbackBtn').setAttribute('data-order-id', order.id);

    modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('orderDetailsModal').classList.add('hidden');
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;

    let orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        
        // Add additional info based on status
        if (newStatus === 'cancelled') {
            orders[orderIndex].cancelledDate = new Date().toISOString();
        } else if (newStatus === 'returned') {
            orders[orderIndex].returnedDate = new Date().toISOString();
        }
        
        localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));
        loadOrders();
        closeModal();
    }
}

// Update order address
function updateOrderAddress(orderId) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;

    const newAddress = prompt('Enter new delivery address:', currentUser.address);
    if (!newAddress || newAddress.length > 100) {
        alert('Please enter a valid address (max 100 characters)');
        return;
    }

    let orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].address = newAddress;
        localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));
        
        // Also update user's address if this is the current address
        if (currentUser.address === orders[orderIndex].address) {
            currentUser.address = newAddress;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update in users array
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].address = newAddress;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
        
        loadOrders();
        showOrderDetails(orderId); // Refresh the modal
    }
}

// Leave feedback for order
function leaveFeedback(orderId) {
    const feedback = prompt('Please enter your feedback about this order:');
    if (!feedback) return;

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;

    let orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        if (!orders[orderIndex].feedback) {
            orders[orderIndex].feedback = [];
        }
        
        orders[orderIndex].feedback.push({
            date: new Date().toISOString(),
            text: feedback
        });
        
        localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));
        alert('Thank you for your feedback!');
        showOrderDetails(orderId); // Refresh the modal
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeOrders();
    loadOrders();
    
    // Filter event
    document.getElementById('applyFilter').addEventListener('click', loadOrders);
    
    // Modal close event
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    
    // Order action events
    document.getElementById('cancelOrderBtn').addEventListener('click', function() {
        const orderId = this.getAttribute('data-order-id');
        if (confirm('Are you sure you want to cancel this order?')) {
            updateOrderStatus(orderId, 'cancelled');
        }
    });
    
    document.getElementById('updateAddressBtn').addEventListener('click', function() {
        const orderId = this.getAttribute('data-order-id');
        updateOrderAddress(orderId);
    });
    
    document.getElementById('returnOrderBtn').addEventListener('click', function() {
        const orderId = this.getAttribute('data-order-id');
        if (confirm('Are you sure you want to return this order?')) {
            updateOrderStatus(orderId, 'returned');
        }
    });
    
    document.getElementById('leaveFeedbackBtn').addEventListener('click', function() {
        const orderId = this.getAttribute('data-order-id');
        leaveFeedback(orderId);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('orderDetailsModal');
        if (event.target === modal) {
            closeModal();
        }
    });
});