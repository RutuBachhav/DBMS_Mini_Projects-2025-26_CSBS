# Setup Instructions

## Quick Start Guide

### Step 1: Install MongoDB

**Windows:**
- Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
- Install and follow the instructions
- MongoDB will be accessible at `mongodb://localhost:27017`

**Mac (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Step 2: Start MongoDB
```bash
# Verify MongoDB is running
mongosh  # or mongo (depending on version)
```

### Step 3: Backend Setup
```bash
cd ecommerce-backend

# Install dependencies
npm install

# Update .env file with your configuration
# MongoDB should already be running at mongodb://localhost:27017

# Start backend server
npm run dev

# You should see: "Server running on port 5000"
```

### Step 4: Frontend Setup (in a new terminal)
```bash
cd ecommerce-frontend

# Install dependencies
npm install

# Start frontend development server
npm start

# Browser will open at http://localhost:3000
```

## Testing the Application

### 1. User Registration
1. Click "Register" on the home page
2. Fill in your details
3. You'll be logged in automatically

### 2. Browse Products
1. Navigate to "Products" or click "Shop Now"
2. Use filters to find products by category or price
3. Search for specific products

### 3. Add to Cart & Checkout
1. Click on any product to view details
2. Add quantity and click "Add to Cart"
3. Go to cart page
4. Review items and proceed to checkout
5. Fill in shipping address
6. Choose payment method (use "mock" for testing)
7. Place order

### 4. Admin Access
To access admin features:
1. Use MongoDB client to find your user document
2. Update the role field to "admin"
3. Login again
4. Click "Admin" in navigation to access dashboard

## Useful MongoDB Commands

```bash
# Open MongoDB shell
mongosh

# Use ecommerce database
use ecommerce

# View all collections
show collections

# View all users
db.users.find()

# Make a user admin
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)

# View all products
db.products.find()

# Delete all data (use with caution!)
db.dropDatabase()
```

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is in use
netstat -ao | findstr :5000  # Windows
lsof -i :5000  # Mac/Linux

# Kill the process or use a different port
```

### Frontend Won't Load
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try running on different port
PORT=3001 npm start
```

### MongoDB Connection Refused
```bash
# Start MongoDB service
# Windows: net start MongoDB or use MongoDB Compass
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### CORS Errors
- Ensure backend is running on port 5000
- Check that CORS middleware is properly configured in server.js
- Verify API URL in frontend's api.js service file

## Next Steps

1. ✅ Set up the database schema with sample data
2. ✅ Create admin users for testing
3. ✅ Test all API endpoints using Postman
4. ✅ Customize styling and branding
5. ✅ Add real payment gateway integration
6. ✅ Implement email notifications
7. ✅ Deploy to production

## Documentation

- API Documentation: See routes in backend/src/routes/
- Database Schema: See models in backend/src/models/
- Frontend Components: See components in frontend/src/components/
- Pages: See pages in frontend/src/pages/

## Support

For issues:
1. Check the README.md for detailed information
2. Review the console logs for error messages
3. Check MongoDB connection string in .env
4. Verify all dependencies are installed

Happy coding! 🚀
