import db from '../config/database.js';

export const Category = {
  findAll: () => {
    const stmt = db.prepare('SELECT id, name AS title, slug, image, "" AS link FROM categories ORDER BY id ASC');
    const rows = stmt.all();
    return rows.map(r => ({
      ...r,
      link: `/shop?category=${r.slug}`
    }));
  },

  findBySlug: (slug) => {
    const stmt = db.prepare('SELECT id, name, slug, image FROM categories WHERE slug = ?');
    return stmt.get(slug);
  }
};

export default Category;
