import db from '../config/database.js';

export const Brand = {
  findAll: () => {
    const stmt = db.prepare('SELECT id, brand_name AS brandName, title, image, link FROM brands ORDER BY id ASC');
    return stmt.all();
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT id, brand_name AS brandName, title, image, link FROM brands WHERE id = ?');
    return stmt.get(id);
  }
};

export default Brand;
