# E-Commerce Management System (MERN Stack)

A full-featured e-commerce platform built with **MongoDB**, **Express.js**, **React.js**, and **Node.js** (MERN stack).

## Features

### Frontend Features
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Product browsing and search
- ✅ Product filtering by category and price
- ✅ Product details and reviews
- ✅ User authentication (Register/Login)
- ✅ Shopping cart management
- ✅ Checkout process
- ✅ Order history and tracking
- ✅ User profile management
- ✅ Admin dashboard
- ✅ Tailwind CSS for styling

### Backend Features
- ✅ User authentication with JWT
- ✅ RESTful APIs
- ✅ Product management (CRUD)
- ✅ Category management
- ✅ Shopping cart operations
- ✅ Order management
- ✅ Mock payment processing
- ✅ Admin APIs for dashboard
- ✅ Order tracking and status updates
- ✅ Error handling and validation

### Database Features
- ✅ MongoDB for data storage
- ✅ Mongoose for schema modeling
- ✅ Proper indexing and relationships
- ✅ Data validation schemas

## Project Structure

```
ecommerce-project/
├── ecommerce-backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   └── adminController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Category.js
│   │   │   ├── Cart.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── adminMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── jwtUtils.js
│   │   │   └── passwordUtils.js
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── ecommerce-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── ProductCard.js
│   │   │   └── ProductFilter.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ProductListingPage.js
│   │   │   ├── ProductDetailsPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   ├── OrderHistoryPage.js
│   │   │   ├── OrderDetailsPage.js
│   │   │   ├── ProfilePage.js
│   │   │   └── AdminDashboardPage.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
```

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (v4.4 or higher) - Running locally or MongoDB Atlas
- **Git**

## Installation & Setup

### 1. Clone or Extract the Project

```bash
cd ecommerce-project
```

### 2. Backend Setup

```bash
cd ecommerce-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Update MONGODB_URI, JWT_SECRET, STRIPE keys if needed

# Start the backend server
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../ecommerce-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get product details
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get all categories

### Cart
- `GET /api/cart` - Get cart (Protected)
- `POST /api/cart/add` - Add to cart (Protected)
- `PUT /api/cart/update` - Update cart item (Protected)
- `DELETE /api/cart/remove/:productId` - Remove from cart (Protected)
- `DELETE /api/cart/clear` - Clear cart (Protected)

### Orders
- `POST /api/orders/create` - Create order (Protected)
- `GET /api/orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order details (Protected)
- `PUT /api/orders/:id/cancel` - Cancel order (Protected)

### Admin
- `POST /api/admin/products` - Create product (Protected, Admin)
- `PUT /api/admin/products/:id` - Update product (Protected, Admin)
- `DELETE /api/admin/products/:id` - Delete product (Protected, Admin)
- `POST /api/admin/categories` - Create category (Protected, Admin)
- `GET /api/admin/orders` - Get all orders (Protected, Admin)
- `PUT /api/admin/orders/:id/status` - Update order status (Protected, Admin)
- `GET /api/admin/users` - Get all users (Protected, Admin)
- `GET /api/admin/dashboard/stats` - Get dashboard statistics (Protected, Admin)

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLIC_KEY=your_stripe_public_key_here
NODE_ENV=development
```

### Frontend
The frontend uses the API base URL: `http://localhost:5000/api`

## Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  role: String (enum: ['user', 'admin']),
  profileImage: String,
  isActive: Boolean,
  timestamps
}
```

### Product Schema
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  originalPrice: Number,
  category: ObjectId (ref: Category),
  images: [String],
  stock: Number (required),
  rating: Number (0-5),
  reviews: [{ user, comment, rating, createdAt }],
  featured: Boolean,
  isActive: Boolean,
  timestamps
}
```

### Order Schema
```javascript
{
  orderNumber: String (unique, required),
  user: ObjectId (ref: User),
  items: [{ product, quantity, price }],
  shippingAddress: { street, city, state, zipCode, country },
  totalAmount: Number (required),
  paymentMethod: String,
  paymentStatus: String (enum: ['pending', 'completed', 'failed']),
  orderStatus: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  orderHistory: [{ status, timestamp, note }],
  trackingNumber: String,
  estimatedDelivery: Date,
  timestamps
}
```

## Usage

### Creating Test Data (Optional)

You can create sample products and categories through the admin APIs or MongoDB directly.

Sample Product:
```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "originalPrice": 1299.99,
  "category": "category_id_here",
  "stock": 50,
  "images": ["url_to_image"],
  "featured": true
}
```

### User Registration & Login

1. Go to `http://localhost:3000/register`
2. Fill in your details
3. After registration, you'll be logged in automatically
4. Explore the products and add items to cart

### Making Your First Order

1. Browse products
2. Add items to cart
3. Go to cart and review items
4. Click "Proceed to Checkout"
5. Fill in shipping details
6. Choose payment method (Mock for testing)
7. Place order
8. View order in "Order History"

### Admin Access

1. In MongoDB, update a user's role to 'admin'
2. Login as admin
3. Access admin dashboard from the navigation menu
4. Manage products, orders, users, and view analytics

## Technologies Used

### Frontend
- React.js 18+
- React Router DOM
- Tailwind CSS
- Axios
- React Icons
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcryptjs for password hashing

### Tools & Libraries
- Nodemon (Development)
- Postman (API Testing)
- Git (Version Control)

## Features Implemented

- [x] User authentication with JWT
- [x] Product listing with filters
- [x] Shopping cart functionality
- [x] Order management
- [x] Order tracking and history
- [x] User profile management
- [x] Admin dashboard
- [x] Mock payment processing
- [x] Product reviews and ratings
- [x] Responsive design
- [x] Error handling
- [x] Data validation

## Future Enhancements

- Real payment gateway integration (Stripe/Razorpay)
- Email notifications
- Advanced analytics and reporting
- Wishlist functionality
- Product recommendations
- Real-time notifications
- Advanced search with Elasticsearch
- Inventory management
- Multi-language support
- Mobile app (React Native)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB user credentials if using authentication

### Port Already in Use
```bash
# Find process using port 5000 (Backend)
lsof -i :5000

# Find process using port 3000 (Frontend)
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### CORS Issues
- Ensure backend CORS is configured properly
- Check API base URL in frontend

### Token Expiration
- The JWT token expires in 7 days
- User needs to login again after expiration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.

## Author

E-Commerce Development Team

---

**Happy Shopping! 🛍️**
