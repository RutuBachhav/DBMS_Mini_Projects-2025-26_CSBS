# Complete Step-by-Step Guide to Display Products on Frontend

## 🎯 Goal: Display 25 Products on Homepage and Product Listing Page

Follow these steps in order:

---

## Phase 1: Start Services (Do in Order)

### STEP 1: Start MongoDB Container
```powershell
# Open PowerShell in project root
cd C:\Users\harsh\vedantproject

# Start MongoDB
docker-compose up -d

# Wait 30-40 seconds for MongoDB to fully start
# Verify it's running
docker ps
# You should see "ecommerce_mongodb" in the list
```

### STEP 2: Create Admin User (First Time Only)
```powershell
# Connect to MongoDB
docker exec -it ecommerce_mongodb mongosh -u admin -p password123

# In MongoDB shell, run:
use ecommerce
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...", // This will be replaced
  role: "admin",
  isActive: true
})
exit
```

Alternative: Do this through the frontend after registering

### STEP 3: Seed Products in Database
Open **Terminal 1**:
```powershell
cd C:\Users\harsh\vedantproject\ecommerce-backend

# Install dependencies if not done
npm install

# Seed products
npm run seed

# Expected Output:
# ✅ 5 categories added
# ✅ 25 products added
# 📊 Database Seeding Complete!
```

### STEP 4: Start Backend Server
Open **Terminal 2**:
```powershell
cd C:\Users\harsh\vedantproject\ecommerce-backend

# Start backend
npm run dev

# Expected Output:
# ✅ MongoDB Connected: localhost
# ✅ Server running on port 5000
```

**Wait for both messages before proceeding!**

### STEP 5: Start Frontend
Open **Terminal 3**:
```powershell
cd C:\Users\harsh\vedantproject\ecommerce-frontend

# Clear cache if needed
npm cache clean --force

# Install dependencies
npm install

# Start development server
npm start

# Browser will auto-open to http://localhost:3000
```

---

## Phase 2: Verify Everything Works

### Check 1: Homepage Displays Featured Products
1. Go to: **http://localhost:3000**
2. You should see:
   - Hero banner
   - "Featured Products" section with 8+ products
   - Product cards with images, prices, ratings, and "View Details" button

### Check 2: Products Page Shows All Products
1. Click **"Shop Now"** or go to: **http://localhost:3000/products**
2. You should see:
   - Filter sidebar (search, category, sort)
   - Product grid (12 products per page)
   - Pagination controls
   - All 25 products displayed

### Check 3: Product Details Page Works
1. Click any product card
2. You should see:
   - Large product image
   - Price with discount (original price crossed out)
   - Stock status
   - Add to cart button
   - Quantity selector
   - Product details

### Check 4: Add to Cart Works
1. On product details page, click **"Add to Cart"**
2. Go to cart: **http://localhost:3000/cart**
3. You should see:
   - Cart items with prices
   - Quantity controls
   - Cart total
   - Checkout button

---

## Phase 3: Complete Purchase Flow

### Register/Login
1. Click **"Register"** (top right)
2. Fill in details and register
3. You'll be logged in automatically

### Browse Products
1. Go to **Products** page
2. Use filters to find items
3. Click products to view details

### Add Items & Checkout
1. Add items to cart
2. Go to **Cart**
3. Click **"Proceed to Checkout"**
4. Fill in shipping address
5. Choose payment method (use "mock" for testing)
6. Click **"Place Order"**

### View Order History
1. Click **"Orders"** in navigation
2. See all your orders with status
3. Click order to see tracking info

---

## 🛠️ Troubleshooting

### Products Not Showing
```powershell
# Check if seeding worked:
docker exec -it ecommerce_mongodb mongosh -u admin -p password123
use ecommerce
db.products.find().count()
# Should return: 25
# If not, run: npm run seed again

exit
```

### Backend Connection Error
```powershell
# Check if MongoDB is running
docker ps
# Should show ecommerce_mongodb

# If not, restart:
docker-compose down
docker-compose up -d
```

### Frontend Won't Start
```powershell
# Try clearing npm cache
npm cache clean --force
cd ecommerce-frontend

# Delete node_modules
rm -r node_modules

# Reinstall
npm install

# Start
npm start
```

