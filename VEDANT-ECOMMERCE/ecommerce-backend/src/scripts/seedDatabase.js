const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Import models
const Category = require('../models/Category');
const Product = require('../models/Product');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Sample Categories
const sampleCategories = [
  {
    name: 'Electronics',
    description: 'Latest electronic devices and gadgets',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    isActive: true,
  },
  {
    name: 'Fashion',
    description: 'Trendy clothing and fashion accessories',
    image: 'https://images.unsplash.com/photo-1595777707802-221046d53d60?w=500',
    isActive: true,
  },
  {
    name: 'Home & Garden',
    description: 'Home and garden essentials',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500',
    isActive: true,
  },
  {
    name: 'Books',
    description: 'Books and educational materials',
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500',
    isActive: true,
  },
  {
    name: 'Sports',
    description: 'Sports and fitness equipment',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
    isActive: true,
  },
];

// Sample Products
const createSampleProducts = (categoryIds) => [
  // Electronics
  {
    name: 'Wireless Noise Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality',
    price: 16499,
    originalPrice: 24899,
    category: categoryIds[0], // Electronics
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
    ],
    stock: 45,
    rating: 4.8,
    featured: true,
    isActive: true,
  },
  {
    name: '4K Ultra HD Smart TV 55 inch',
    description: '55-inch 4K Smart TV with HDR10+, Dolby Vision, and built-in streaming apps',
    price: 49799,
    originalPrice: 66499,
    category: categoryIds[0],
    images: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
    ],
    stock: 20,
    rating: 4.6,
    featured: true,
    isActive: true,
  },
  {
    name: 'Smartwatch Pro - Advanced Fitness Tracker',
    description: 'Feature-rich smartwatch with heart rate monitor, GPS, sleep tracking, and 7-day battery',
    price: 24899,
    originalPrice: 33199,
    category: categoryIds[0],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    ],
    stock: 60,
    rating: 4.7,
    featured: true,
    isActive: true,
  },
  {
    name: 'USB-C Fast Charging Cable (3-Pack)',
    description: 'High-speed USB-C cables with 5A charging and data transfer capability',
    price: 1249,
    originalPrice: 2074,
    category: categoryIds[0],
    images: [
      'https://images.unsplash.com/photo-1606841836239-c5a1a4a07af7?w=500',
    ],
    stock: 200,
    rating: 4.5,
    featured: false,
    isActive: true,
  },
  {
    name: 'Wireless Portable Speaker',
    description: '360-degree sound, waterproof, 12-hour battery life, and Bluetooth 5.0',
    price: 6639,
    originalPrice: 9959,
    category: categoryIds[0],
    images: [
      'https://images.unsplash.com/photo-1589003077984-894ba133c836?w=500',
    ],
    stock: 85,
    rating: 4.4,
    featured: true,
    isActive: true,
  },

  // Fashion
  {
    name: 'Premium Denim Jeans for Men',
    description: 'Comfortable and stylish denim jeans with perfect fit and fade-resistant material',
    price: 4149,
    originalPrice: 6639,
    category: categoryIds[1], // Fashion
    images: [
      'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500',
    ],
    stock: 120,
    rating: 4.3,
    featured: false,
    isActive: true,
  },
  {
    name: 'Classic White Cotton T-Shirt',
    description: '100% organic cotton, comfortable fit, perfect for daily wear',
    price: 1659,
    originalPrice: 3319,
    category: categoryIds[1],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    ],
    stock: 250,
    rating: 4.6,
    featured: true,
    isActive: true,
  },
  {
    name: 'Women\'s Casual Sneakers',
    description: 'Lightweight and comfortable sneakers perfect for everyday wear',
    price: 4979,
    originalPrice: 8299,
    category: categoryIds[1],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    ],
    stock: 95,
    rating: 4.7,
    featured: true,
    isActive: true,
  },
  {
    name: 'Leather Winter Jacket',
    description: 'Genuine leather jacket with fleece lining, perfect for cold seasons',
    price: 16499,
    originalPrice: 23239,
    category: categoryIds[1],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500',
    ],
    stock: 35,
    rating: 4.8,
    featured: true,
    isActive: true,
  },
  {
    name: 'Summer Sundress',
    description: 'Lightweight and breathable summer dress perfect for vacation',
    price: 2904,
    originalPrice: 4979,
    category: categoryIds[1],
    images: [
      'https://images.unsplash.com/photo-1595777707802-221046d53d60?w=500',
    ],
    stock: 80,
    rating: 4.5,
    featured: false,
    isActive: true,
  },

  // Home & Garden
  {
    name: 'LED Coffee Table Lamp',
    description: 'Modern LED lamp with adjustable brightness and USB charging port',
    price: 3734,
    originalPrice: 5809,
    category: categoryIds[2], // Home & Garden
    images: [
      'https://images.unsplash.com/photo-1565182999555-2142b9c0bedc?w=500',
    ],
    stock: 55,
    rating: 4.4,
    featured: false,
    isActive: true,
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Comfortable office chair with lumbar support and adjustable height',
    price: 15779,
    originalPrice: 24899,
    category: categoryIds[2],
    images: [
      'https://images.unsplash.com/photo-1505797694658-48aebe0e2bcd?w=500',
    ],
    stock: 30,
    rating: 4.6,
    featured: true,
    isActive: true,
  },
  {
    name: 'Stainless Steel Cookware Set (10-piece)',
    description: 'Complete cookware set with non-stick coating and heat-resistant handles',
    price: 10789,
    originalPrice: 16599,
    category: categoryIds[2],
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
    ],
    stock: 40,
    rating: 4.7,
    featured: true,
    isActive: true,
  },
  {
    name: 'Garden Outdoor Chair (Pair)',
    description: 'Weather-resistant garden chairs perfect for patios and balconies',
    price: 7469,
    originalPrice: 11619,
    category: categoryIds[2],
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
    ],
    stock: 70,
    rating: 4.3,
    featured: false,
    isActive: true,
  },
  {
    name: 'Wall-mounted Shelving Unit',
    description: 'Modern floating shelves for storage and display',
    price: 4979,
    originalPrice: 7469,
    category: categoryIds[2],
    images: [
      'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500',
    ],
    stock: 65,
    rating: 4.5,
    featured: true,
    isActive: true,
  },

  // Books
  {
    name: 'The Art of Computer Programming',
    description: 'Classic computer science book by Donald Knuth, essential reading for programmers',
    price: 4564,
    originalPrice: 6639,
    category: categoryIds[3], // Books
    images: [
      'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500',
    ],
    stock: 25,
    rating: 4.9,
    featured: true,
    isActive: true,
  },
  {
    name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    description: 'Learn to write code that is readable, maintainable, and elegant',
    price: 2904,
    originalPrice: 4149,
    category: categoryIds[3],
    images: [
      'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500',
    ],
    stock: 45,
    rating: 4.8,
    featured: true,
    isActive: true,
  },
  {
    name: 'The Lean Startup',
    description: 'How today\'s entrepreneurs build successful businesses',
    price: 2489,
    originalPrice: 3734,
    category: categoryIds[3],
    images: [
      'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500',
    ],
    stock: 60,
    rating: 4.7,
    featured: false,
    isActive: true,
  },
  {
    name: 'JavaScript: The Definitive Guide',
    description: 'Comprehensive guide to JavaScript programming language',
    price: 4979,
    originalPrice: 6639,
    category: categoryIds[3],
    images: [
      'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500',
    ],
    stock: 35,
    rating: 4.6,
    featured: true,
    isActive: true,
  },
  {
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    description: 'Practical guide to forming good habits and breaking bad ones',
    price: 2074,
    originalPrice: 3319,
    category: categoryIds[3],
    images: [
      'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500',
    ],
    stock: 100,
    rating: 4.9,
    featured: true,
    isActive: true,
  },

  // Sports
  {
    name: 'Yoga Mat with Carrying Strap',
    description: 'Non-slip yoga mat made from eco-friendly TPE material with carrying bag',
    price: 2074,
    originalPrice: 3734,
    category: categoryIds[4], // Sports
    images: [
      'https://images.unsplash.com/photo-1506241537224-7da12ac94cbf?w=500',
    ],
    stock: 110,
    rating: 4.6,
    featured: false,
    isActive: true,
  },
  {
    name: 'Adjustable Dumbbell Set (5-25 lbs)',
    description: 'Space-saving adjustable dumbbells perfect for home workouts',
    price: 12449,
    originalPrice: 19089,
    category: categoryIds[4],
    images: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
    ],
    stock: 40,
    rating: 4.8,
    featured: true,
    isActive: true,
  },
  {
    name: 'Professional Running Shoes',
    description: 'Lightweight running shoes with superior cushioning and breathable design',
    price: 8299,
    originalPrice: 12449,
    category: categoryIds[4],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    ],
    stock: 75,
    rating: 4.7,
    featured: true,
    isActive: true,
  },
  {
    name: 'Portable Fitness Tracker',
    description: 'Track your steps, calories, and heart rate with this portable fitness tracker',
    price: 6639,
    originalPrice: 10789,
    category: categoryIds[4],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    ],
    stock: 90,
    rating: 4.5,
    featured: false,
    isActive: true,
  },
  {
    name: 'Professional Basketball Hoop',
    description: 'Adjustable basketball hoop perfect for backyard installation',
    price: 16499,
    originalPrice: 24899,
    category: categoryIds[4],
    images: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
    ],
    stock: 25,
    rating: 4.4,
    featured: true,
    isActive: true,
  },
];

// Seed Database
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`✅ ${categories.length} categories added`);

    // Get category IDs
    const categoryIds = categories.map((cat) => cat._id);

    // Create and insert products
    const products = createSampleProducts(categoryIds);
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ ${insertedProducts.length} products added`);

    // Display summary
    console.log('\n📊 Database Seeding Complete!');
    console.log(`Total Categories: ${categories.length}`);
    console.log(`Total Products: ${insertedProducts.length}`);
    console.log(`Total Inventory: ${insertedProducts.reduce((sum, p) => sum + p.stock, 0)} units`);
    console.log(`Total Featured Products: ${insertedProducts.filter((p) => p.featured).length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
