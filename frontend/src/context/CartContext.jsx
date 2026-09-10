import React, { createContext, useState, useEffect } from 'react';
import * as cartService from '../services/cartService';
import toast from 'react-hot-toast';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const items = await cartService.getCart();
      setCartItems(items || []);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1, productName = 'Medicine') => {
    try {
      const updatedCart = await cartService.addToCart(productId, quantity);
      setCartItems(updatedCart || []);
      toast.success(`${productName} added to medicine cart!`);
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to add medicine to cart');
      return false;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const updatedCart = await cartService.updateCartItem(cartItemId, quantity);
      setCartItems(updatedCart || []);
    } catch (error) {
      toast.error(error.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const updatedCart = await cartService.removeCartItem(cartItemId);
      setCartItems(updatedCart || []);
      toast.success('Medicine removed from cart');
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasPrescriptionItems = cartItems.some(item => item.requiresPrescription === 1 || item.requiresPrescription === true);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      fetchCart,
      cartTotal,
      cartCount,
      hasPrescriptionItems
    }}>
      {children}
    </CartContext.Provider>
  );
};
