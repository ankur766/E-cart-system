# E-Cart System - GitHub Copilot Instructions

## Project Overview

This is a client-side e-commerce web application built with vanilla HTML, CSS, and JavaScript. It provides a complete shopping experience including user registration, authentication, product browsing, cart management, order processing, and user profile management.

## Architecture & Technology Stack

- **Frontend**: Pure HTML5, CSS3, and vanilla JavaScript (ES6+)
- **Styling**: CSS with CSS variables and responsive design
- **Data Storage**: Browser localStorage and sessionStorage
- **No Backend**: All data is persisted client-side
- **No Build Process**: Files are served directly

## Project Structure

```
UI/
├── index.html          # Landing page with login/register options  
├── login.html          # User authentication
├── register.html       # User registration with validation
├── home.html           # Product catalog with filtering
├── cart.html           # Shopping cart management
├── orders.html         # Order history and management
├── payment.html        # Payment processing (mock)
├── profile.html        # User profile management
├── css/
│   ├── style.css       # Main stylesheet with CSS variables
│   └── profile.css     # Profile-specific styles
└── js/
    ├── auth.js         # Authentication, registration, and user management
    ├── cart.js         # Shopping cart functionality and checkout
    └── orders.js       # Order management and history
```

## Key Components & Functionality

### Authentication System (`auth.js`)
- User registration with validation (email uniqueness, password strength)
- Login/logout functionality
- Session management using sessionStorage
- User data persistence in localStorage
- Profile image upload (base64 storage)
- Sample data initialization for products and users

### Shopping Cart (`cart.js`)  
- Add/remove items from cart
- Quantity management
- Price calculations with totals
- Address management for delivery
- Mock payment processing (Credit Card, UPI)
- Order generation and invoice display

### Order Management (`orders.js`)
- Order history display with filtering
- Order status tracking (confirmed, transit, delivered, cancelled)
- Order details modal with item breakdown
- Order actions (cancel, update address, return, feedback)
- Sample order data for testing

## Data Models

### User Object
```javascript
{
  id: number,           // Auto-generated 7-digit customer ID
  name: string,         // Max 50 characters
  email: string,        // Unique, validated format
  address: string,      // Max 100 characters
  password: string,     // 10-30 characters
  profilePic: string,   // Base64 image or default path
  createdAt: string     // ISO timestamp
}
```

### Product Object
```javascript
{
  id: number,
  name: string,
  price: number,
  category: string,     // electronics, clothing, books
  image: string,        // URL or path
  description: string
}
```

### Order Object
```javascript
{
  id: string,           // Generated order ID
  date: string,         // ISO timestamp
  items: Array,         // Cart items with quantities
  address: string,      // Delivery address
  status: string,       // confirmed, transit, delivered, cancelled
  total: number,        // Order total amount
  deliveryDate: string, // Expected/actual delivery date
  feedback: Array       // Optional user feedback
}
```

## Coding Standards & Conventions

### JavaScript
- Use vanilla JavaScript (ES6+ features welcomed)
- Prefer `const` and `let` over `var`
- Use arrow functions for callbacks and short functions
- Use template literals for string interpolation
- Implement proper error handling with try-catch
- Use meaningful variable and function names
- Comment complex logic and business rules

### CSS
- Use CSS custom properties (variables) defined in `:root`
- Follow BEM-like naming for complex components
- Implement responsive design with mobile-first approach
- Use flexbox and grid for layouts
- Maintain consistent spacing and typography

### HTML
- Use semantic HTML5 elements
- Include proper accessibility attributes (alt, aria-labels)
- Validate forms with HTML5 validation attributes
- Use meaningful class names and IDs

## Data Storage Patterns

### localStorage Usage
- `users`: Array of all registered users
- `products`: Array of available products (initialized with sample data)
- `orders_{userId}`: User-specific order history

### sessionStorage Usage  
- `currentUser`: Currently logged-in user object
- `cart_{userId}`: User's current shopping cart

## Common Patterns & Utilities

### Authentication Check
```javascript
function checkAuth() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'login.html';
    return null;
  }
  return currentUser;
}
```

### Error Display
```javascript
function showError(message, element) {
  // Create and display error message near input element
}
```

### Data Initialization
- Always check if data exists before initializing sample data
- Use consistent sample data across the application
- Initialize user-specific data when needed

## Development Guidelines

### When Adding New Features
1. Follow existing code patterns and structure
2. Update both localStorage schema and UI accordingly  
3. Implement proper validation for user inputs
4. Add appropriate error handling and user feedback
5. Test with existing sample data and edge cases
6. Ensure responsive design for mobile devices

### Form Handling
- Use HTML5 validation attributes as first line of defense
- Implement JavaScript validation for complex business rules
- Provide immediate feedback for user interactions
- Clear error states when user corrects input

### State Management
- Always check for user authentication before sensitive operations
- Validate data consistency between localStorage and sessionStorage
- Handle cases where expected data might not exist
- Implement graceful fallbacks for missing data

## Testing Considerations

- Test with multiple user accounts
- Verify localStorage/sessionStorage persistence across browser sessions
- Test form validations with edge cases
- Verify responsive design on different screen sizes
- Test all user flows: registration → login → shopping → checkout → orders

## Security Notes

- This is a client-side only application for demonstration purposes
- In production, sensitive operations should be handled server-side
- Passwords are stored in plain text (not recommended for production)
- All data is visible in browser developer tools

## Performance Considerations

- Sample data initialization only happens when data doesn't exist
- Use event delegation for dynamically created elements
- Minimize DOM queries by caching element references
- Implement lazy loading for images when appropriate

When working on this codebase, maintain consistency with existing patterns and always consider the user experience across all device sizes.