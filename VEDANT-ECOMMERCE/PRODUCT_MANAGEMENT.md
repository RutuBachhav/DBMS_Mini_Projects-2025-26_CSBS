# Product Management Guide

## 🛍️ Adding Products to Your E-Commerce Store

There are multiple ways to add products to your store:

---

## Method 1: Seed Database with Sample Data (Recommended for Testing)

### Step 1: Start MongoDB and Backend
```bash
# Terminal 1: Start MongoDB (if not already running)
docker-compose up -d

# Terminal 2: Start Backend
cd ecommerce-backend
npm run dev
```

Wait for: ✅ **"MongoDB Connected"** and ✅ **"Server running on port 5000"**

### Step 2: Run Seed Script
```bash
# Terminal 3: In ecommerce-backend directory
npm run seed
```

### Expected Output:
```
MongoDB Connected
✅ 5 categories added
✅ 25 products added

📊 Database Seeding Complete!
Total Categories: 5
Total Products: 25
Total Inventory: 1965 units
Total Featured Products: 16
```

### What Gets Added:
- **5 Categories**: Electronics, Fashion, Home & Garden, Books, Sports
- **25 Sample Products**: With pricing, images, stock, and ratings
- **Total Inventory**: ~2000 units across all products

---

## Method 2: Add Products via Admin API (Manual)

### Prerequisites:
1. Backend must be running (`npm run dev`)
2. You must be logged in as **admin user**

### Step 1: Create Admin User (One-time Setup)

Using MongoDB client or Compass:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Step 2: Login as Admin
- Go to `http://localhost:3000/login`
- Use your admin credentials

### Step 3: Use Postman to Add Product

```http
POST http://localhost:5000/api/admin/products
Authorization: Bearer <your_admin_token>
Content-Type: application/json

{
  "name": "Your Product Name",
  "description": "Detailed product description",
  "price": 99.99,
  "originalPrice": 149.99,
  "category": "category_id_from_database",
  "stock": 100,
  "images": ["https://image-url.com/image.jpg"],
  "featured": true
}
```

### Step 4: View Product on Frontend
- Go to `http://localhost:3000/products`
- Your product should appear in the list

---

## Method 3: Add Products Using MongoDB Directly

### Connect to MongoDB
```bash
docker exec -it ecommerce_mongodb mongosh -u admin -p password123
```

### Use Database
```mongodb
use ecommerce
```

### Add Single Product
```mongodb
db.products.insertOne({
  name: "Your Product",
  description: "Product description",
  price: 99.99,
  originalPrice: 149.99,
  category: ObjectId("category_id"),
  images: ["https://image-url.com"],
  stock: 50,
  rating: 4.5,
  featured: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Add Multiple Products
```mongodb
db.products.insertMany([
  { /* product 1 */ },
  { /* product 2 */ }
])
```

---

## Product Schema Reference

```javascript
{
  name: String (required) - Product name
  description: String (required) - Detailed description
  price: Number (required) - Current selling price
  originalPrice: Number - Original/list price (for showing discounts)
  category: ObjectId (required) - Reference to Category
  images: [String] - Array of image URLs
  stock: Number (required) - Available quantity
  rating: Number (0-5) - Average rating
  reviews: [
    {
      user: ObjectId,
      comment: String,
      rating: Number,
      createdAt: Date
    }
  ]
  featured: Boolean - Show on homepage banner
  isActive: Boolean - Is product available
  timestamps: true
}
```

---

## Sample Product Data

### Electronics Category
```json
{
  "name": "Wireless AirBuds Pro",
  "description": "Premium wireless headphones with noise cancellation",
  "price": 249.99,
  "originalPrice": 349.99,
  "category": "ELECTRONICS_CATEGORY_ID",
  "images": ["https://via.placeholder.com/500x500?text=AirBuds"],
  "stock": 50,
  "rating": 4.8,
  "featured": true
}
```

### Fashion Category
```json
{
  "name": "Premium T-Shirt",
  "description": "100% organic cotton comfortable fit",
  "price": 29.99,
  "originalPrice": 49.99,
  "category": "FASHION_CATEGORY_ID",
  "images": ["https://via.placeholder.com/500x500?text=TShirt"],
  "stock": 150,
  "rating": 4.5,
  "featured": true
}
```

### Home Category
```json
{
  "name": "Desk Lamp LED",
  "description": "Modern LED lamp with USB charge",
  "price": 44.99,
  "originalPrice": 69.99,
  "category": "HOME_CATEGORY_ID",
  "images": ["https://via.placeholder.com/500x500?text=Lamp"],
  "stock": 75,
  "rating": 4.6,
  "featured": false
}
```

---

## Managing Products

### View All Products (Frontend)
- Go to `http://localhost:3000/products`
- Use filters to sort and search

### Update Product Price
```http
PUT http://localhost:5000/api/admin/products/:product_id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 79.99,
  "stock": 30
}
```

### Delete Product (Soft Delete)
```http
DELETE http://localhost:5000/api/admin/products/:product_id
Authorization: Bearer <admin_token>
```

---

## Free Image URLs for Products

Use these placeholder providers or real image URLs:

- **Unsplash**: https://unsplash.com/
- **Pexels**: https://www.pexels.com/
- **Pixabay**: https://pixabay.com/
- **Placeholder**: https://via.placeholder.com/500x500?text=Product

### Example Image URLs:
```
Electronics:
https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500

Fashion:
https://images.unsplash.com/photo-1595777707802-221046d53d60?w=500

Home:
https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500

Books:
https://images.unsplash.com/photo-1507842217343-583f20270319?w=500

Sports:
https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500
```

---

## Troubleshooting

### Seed Script Fails
```bash
# Check if MongoDB is running
docker ps
# Output should show "ecommerce_mongodb"

# Check logs
docker logs ecommerce_mongodb

# Restart MongoDB
docker-compose restart
```

### No Products Show on Frontend
1. Verify seed script ran successfully
2. Check MongoDB has data:
   ```bash
   docker exec -it ecommerce_mongodb mongosh -u admin -p password123
   use ecommerce
   db.products.find().count()
   # Should show a number > 0
   ```
3. Refresh frontend page
4. Check browser console for errors

### Images Not Loading
- Ensure image URLs are valid HTTPS
- Test URLs in browser before adding products
- Use placeholder service as backup

---

## Database Queries

### Check Products in Database
```bash
docker exec -it ecommerce_mongodb mongosh -u admin -p password123 <<EOF
use ecommerce
db.products.find().pretty()
EOF
```

### Count Products by Category
```bash
docker exec -it ecommerce_mongodb mongosh -u admin -p password123 <<EOF
use ecommerce
db.products.aggregate([
  { \$group: { _id: "\$category", count: { \$sum: 1 } } }
])
EOF
```

### Find Featured Products
```bash
docker exec -it ecommerce_mongodb mongosh -u admin -p password123 <<EOF
use ecommerce
db.products.find({ featured: true }).count()
EOF
```

---

## Next Steps

1. ✅ Run seed script: `npm run seed`
2. ✅ Start frontend: `npm start`
3. ✅ Browse products: http://localhost:3000/products
4. ✅ Add to cart and checkout
5. ✅ View orders at http://localhost:3000/orders
6. ✅ Admin dashboard: http://localhost:3000/admin

---

## Performance Tips

- **Images**: Use small file sizes (300-500KB)
- **Descriptions**: Keep under 500 characters
- **SKU**: Add unique identifier for inventory
- **Stock**: Update regularly to avoid overselling
- **Featured**: Limit to 5-10 products for homepage

---

**Your store is now ready with real products! 🎉**
