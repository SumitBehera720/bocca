import React, { createContext, useState, useEffect } from 'react';
import * as cartService from '../services/cartService';
import toast from 'react-hot-toast';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const items = await cartService.getWishlist();
      setWishlistItems(items || []);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const toggleWishlist = async (productId, productName = 'Product') => {
    try {
      const res = await cartService.toggleWishlist(productId);
      setWishlistItems(res.wishlist || []);
      if (res.added) {
        toast.success(`${productName} added to wishlist!`);
      } else {
        toast.success(`${productName} removed from wishlist`);
      }
      return res.added;
    } catch (error) {
      toast.error(error.message || 'Failed to update wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      const updatedWishlist = await cartService.removeWishlist(wishlistId);
      setWishlistItems(updatedWishlist || []);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      loading,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
      wishlistCount: wishlistItems.length,
      fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
