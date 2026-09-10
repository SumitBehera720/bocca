import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

export const createNewOrder = ({ userId, sessionId, customerName, customerEmail, phone, shippingAddress, totalAmount, paymentMethod, items }) => {
  if (!items || items.length === 0) {
    const error = new Error('Cannot create an order with an empty cart.');
    error.statusCode = 400;
    throw error;
  }

  const order = Order.create({
    userId,
    customerName,
    customerEmail,
    phone,
    shippingAddress,
    totalAmount,
    paymentMethod,
    items
  });

  // Clear cart after successful order
  Cart.clearCart(userId, sessionId);

  return order;
};

export const getOrderById = (orderId) => {
  const order = Order.findById(orderId);
  if (!order) {
    const error = new Error(`Order #${orderId} not found.`);
    error.statusCode = 404;
    throw error;
  }
  return order;
};

export const getUserOrders = (userId) => {
  return Order.findByUserId(userId);
};
