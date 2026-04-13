import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading admin dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center py-12">Error loading dashboard</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Dashboard Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {['dashboard', 'products', 'orders', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded capitalize font-semibold whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 text-sm mb-2">Total Users</p>
              <p className="text-4xl font-bold">{stats.stats.totalUsers}</p>
              <p className="text-green-600 text-sm mt-2">Active users</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 text-sm mb-2">Total Products</p>
              <p className="text-4xl font-bold">{stats.stats.totalProducts}</p>
              <p className="text-blue-600 text-sm mt-2">Active products</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 text-sm mb-2">Total Orders</p>
              <p className="text-4xl font-bold">{stats.stats.totalOrders}</p>
              <p className="text-orange-600 text-sm mt-2">All time</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 text-sm mb-2">Total Sales</p>
              <p className="text-4xl font-bold">
                ${stats.stats.totalSales.toFixed(2)}
              </p>
              <p className="text-green-600 text-sm mt-2">Revenue</p>
            </div>
          </div>
        )}

        {/* Analytics Chart */}
        {activeTab === 'dashboard' && stats.salesData && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Sales Trend</h2>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-600">
                Chart visualization would be displayed here using Chart.js or similar library
              </p>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        {activeTab === 'dashboard' && stats.recentOrders && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Total</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4">{order.user?.name}</td>
                      <td className="py-3 px-4 font-semibold">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.orderStatus === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Products Management</h2>
              <button
                onClick={() => navigate('/admin/products/new')}
                className="btn-primary"
              >
                Add Product
              </button>
            </div>
            <p className="text-gray-600">
              Product management interface would be displayed here
            </p>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Orders Management</h2>
            <p className="text-gray-600">
              Orders management interface would be displayed here
            </p>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Users Management</h2>
            <p className="text-gray-600">
              Users management interface would be displayed here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
