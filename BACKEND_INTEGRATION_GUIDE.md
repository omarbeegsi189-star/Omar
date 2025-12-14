# Backend Integration Guide for Healthy Bites

## Overview
This guide provides detailed instructions for backend developers to integrate with the Healthy Bites frontend. The frontend has been prepared with API calls and data structures that the backend needs to implement.

## API Endpoints Required

### 1. Authentication Endpoints

#### POST /api/auth/login
**Purpose**: Authenticate user login
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "123-456-7890",
    "addresses": ["Address 1", "Address 2"]
  },
  "token": "jwt_token_here"
}
```
**Error Response**:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### POST /api/auth/signup
**Purpose**: Register new user
**Request Body**:
```json
{
  "name": "Full Name",
  "email": "user@example.com",
  "password": "userpassword",
  "phone": "",
  "addresses": []
}
```
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "Full Name",
    "email": "user@example.com",
    "phone": "",
    "addresses": []
  },
  "token": "jwt_token_here"
}
```

### 2. Menu Endpoints

#### GET /api/menu
**Purpose**: Get all menu items
**Response**:
```json
{
  "success": true,
  "menu": [
    {
      "id": "item_id",
      "name": "Item Name",
      "description": "Item description",
      "price": 9.99,
      "image": "path/to/image.jpg",
      "category": "category_name",
      "available": true
    }
  ]
}
```

#### GET /api/menu/:category
**Purpose**: Get menu items by category
**Response**: Same as above, filtered by category

### 3. Order Endpoints

#### POST /api/orders
**Purpose**: Place a new order
**Headers**: `Authorization: Bearer <jwt_token>`
**Request Body**:
```json
{
  "id": "HB-1234567890123",
  "date": "2024-01-15",
  "items": [
    {
      "name": "Item Name",
      "qty": 2,
      "price": 9.99
    }
  ],
  "total": 19.98,
  "status": "preparing",
  "address": "Delivery Address",
  "paymentMethod": "cod"
}
```
**Response**:
```json
{
  "success": true,
  "order": {
    "id": "HB-1234567890123",
    "status": "confirmed",
    "estimatedDelivery": "2024-01-15T18:00:00Z"
  }
}
```

#### GET /api/orders
**Purpose**: Get user's order history
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "orders": [
    {
      "id": "HB-1234567890123",
      "date": "2024-01-15",
      "items": [...],
      "total": 19.98,
      "status": "preparing",
      "address": "Delivery Address",
      "paymentMethod": "cod"
    }
  ]
}
```

### 4. User Profile Endpoints

#### GET /api/user/profile
**Purpose**: Get user profile information
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "123-456-7890",
    "addresses": ["Address 1", "Address 2"]
  }
}
```

#### PUT /api/user/profile
**Purpose**: Update user profile
**Headers**: `Authorization: Bearer <jwt_token>`
**Request Body**:
```json
{
  "name": "Updated Name",
  "phone": "123-456-7890",
  "addresses": ["Updated Address"]
}
```
**Response**:
```json
{
  "success": true,
  "user": { /* updated user object */ }
}
```

## Frontend Integration Points

### Session Management
The frontend uses a `Session` class (in `js/utils.js`) for client-side session management. The backend should:

1. **Validate JWT tokens** on protected endpoints
2. **Return user data** in login/signup responses
3. **Handle token expiration** gracefully

### API Class
The frontend uses an `API` class for making HTTP requests. Key methods:

- `API.login(email, password)` - Calls POST /api/auth/login
- `API.signup(userData)` - Calls POST /api/auth/signup
- `API.getMenu()` - Calls GET /api/menu
- `API.placeOrder(orderData)` - Calls POST /api/orders
- `API.getOrders()` - Calls GET /api/orders
- `API.getProfile()` - Calls GET /api/user/profile
- `API.updateProfile(userData)` - Calls PUT /api/user/profile

### Error Handling
The frontend expects API responses to include:
- `success`: boolean indicating operation success
- `message`: error message for failed operations
- Appropriate HTTP status codes (200 for success, 400/401/500 for errors)

### CORS Configuration
Ensure the backend allows requests from the frontend domain with appropriate CORS headers.

## Database Schema Suggestions

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  addresses JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Menu Items Table
```sql
CREATE TABLE menu_items (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255),
  category VARCHAR(100),
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  items JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'preparing',
  address TEXT NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Security Considerations

1. **Password Hashing**: Use strong hashing algorithms (bcrypt, Argon2)
2. **JWT Tokens**: Implement secure token generation and validation
3. **Input Validation**: Sanitize all user inputs
4. **Rate Limiting**: Implement rate limiting on authentication endpoints
5. **HTTPS**: Ensure all API endpoints use HTTPS in production

## Testing Checklist

- [ ] User registration and login
- [ ] Menu item retrieval
- [ ] Order placement
- [ ] Order history retrieval
- [ ] Profile updates
- [ ] Error handling for invalid requests
- [ ] Authentication middleware
- [ ] CORS configuration

## Deployment Notes

1. **Environment Variables**: Set up environment variables for database connections, JWT secrets, etc.
2. **API Documentation**: Consider using Swagger/OpenAPI for API documentation
3. **Logging**: Implement proper logging for debugging and monitoring
4. **Backup**: Set up regular database backups

## Support
For questions about frontend integration or API specifications, refer to the frontend code in `js/utils.js` and the changes documented in `CHANGES_SUMMARY.md`.
