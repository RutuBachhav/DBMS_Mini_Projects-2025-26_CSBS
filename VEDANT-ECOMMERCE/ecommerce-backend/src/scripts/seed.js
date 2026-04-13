#!/usr/bin/env node

/**
 * Database Seeding Script
 * 
 * This script populates the MongoDB database with sample products and categories
 * 
 * Usage:
 *   npm run seed
 * 
 * Make sure:
 * 1. MongoDB is running
 * 2. .env file is properly configured with MONGODB_URI
 * 3. You're in the ecommerce-backend directory
 */

require('dotenv').config();
require('./seedDatabase.js');
