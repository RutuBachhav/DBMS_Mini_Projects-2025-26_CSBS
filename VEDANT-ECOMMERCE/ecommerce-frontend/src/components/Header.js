import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiLogOut, FiUser, FiHome } from 'react-icons/fi';

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <FiHome className="text-2xl text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">ShopHub</span>
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link to="/products" className="text-gray-600 hover:text-blue-600">
            Products
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-gray-600 hover:text-blue-600">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <FiShoppingCart className="text-2xl text-gray-600 hover:text-blue-600" />
            {cart?.totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart.totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <FiUser />
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
              <Link to="/orders" className="text-gray-600 hover:text-blue-600">
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
              >
                <FiLogOut className="text-xl" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
