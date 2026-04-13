const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

// Product Management
const createProduct = async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, stock, images } =
      req.body;

    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      category,
      stock,
      images: images || [],
    });

    await product.save();

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, stock, featured } =
      req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, originalPrice, category, stock, featured },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Category Management
const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const category = new Category({ name, description, image });
    await category.save();

    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, image },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Order Management
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, note } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderHistory.push({
      status: orderStatus,
      note: note || '',
    });

    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Management
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard Analytics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();

    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user')
      .populate('items.product');

    const sales = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalSales: totalSales[0]?.total || 0,
      },
      recentOrders,
      salesData: sales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  toggleUserActive,
  getDashboardStats,
};
