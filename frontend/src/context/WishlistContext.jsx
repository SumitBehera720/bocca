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

  const toggleWishlist = async (productId, productDetails = 'Product') => {
    try {
      const details = typeof productDetails === 'object' ? productDetails : { productName: productDetails };
      const name = details.productName || details.name || (typeof productDetails === 'string' ? productDetails : 'Product');
      const res = await cartService.toggleWishlist(productId, details);
      setWishlistItems(res.wishlist || []);
      if (res.added) {
        toast.success(`${name} added to wishlist!`);
      } else {
        toast.success(`${name} removed from wishlist`);
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
    return wishlistItems.some(item => Number(item.productId) === Number(productId));
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
