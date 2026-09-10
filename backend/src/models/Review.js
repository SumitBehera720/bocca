import db from '../config/database.js';

export const Review = {
  findByProductId: (productId) => {
    const stmt = db.prepare('SELECT id, product_id, user_name AS userName, rating, comment, created_at AS date FROM reviews WHERE product_id = ? ORDER BY created_at DESC');
    return stmt.all(productId);
  },

  create: ({ productId, userName, rating, comment }) => {
    const stmt = db.prepare(`
      INSERT INTO reviews (product_id, user_name, rating, comment)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(productId, userName, rating, comment);
    return { id: info.lastInsertRowid, productId, userName, rating, comment, date: new Date().toISOString() };
  }
};

export default Review;
