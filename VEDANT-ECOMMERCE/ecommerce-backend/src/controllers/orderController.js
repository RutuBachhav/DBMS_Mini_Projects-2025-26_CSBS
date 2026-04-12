const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate(
      'items.product'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = new Order({
      orderNumber: generateOrderNumber(),
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      totalAmount: cart.totalPrice,
      paymentMethod,
      paymentStatus: 'completed',
      orderStatus: 'processing',
      orderHistory: [
        {
          status: 'pending',
          note: 'Order placed',
        },
      ],
      trackingNumber: `TRACK-${Date.now()}`,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    });

    await order.save();

    // Reduce product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], totalItems: 0, totalPrice: 0 }
    );

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.orderStatus !== 'pending') {
      return res
        .status(400)
        .json({ message: 'Cannot cancel order in this status' });
    }

    order.orderStatus = 'cancelled';
    order.orderHistory.push({
      status: 'cancelled',
      note: 'Order cancelled by user',
    });

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    await order.save();

    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
};
