import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';

export const getUserCart = (userId, sessionId) => {
  return Cart.getByUserOrSession(userId, sessionId);
};

export const addItemToCart = ({ userId, sessionId, productId, quantity }) => {
  return Cart.addItem({ userId, sessionId, productId, quantity });
};

export const updateCartItem = (cartItemId, quantity) => {
  Cart.updateQuantity(cartItemId, quantity);
};

export const removeCartItem = (cartItemId) => {
  Cart.removeItem(cartItemId);
};

export const getUserWishlist = (userId, sessionId) => {
  return Wishlist.getByUserOrSession(userId, sessionId);
};

export const toggleWishlistItem = ({ userId, sessionId, productId }) => {
  return Wishlist.toggleItem({ userId, sessionId, productId });
};

export const removeWishlistItem = (wishlistId) => {
  Wishlist.removeItem(wishlistId);
};
