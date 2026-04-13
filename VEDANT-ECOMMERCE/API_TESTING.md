# API Testing Guide

## Using Postman to Test APIs

### 1. Authentication APIs

#### Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login User
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <your_token_here>
```

### 2. Product APIs

#### Get All Products
```
GET http://localhost:5000/api/products
GET http://localhost:5000/api/products?category=category_id&search=laptop&sort=price_asc&page=1&limit=12
```

#### Get Product Details
```
GET http://localhost:5000/api/products/:product_id
```

#### Get Featured Products
```
GET http://localhost:5000/api/products/featured
```

#### Get Categories
```
GET http://localhost:5000/api/products/categories
```

### 3. Cart APIs

#### Get Cart
```
GET http://localhost:5000/api/cart
Authorization: Bearer <your_token_here>
```

#### Add to Cart
```
POST http://localhost:5000/api/cart/add
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 2
}
```

#### Update Cart Item
```
PUT http://localhost:5000/api/cart/update
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 5
}
```

#### Remove from Cart
```
DELETE http://localhost:5000/api/cart/remove/:product_id
Authorization: Bearer <your_token_here>
```

### 4. Order APIs

#### Create Order
```
POST http://localhost:5000/api/orders/create
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "mock"
}
```

#### Get User Orders
```
GET http://localhost:5000/api/orders
Authorization: Bearer <your_token_here>
```

#### Get Order Details
```
GET http://localhost:5000/api/orders/:order_id
Authorization: Bearer <your_token_here>
```

### 5. Admin APIs

#### Create Product
```
POST http://localhost:5000/api/admin/products
Authorization: Bearer <admin_token_here>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "originalPrice": 129.99,
  "category": "category_id_here",
  "stock": 100,
  "images": ["image_url_here"],
  "featured": true
}
```

#### Get All Orders (Admin)
```
GET http://localhost:5000/api/admin/orders
Authorization: Bearer <admin_token_here>
```

#### Update Order Status (Admin)
```
PUT http://localhost:5000/api/admin/orders/:order_id/status
Authorization: Bearer <admin_token_here>
Content-Type: application/json

{
  "orderStatus": "shipped",
  "note": "Order has been shipped"
}
```

#### Get Dashboard Stats (Admin)
```
GET http://localhost:5000/api/admin/dashboard/stats
Authorization: Bearer <admin_token_here>
```

## Response Format

All API responses follow this format:

Success:
```json
{
  "message": "Success message",
  "data": { /* response data */ }
}
```

Error:
```json
{
  "message": "Error message"
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Tips

1. Save frequently used requests in Postman collections
2. Create environment variables for base URL and tokens
3. Use Pre-request Scripts to automate token management
4. Test with different payment methods
5. Verify all error scenarios
