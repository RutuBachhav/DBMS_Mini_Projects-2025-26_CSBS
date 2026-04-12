import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ShopHub</h3>
            <p className="text-gray-400">
              Your trusted e-commerce platform for quality products.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white">
                  Products
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <FiFacebook className="text-2xl cursor-pointer hover:text-blue-400" />
              <FiTwitter className="text-2xl cursor-pointer hover:text-blue-400" />
              <FiInstagram className="text-2xl cursor-pointer hover:text-pink-400" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400">
            &copy; 2024 ShopHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
