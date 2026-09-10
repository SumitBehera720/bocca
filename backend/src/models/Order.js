import db from '../config/database.js';

export const Order = {
  create: ({ userId, customerName, customerEmail, phone, shippingAddress, totalAmount, paymentMethod = 'Cash On Delivery', hasPrescriptionItems = 0, prescriptionId = null, items = [] }) => {
    const prescriptionStatus = hasPrescriptionItems ? 'Pending Verification' : 'N/A';
    const orderStatus = hasPrescriptionItems ? 'Pending Verification' : 'Confirmed';

    const insertOrder = db.prepare(`
      INSERT INTO orders (user_id, customer_name, customer_email, phone, shipping_address, total_amount, payment_method, has_prescription_items, prescription_id, prescription_status, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, price, quantity, requires_prescription)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      const orderResult = insertOrder.run(
        userId || null,
        customerName,
        customerEmail,
        phone,
        shippingAddress,
        totalAmount,
        paymentMethod,
        hasPrescriptionItems ? 1 : 0,
        prescriptionId || null,
        prescriptionStatus,
        orderStatus
      );
      const orderId = orderResult.lastInsertRowid;

      for (const item of items) {
        insertItem.run(
          orderId,
          item.productId,
          item.productName,
          item.price,
          item.quantity,
          item.requiresPrescription ? 1 : 0
        );
      }

      // If prescription was uploaded with order, link order_id to prescription
      if (prescriptionId) {
        db.prepare('UPDATE prescriptions SET order_id = ? WHERE id = ?').run(orderId, prescriptionId);
      }

      return orderId;
    });

    const orderId = transaction();
    return Order.findById(orderId);
  },

  findById: (orderId) => {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    if (!order) return null;
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
    let prescription = null;
    if (order.prescription_id) {
      prescription = db.prepare('SELECT * FROM prescriptions WHERE id = ?').get(order.prescription_id);
    }
    return { ...order, items, prescription };
  },

  findAll: () => {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    return orders.map(order => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return { ...order, items };
    });
  },

  findByUserId: (userId) => {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    return orders.map(order => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return { ...order, items };
    });
  },

  updateStatus: (orderId, status) => {
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);
    return Order.findById(orderId);
  }
};

export default Order;
