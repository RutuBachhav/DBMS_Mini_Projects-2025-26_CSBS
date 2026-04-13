import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
            <button
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-bold">{order.orderNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-bold text-lg">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="font-semibold">{order.items.length} items</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Payment</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        order.paymentStatus === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        order.orderStatus === 'delivered'
                          ? 'bg-blue-100 text-blue-800'
                          : order.orderStatus === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
