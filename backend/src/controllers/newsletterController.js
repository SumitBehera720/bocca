import Newsletter from '../models/Newsletter.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return sendError(res, 'A valid email address is required.', 400);
    }
    const result = Newsletter.subscribe(email);
    return sendSuccess(res, result, result.isNew ? 'Subscribed to newsletter successfully!' : 'You are already subscribed!');
  } catch (error) {
    next(error);
  }
};
