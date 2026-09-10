import { getUserWishlist, toggleWishlistItem, removeWishlistItem } from '../services/cartService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'guest_default';
    const items = getUserWishlist(userId, sessionId);
    return sendSuccess(res, items, 'Wishlist items retrieved');
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'guest_default';
    const { productId } = req.body;

    if (!productId) {
      return sendError(res, 'Product ID is required', 400);
    }

    const result = toggleWishlistItem({
      userId,
      sessionId,
      productId: Number(productId)
    });

    return sendSuccess(res, result, result.added ? 'Added to wishlist' : 'Removed from wishlist');
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    removeWishlistItem(Number(id));

    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'guest_default';
    const items = getUserWishlist(userId, sessionId);
    return sendSuccess(res, items, 'Item removed from wishlist');
  } catch (error) {
    next(error);
  }
};
