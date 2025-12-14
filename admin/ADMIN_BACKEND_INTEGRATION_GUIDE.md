# Admin Backend Integration Guide for Healthy Bites

## Overview
This guide provides detailed instructions for backend developers to integrate with the Healthy Bites admin panel. The admin frontend has been prepared with API calls, data structures, and HTML IDs/classes that the backend needs to implement for full dynamic functionality.

## Authentication

### Admin Login
**Endpoint**: `POST /api/admin/auth/login`
**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```
**Response**:
```json
{
  "success": true,
  "admin": {
    "id": "admin_id",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```
**Error Response**:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Admin Logout
**Endpoint**: `POST /api/admin/auth/logout`
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Menu Management

### View Menu Categories
**Endpoint**: `GET /api/admin/categories`
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "categories": [
    {
      "id": "cat_1",
      "name": "Main Dishes"
    },
    {
      "id": "cat_2",
      "name": "Juices"
    }
  ]
}
```

### Add New Category
**Endpoint**: `POST /api/admin/categories`
**Headers**: `Authorization: Bearer <jwt_token>`
**Request Body**:
```json
{
  "name": "New Category Name"
}
```
**Response**:
```json
{
  "success": true,
  "category": {
    "id": "cat_new",
    "name": "New Category Name"
  }
}
```

### Update Category
**Endpoint**: `PUT /api/admin/categories/:id`
**Headers**: `Authorization: Bearer <jwt_token>`
**Request Body**:
```json
{
  "name": "Updated Category Name"
}
```
**Response**:
```json
{
  "success": true,
  "category": {
    "id": "cat_1",
    "name": "Updated Category Name"
  }
}
```

### Delete Category
**Endpoint**: `DELETE /api/admin/categories/:id`
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

### View Menu Items
**Endpoint**: `GET /api/admin/menu`
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "menu": [
    {
      "id": "item_1",
      "name": "Eggs with Bread",
      "category": "Main Dish",
      "price": 12.50,
      "description": "Fresh eggs with whole grain bread",
      "image": "../media/egeswithbrade-maindish-menu.png",
      "available": true
    }
  ]
}
```

### Add New Menu Item
**Endpoint**: `POST /api/admin/menu`
**Headers**: `Authorization: Bearer <jwt_token>`
**Request Body** (FormData for image upload):
```json
{
  "name": "New Dish Name",
  "category": "Main Dish",
  "price": 15.99,
  "description": "Dish description",
  "image": "file_object"
}
```
**Response**:
```json
{
  "success": true,
  "item": {
    "id": "item_new",
    "name": "New Dish Name",
    "category": "Main Dish",
    "price": 15.99,
    "description": "Dish description",
    "image": "path/to/image.jpg",
    "available": true
  }
}
```

### Update Menu Item
**Endpoint**: `PUT /api/admin/menu/:id`
**Headers**: `Authorization: Bearer <jwt_token>`
**Request Body** (FormData for image upload):
```json
{
  "name": "Updated Dish Name",
  "category": "Main Dish",
  "price": 16.99,
  "description": "Updated description",
  "image": "file_object" // optional
}
```
**Response**:
```json
{
  "success": true,
  "item": { /* updated item object */ }
}
```

### Delete Menu Item
**Endpoint**: `DELETE /api/admin/menu/:id`
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

## Order Management

### View Orders
**Endpoint**: `GET /api/admin/orders`
**Headers**: `Authorization: Bearer <jwt_token>`
**Query Parameters**:
- `status`: Filter by status (pending, accepted, rejected, delivered)
- `search`: Search by order ID or customer name
- `date`: Filter by date
**Response**:
```json
{
  "success": true,
  "orders": [
    {
      "id": "#12345",
      "customerName": "John Doe",
      "items": "Grilled Chicken Salad, Fresh Juice",
      "total": 18.50,
      "status": "pending",
      "date": "2024-01-15",
      "details": {
        "customerEmail": "john@example.com",
        "address": "123 Main St",
        "phone": "555-0123",
        "items": [
          {
            "name": "Grilled Chicken Salad",
            "quantity": 1,
            "price": 12.50
          },
          {
            "name": "Fresh Juice",
            "quantity": 1,
            "price": 6.00
          }
        ]
      }
    }
  ]
}
```

### Update Order Status
**Endpoint**: `PUT /api/admin/orders/:id/status`
**Headers**: `Authorization: Bearer <jwt_token>`
**Request Body**:
```json
{
  "status": "accepted" // or "rejected", "delivered"
}
```
**Response**:
```json
{
  "success": true,
  "order": {
    "id": "#12345",
    "status": "accepted"
  }
}
```

## Promotion Management

### View Promotions
**Endpoint**: `GET /api/admin/promotions`
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "promotions": [
    {
      "id": "promo_1",
      "name": "Weekend Special",
      "description": "20% off on all main dishes",
      "discount": 20,
      "expiryDate": "2024-02-01",
      "enabled": true
    }
  ]
}
```

### Add New Promotion
**Endpoint**: `POST /api/admin/promotions`
**Headers**: `Authorization: Bearer <jwt_token>`
**Request Body**:
```json
{
  "name": "New Promotion",
  "description": "Promotion description",
  "discount": 15,
  "expiryDate": "2024-02-15",
  "enabled": true
}
```
**Response**:
```json
{
  "success": true,
  "promotion": { /* new promotion object */ }
}
```

### Update Promotion
**Endpoint**: `PUT /api/admin/promotions/:id`
**Headers**: `Authorization: Bearer <jwt_token>`
**Request Body**:
```json
{
  "name": "Updated Promotion",
  "description": "Updated description",
  "discount": 25,
  "expiryDate": "2024-03-01",
  "enabled": false
}
```
**Response**:
```json
{
  "success": true,
  "promotion": { /* updated promotion object */ }
}
```

### Delete Promotion
**Endpoint**: `DELETE /api/admin/promotions/:id`
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "message": "Promotion deleted successfully"
}
```

### Toggle Promotion Status
**Endpoint**: `PATCH /api/admin/promotions/:id/toggle`
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "promotion": {
    "id": "promo_1",
    "enabled": false
  }
}
```