### Port Already in Use
```powershell
# Kill process on port 3000 (frontend)
# On PowerShell (Admin):
Get-Process | Where-Object { $_.Handles -and $_.ProcessName -match "node" } | Stop-Process -Force

# Kill port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📊 What Products Are In Database

### Category 1: Electronics (5 products)
- Wireless Headphones: $199.99 (Featured)
- 4K Smart TV: $599.99 (Featured)
- Smartwatch: $299.99 (Featured)  
- USB-C Cables: $14.99
- Bluetooth Speaker: $79.99 (Featured)

### Category 2: Fashion (5 products)
- Premium Jeans: $49.99
- T-Shirt: $19.99 (Featured)
- Sneakers: $59.99 (Featured)
- Winter Jacket: $199.99 (Featured)
- Sundress: $34.99

### Category 3: Home & Garden (5 products)
- Table Lamp: $44.99
- Office Chair: $189.99 (Featured)
- Cookware Set: $129.99 (Featured)
- Garden Chairs: $89.99
- Shelving Unit: $59.99 (Featured)

### Category 4: Books (5 products)
- Art of Programming: $54.99 (Featured)
- Clean Code: $34.99 (Featured)
- Lean Startup: $29.99
- JavaScript Guide: $59.99 (Featured)
- Atomic Habits: $24.99 (Featured)

### Category 5: Sports (5 products)
- Yoga Mat: $24.99
- Dumbbell Set: $149.99 (Featured)
- Running Shoes: $99.99 (Featured)
- Fitness Tracker: $79.99
- Basketball Hoop: $199.99 (Featured)

---

## 🎨 Features Working In Frontend

### ✅ Homepage
- Hero banner with call-to-action
- Featured products section (8 products)
- Category preview
- Newsletter signup

### ✅ Products Page  
- Full product listing (25 products)
- Search by product name
- Filter by category
- Sort by price/rating/newest
- Pagination (12 products per page)
- Product cards with images, prices, ratings

### ✅ Product Details
- Large product images
- Price with discount calculation
- Stock status
- Rating and reviews
- Add to cart with quantity selector

### ✅ Shopping Cart
- View cart items
- Update quantities
- Remove items
- Cart totals with tax and shipping
- Checkout button

### ✅ Checkout
- Shipping address form
- Payment method selection
- Order review
- Order placement

### ✅ Order Management
- View order history
- See order details
- Track order status
- View tracking number
- Cancel pending orders

### ✅ User Profile
- View profile information
- Edit profile and address
- Logout

### ✅ Admin Dashboard
- Dashboard statistics
- Manage products
- Manage orders
- Manage users
- View sales analytics

---

## 🚀 Quick Command Reference

```powershell
# Start MongoDB
docker-compose up -d

# Stop MongoDB
docker-compose down

# Seed products
npm run seed  # (in ecommerce-backend directory)

# Start backend
npm run dev  # (in ecommerce-backend directory)

# Start frontend  
npm start  # (in ecommerce-frontend directory)

# Check MongoDB container
docker ps

# View MongoDB logs
docker logs ecommerce_mongodb

# Connect to MongoDB
docker exec -it ecommerce_mongodb mongosh -u admin -p password123
```

---

## 📱 URLs Reference

```
Homepage: http://localhost:3000
Products: http://localhost:3000/products
Product Details: http://localhost:3000/product/:id
Cart: http://localhost:3000/cart
Checkout: http://localhost:3000/checkout
Orders: http://localhost:3000/orders
Profile: http://localhost:3000/profile
Admin Dashboard: http://localhost:3000/admin
Login: http://localhost:3000/login
Register: http://localhost:3000/register

Backend API: http://localhost:5000/api
Health Check: http://localhost:5000/api/health
```

---

## ✨ Next Steps

1. ✅ Follow all steps above
2. ✅ Verify products display on homepage
3. ✅ Try purchasing an item
4. ✅ View order in order history
5. ✅ Explore admin dashboard
6. ✅ Customize products as needed

---

**You now have a fully functional e-commerce store with 25 real products! 🎉**
