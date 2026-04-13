// Sample data to populate your database
// You can paste these documents into MongoDB using MongoDB Compass or Atlas

// Sample Categories
db.categories.insertMany([
  {
    name: "Electronics",
    description: "Electronic devices and gadgets",
    image: "https://via.placeholder.com/300x200?text=Electronics",
    isActive: true
  },
  {
    name: "Fashion",
    description: "Clothing and fashion items",
    image: "https://via.placeholder.com/300x200?text=Fashion",
    isActive: true
  },
  {
    name: "Home & Garden",
    description: "Home and garden products",
    image: "https://via.placeholder.com/300x200?text=Home+Garden",
    isActive: true
  },
  {
    name: "Books",
    description: "Books and educational materials",
    image: "https://via.placeholder.com/300x200?text=Books",
    isActive: true
  },
  {
    name: "Sports",
    description: "Sports and fitness equipment",
    image: "https://via.placeholder.com/300x200?text=Sports",
    isActive: true
  }
]);

// Sample Products (Note: Replace category IDs with actual IDs from your database)
db.products.insertMany([
  {
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 149.99,
    originalPrice: 199.99,
    category: ObjectId("category_id_here"), // Replace with actual category ID
    images: ["https://via.placeholder.com/500x500?text=Headphones"],
    stock: 50,
    rating: 4.5,
    reviews: [],
    featured: true,
    isActive: true
  },
  {
    name: "Smart Watch",
    description: "Feature-rich smartwatch with fitness tracking",
    price: 299.99,
    originalPrice: 399.99,
    category: ObjectId("category_id_here"),
    images: ["https://via.placeholder.com/500x500?text=SmartWatch"],
    stock: 30,
    rating: 4.8,
    reviews: [],
    featured: true,
    isActive: true
  },
  {
    name: "USB-C Cable",
    description: "Durable USB-C charging and data cable",
    price: 9.99,
    originalPrice: 19.99,
    category: ObjectId("category_id_here"),
    images: ["https://via.placeholder.com/500x500?text=USB-C+Cable"],
    stock: 200,
    rating: 4.3,
    reviews: [],
    featured: false,
    isActive: true
  }
]);

// Admin User (Create after registering one user normally, then update role)
// db.users.updateOne(
//   { email: "admin@example.com" },
//   { $set: { role: "admin" } }
// );