## Reports

### Get Dashboard Stats
**Endpoint**: `GET /api/admin/reports/stats`
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "stats": {
    "totalRevenue": 45230,
    "growth": 18,
    "orders": 1247,
    "customers": 892
  }
}
```

### Get Sales Data
**Endpoint**: `GET /api/admin/reports/sales`
**Headers**: `Authorization: Bearer <jwt_token>`
**Query Parameters**:
- `period`: "month", "week", "day"
**Response**:
```json
{
  "success": true,
  "sales": {
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "data": [12000, 15000, 18000, 22000, 25000, 28000]
  }
}
```

### Get Orders Trend
**Endpoint**: `GET /api/admin/reports/orders-trend`
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "trend": {
    "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
    "data": [120, 135, 148, 156]
  }
}
```

### Get Customer Growth
**Endpoint**: `GET /api/admin/reports/customer-growth`
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "growth": {
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "data": [100, 120, 150, 180, 220, 280]
  }
}
```

### Get Popular Items
**Endpoint**: `GET /api/admin/reports/popular-items`
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "items": {
    "labels": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
    "data": [156, 134, 128, 112, 98]
  }
}
```

### Get Top Selling Items
**Endpoint**: `GET /api/admin/reports/top-selling`
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**:
```json
{
  "success": true,
  "topItems": [
    {
      "rank": 1,
      "name": "Grilled Chicken Salad",
      "category": "Main Dish",
      "orders": 156,
      "revenue": 2808
    }
  ]
}
```

## HTML Integration Points

### Dashboard (admin/index.html)
- **Stats Cards**: `#stats-cards` - Inject stats data
- **Stats Table**: `#stats-table` - Populate with recent orders/customers

### Manage Menu (admin/manage-menu.html)
- **Add Category Form**: `#add-category-form` - Handle form submission
- **Menu Items Table**: `#menu-items-tbody` - Populate with menu items
- **Edit/Delete Buttons**: `.edit-menu-item-btn`, `.delete-menu-item-btn` with `data-item-id`

### Orders (admin/orders.html)
- **Search Form**: `#search-filter-form` - Handle filtering
- **Orders Table**: `#orders-table` - Populate with orders
- **View Details Buttons**: Trigger modal or expand row

### Order Status (admin/order-status.html)
- **Pending Orders Table**: `#pending-orders-table` - Populate pending orders
- **Accepted Orders Table**: `#accepted-orders-table` - Populate accepted orders
- **Status Update Forms**: Forms with order IDs for status changes

### Promotions (admin/promotions.html)
- **Add Promotion Form**: `#add-promotion-form` - Handle form submission
- **Promotions Table**: `#promotions-table` - Populate with promotions
- **Toggle Checkboxes**: `.promo-toggle` - Handle enable/disable
- **Edit/Delete Buttons**: Edit and delete functionality

