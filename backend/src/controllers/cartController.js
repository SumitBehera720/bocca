import { getUserCart, addItemToCart, updateCartItem, removeCartItem } from '../services/cartService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'guest_default';
    const items = getUserCart(userId, sessionId);
    return sendSuccess(res, items, 'Cart items retrieved');
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'guest_default';
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return sendError(res, 'Product ID is required', 400);
    }

    const cart = addItemToCart({
      userId,
      sessionId,
      productId: Number(productId),
      quantity: Number(quantity)
    });

    return sendSuccess(res, cart, 'Item added to cart', 201);
  } catch (error) {
    next(error);
  }
};

export const updateQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    updateCartItem(Number(id), Number(quantity));
    
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'guest_default';
    const cart = getUserCart(userId, sessionId);
    return sendSuccess(res, cart, 'Cart updated');
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    removeCartItem(Number(id));
    
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'guest_default';
    const cart = getUserCart(userId, sessionId);
    return sendSuccess(res, cart, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
};
