import db from '../config/database.js';

export const Wishlist = {
  getByUserOrSession: (userId, sessionId) => {
    let sql = `
      SELECT 
        w.id AS wishlistId,
        w.user_id AS userId,
        w.session_id AS sessionId,
        p.id AS productId,
        p.id AS id,
        p.product_name AS productName,
        p.product_name AS name,
        p.image AS image,
        p.image AS image_url,
        p.price,
        p.old_price AS oldPrice,
        p.old_price AS original_price,
        p.pack_size AS weight,
        p.pack_size AS packSize,
        p.brand_name AS brand,
        p.stock AS stock_quantity,
        p.stock,
        p.requires_prescription AS requiresPrescription
      FROM wishlist_items w
      JOIN products p ON w.product_id = p.id
      WHERE 
    `;
    const params = [];
    if (userId) {
      sql += ` w.user_id = ?`;
      params.push(userId);
    } else {
      sql += ` w.session_id = ?`;
      params.push(sessionId);
    }

    return db.prepare(sql).all(...params);
  },

  toggleItem: ({ userId, sessionId, productId }) => {
    let existing;
    if (userId) {
      existing = db.prepare('SELECT * FROM wishlist_items WHERE user_id = ? AND product_id = ?').get(userId, productId);
    } else {
      existing = db.prepare('SELECT * FROM wishlist_items WHERE session_id = ? AND product_id = ?').get(sessionId, productId);
    }

    if (existing) {
      db.prepare('DELETE FROM wishlist_items WHERE id = ?').run(existing.id);
      return { added: false, wishlist: Wishlist.getByUserOrSession(userId, sessionId) };
    } else {
      db.prepare(`
        INSERT INTO wishlist_items (user_id, session_id, product_id)
        VALUES (?, ?, ?)
      `).run(userId || null, sessionId || null, productId);
      return { added: true, wishlist: Wishlist.getByUserOrSession(userId, sessionId) };
    }
  },

  removeItem: (wishlistId) => {
    return db.prepare('DELETE FROM wishlist_items WHERE id = ?').run(wishlistId);
  }
};

export default Wishlist;
