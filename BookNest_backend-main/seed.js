import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      console.log(`Admin already exists: ${existing.email}`);
      process.exit(0);
    }

    const admin = new User({
      name: 'Admin',
      email: 'admin@booknest.com',
      password: 'admin123',
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@booknest.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seed();
