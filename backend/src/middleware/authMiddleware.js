import { verifyToken } from '../utils/jwt.js';
import { sendError } from '../utils/responseHandler.js';
import User from '../models/User.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = User.findById(decoded.id);

    if (!user) {
      return sendError(res, 'User not found or account deactivated.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token.', 401);
  }
};

export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      const user = User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore invalid token for optional auth
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return sendError(res, 'Authentication required.', 401);
  }
  if (req.user.role !== 'admin' && req.user.email !== 'admin@farmart.com') {
    return sendError(res, 'Access denied. Admin privileges required.', 403);
  }
  next();
};
