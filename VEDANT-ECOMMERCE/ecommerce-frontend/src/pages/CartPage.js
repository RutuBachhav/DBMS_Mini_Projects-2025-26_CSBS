import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, fetchCart, updateCartItem, removeFromCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchCart();
    }
  }, [user]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) return;
    try {
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating cart');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      alert(error.response?.data?.message || 'Error removing item');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Add some items to your cart to get started!
          </p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-4 p-6 border-b last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {item.product.description?.substring(0, 100)}...
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.product._id, item.quantity - 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          <FiMinus />
                        </button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.product._id, item.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          <FiPlus />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-lg">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                        <div className="text-gray-600 text-sm">
                          ₹{item.price.toLocaleString('en-IN')} each
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    ₹{cart.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold">
                    ₹{cart.totalPrice > 50000 ? '0' : '999'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-semibold">
                    ₹{Math.round(cart.totalPrice * 0.1).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>
                    ₹
                    {(
                      cart.totalPrice +
                      (cart.totalPrice > 50000 ? 0 : 999) +
                      Math.round(cart.totalPrice * 0.1)
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary py-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full btn-secondary py-3 mt-3"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
