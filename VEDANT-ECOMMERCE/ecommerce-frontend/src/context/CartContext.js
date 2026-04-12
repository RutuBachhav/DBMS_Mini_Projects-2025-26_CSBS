import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      const response = await cartAPI.addToCart({ productId, quantity });
      setCart(response.data.cart);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await cartAPI.updateCartItem({ productId, quantity });
      setCart(response.data.cart);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await cartAPI.removeFromCart(productId);
      setCart(response.data.cart);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
