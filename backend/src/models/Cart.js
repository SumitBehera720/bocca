import db from '../config/database.js';

export const Cart = {
  getByUserOrSession: (userId, sessionId) => {
    let sql = `
      SELECT 
        c.id AS cartItemId,
        c.user_id AS userId,
        c.session_id AS sessionId,
        c.quantity,
        p.id AS productId,
        p.product_name AS productName,
        p.product_name AS name,
        p.image AS image,
        p.image AS image_url,
        p.price,
        p.old_price AS oldPrice,
        p.old_price AS original_price,
        p.pack_size AS packSize,
        p.pack_size AS weight,
        p.brand_name AS brand,
        p.requires_prescription AS requiresPrescription,
        p.stock AS stock_quantity,
        p.stock
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE 
    `;
    const params = [];
    if (userId) {
      sql += ` c.user_id = ?`;
      params.push(userId);
    } else {
      sql += ` c.session_id = ?`;
      params.push(sessionId);
    }

    return db.prepare(sql).all(...params);
  },

  addItem: ({ userId, sessionId, productId, quantity = 1 }) => {
    let existing;
    if (userId) {
      existing = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(userId, productId);
    } else {
      existing = db.prepare('SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?').get(sessionId, productId);
    }

    if (existing) {
      const newQty = existing.quantity + quantity;
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
      return Cart.getByUserOrSession(userId, sessionId);
    }

    db.prepare(`
      INSERT INTO cart_items (user_id, session_id, product_id, quantity)
      VALUES (?, ?, ?, ?)
    `).run(userId || null, sessionId || null, productId, quantity);

    return Cart.getByUserOrSession(userId, sessionId);
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      db.prepare('DELETE FROM cart_items WHERE id = ?').run(cartItemId);
    } else {
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, cartItemId);
    }
  },

  removeItem: (cartItemId) => {
    return db.prepare('DELETE FROM cart_items WHERE id = ?').run(cartItemId);
  },

  clearCart: (userId, sessionId) => {
    if (userId) {
      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);
    } else {
      db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(sessionId);
    }
  }
};

export default Cart;
