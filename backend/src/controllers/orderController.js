import { createNewOrder, getOrderById, getUserOrders } from '../services/orderService.js';
import Order from '../models/Order.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || 'guest_default';
    const { customerName, customerEmail, phone, shippingAddress, totalAmount, paymentMethod, items, hasPrescriptionItems, prescriptionId } = req.body;

    if (!customerName || !customerEmail || !shippingAddress || !totalAmount) {
      return sendError(res, 'Name, email, delivery address, and total amount are required.', 400);
    }

    // Prescription validation: if items require Rx, must have prescriptionId attached
    if (hasPrescriptionItems && !prescriptionId) {
      return sendError(res, 'A valid doctor prescription must be uploaded for prescription medicines in your cart.', 400);
    }

    const order = createNewOrder({
      userId,
      sessionId,
      customerName,
      customerEmail,
      phone: phone || '',
      shippingAddress,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'Cash On Delivery',
      hasPrescriptionItems: hasPrescriptionItems ? 1 : 0,
      prescriptionId: prescriptionId || null,
      items: items || []
    });

    return sendSuccess(res, order, 'Medicine order placed successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = getOrderById(Number(id));
    return sendSuccess(res, order, 'Order retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }
    const orders = getUserOrders(req.user.id);
    return sendSuccess(res, orders, 'User orders retrieved');
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return sendError(res, 'Admin access required', 403);
    }
    const orders = Order.findAll();
    return sendSuccess(res, orders, 'All orders retrieved for admin');
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = Order.updateStatus(Number(id), status);
    return sendSuccess(res, updated, `Order status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};