### Reports (admin/reports.html)
- **Revenue Summary**: `#revenue-summary` - Update stats cards
- **Charts Containers**:
  - `#sales-chart-container` - Sales chart
  - `#orders-chart-container` - Orders trend chart
  - `#customer-growth-chart-container` - Customer growth chart
  - `#popular-items-chart-container` - Popular items chart
- **Top Items Table**: `#top-items-tbody` - Populate top selling items

## Authentication & Session Management

1. **JWT Token Storage**: Store admin JWT token in localStorage/sessionStorage
2. **Token Validation**: Include Bearer token in Authorization header for all admin API calls
3. **Token Expiration**: Handle 401 responses by redirecting to login
4. **Admin Role Check**: Ensure user has admin role for accessing admin panel

## Making Admin Panel Dynamic

The admin panel uses `admin/admin.js` for API interactions. Key functions to implement:

- `loadDashboardStats()` - Fetch and display dashboard statistics
- `loadMenuItems()` - Fetch and populate menu items table
- `loadOrders()` - Fetch and display orders with filtering
- `updateOrderStatus(orderId, status)` - Update order status
- `loadPromotions()` - Fetch and display promotions
- `loadReportsData()` - Fetch data for charts and tables

All functions should:
1. Make async API calls using fetch()
2. Handle loading states (show spinners)
3. Handle errors gracefully (show error messages)
4. Update DOM elements with received data
5. Maintain existing CSS classes and IDs

## Dark/Light Mode Considerations

- Theme toggle button: `#theme-toggle`
- CSS variables used for colors (e.g., `--text-color`, `--bg-color`)
- Backend should not interfere with theme switching
- Ensure API responses don't override theme-related classes

## How Backend Should Connect to Each Admin Feature

### Dashboard Home
1. On page load, call `GET /api/admin/reports/stats`
2. Populate stats cards with returned data
3. Optionally load recent orders/customers for table

### Manage Menu
1. Load categories: `GET /api/admin/categories` (populate category dropdowns)
2. Load menu items: `GET /api/admin/menu` (populate table)
3. Add category: Submit `#add-category-form` to `POST /api/admin/categories`
4. Add dish: Submit add dish form to `POST /api/admin/menu`
5. Edit/Delete: Use data attributes to identify items and call appropriate endpoints

### View Orders
1. Load orders: `GET /api/admin/orders` with optional filters
2. Handle search/filter form submission to reload with parameters
3. View details: Expand row or show modal with order details

### Update Order Status
1. Load pending orders: `GET /api/admin/orders?status=pending`
2. Load accepted orders: `GET /api/admin/orders?status=accepted`
3. Update status: Submit forms to `PUT /api/admin/orders/:id/status`

### Manage Promotions
1. Load promotions: `GET /api/admin/promotions`
2. Add promotion: Submit `#add-promotion-form` to `POST /api/admin/promotions`
3. Toggle status: Handle `.promo-toggle` changes to `PATCH /api/admin/promotions/:id/toggle`
4. Edit/Delete: Implement edit modal and delete confirmations

### View Reports
1. Load stats: `GET /api/admin/reports/stats` for summary cards
2. Load chart data: Separate calls for each chart type
3. Load top items: `GET /api/admin/reports/top-selling`
4. Use Chart.js to render charts in designated containers

## Error Handling

All API responses should include:
- `success`: boolean
- `message`: error description for failures
- Appropriate HTTP status codes

Frontend will display error messages and handle loading states.

## Security Considerations

1. **Admin Authentication**: Strict JWT validation for all admin endpoints
2. **Role-Based Access**: Ensure only admin users can access admin panel
3. **Input Validation**: Sanitize all inputs, especially file uploads
4. **Rate Limiting**: Implement on admin endpoints
5. **Audit Logging**: Log admin actions for security monitoring

## Database Schema Suggestions

### Admin Users Table
```sql
CREATE TABLE admin_users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Menu Items Table (extends customer menu)
```sql
ALTER TABLE menu_items ADD COLUMN available BOOLEAN DEFAULT TRUE;
```

### Promotions Table
```sql
CREATE TABLE promotions (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  discount DECIMAL(5,2) NOT NULL,
  expiry_date DATE NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing Checklist

- [ ] Admin login/logout functionality
- [ ] Category CRUD operations
- [ ] Menu item CRUD operations
- [ ] Order viewing and status updates
- [ ] Promotion management
- [ ] Report data loading and chart rendering
- [ ] Error handling for invalid requests
- [ ] Authentication middleware
- [ ] File upload handling for menu images
- [ ] Theme persistence across admin panel

## Support

For questions about admin frontend integration, refer to the admin code in `admin/admin.js` and HTML files. All API calls are prepared with placeholders for easy backend connection.
