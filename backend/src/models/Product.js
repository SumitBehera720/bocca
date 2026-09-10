import db from '../config/database.js';

export const Product = {
  findAll: ({ category, brand, search, isTopSaver, isBestSeller, requiresPrescription, limit, offset } = {}) => {
    let sql = `
      SELECT DISTINCT 
        p.id, 
        p.product_name AS productName, 
        p.image, 
        p.pack_size AS packSize,
        p.brand_id AS brandId, 
        p.brand_name AS brand, 
        p.manufacturer,
        p.description,
        p.uses,
        p.how_to_use AS howToUse,
        p.requires_prescription AS requiresPrescription,
        p.price, 
        p.old_price AS oldPrice, 
        p.stock, 
        p.sku, 
        p.expiry_date AS expiryDate,
        p.is_top_saver AS isTopSaver, 
        p.is_best_seller AS isBestSeller, 
        p.created_at AS date
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      sql += ` AND (c.slug = ? OR c.name LIKE ? OR pc.category_id = ?)`;
      params.push(category, `%${category}%`, Number(category) || 0);
    }

    if (brand) {
      sql += ` AND (p.brand_name LIKE ? OR p.brand_id = ?)`;
      params.push(`%${brand}%`, Number(brand) || 0);
    }

    if (search) {
      sql += ` AND (p.product_name LIKE ? OR p.description LIKE ? OR p.brand_name LIKE ? OR p.uses LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (requiresPrescription !== undefined) {
      sql += ` AND p.requires_prescription = ?`;
      params.push(requiresPrescription ? 1 : 0);
    }

    if (isTopSaver !== undefined) {
      sql += ` AND p.is_top_saver = ?`;
      params.push(isTopSaver ? 1 : 0);
    }

    if (isBestSeller !== undefined) {
      sql += ` AND p.is_best_seller = ?`;
      params.push(isBestSeller ? 1 : 0);
    }

    sql += ` ORDER BY p.id ASC`;

    if (limit) {
      sql += ` LIMIT ?`;
      params.push(Number(limit));
      if (offset) {
        sql += ` OFFSET ?`;
        params.push(Number(offset));
      }
    }

    const rows = db.prepare(sql).all(...params);

    // Attach reviews, categories, and tags to each product
    return rows.map((product) => {
      const reviews = db.prepare('SELECT id, user_name AS userName, rating, comment, created_at AS date FROM reviews WHERE product_id = ?').all(product.id);
      const categories = db.prepare(`
        SELECT c.name FROM categories c
        JOIN product_categories pc ON c.id = pc.category_id
        WHERE pc.product_id = ?
      `).all(product.id).map(c => c.name);
      const tags = db.prepare('SELECT tag FROM product_tags WHERE product_id = ?').all(product.id).map(t => t.tag);

      return {
        ...product,
        weight: product.packSize, // backward compatibility
        reviews: reviews || [],
        categories: categories.length ? categories : ['Healthcare'],
        tags: tags.length ? tags : ['Medicine', 'Healthcare']
      };
    });
  },

  findById: (id) => {
    const sql = `
      SELECT 
        p.id, 
        p.product_name AS productName, 
        p.image, 
        p.pack_size AS packSize,
        p.brand_id AS brandId, 
        p.brand_name AS brand, 
        p.manufacturer,
        p.description,
        p.uses,
        p.how_to_use AS howToUse,
        p.requires_prescription AS requiresPrescription,
        p.price, 
        p.old_price AS oldPrice, 
        p.stock, 
        p.sku, 
        p.expiry_date AS expiryDate,
        p.is_top_saver AS isTopSaver, 
        p.is_best_seller AS isBestSeller, 
        p.created_at AS date
      FROM products p
      WHERE p.id = ?
    `;
    const product = db.prepare(sql).get(id);
    if (!product) return null;

    const reviews = db.prepare('SELECT id, user_name AS userName, rating, comment, created_at AS date FROM reviews WHERE product_id = ?').all(product.id);
    const categories = db.prepare(`
      SELECT c.name FROM categories c
      JOIN product_categories pc ON c.id = pc.category_id
      WHERE pc.product_id = ?
    `).all(product.id).map(c => c.name);
    const tags = db.prepare('SELECT tag FROM product_tags WHERE product_id = ?').all(product.id).map(t => t.tag);

    return {
      ...product,
      weight: product.packSize,
      reviews: reviews || [],
      categories: categories.length ? categories : ['Healthcare'],
      tags: tags.length ? tags : ['Medicine', 'Healthcare']
    };
  },

  create: ({ productName, image, packSize = '1 Pack', brandId, brandName, manufacturer, description, uses, howToUse, requiresPrescription = 0, price, oldPrice = 0, stock = 100, sku = '', expiryDate = '2026-12-31' }) => {
    const stmt = db.prepare(`
      INSERT INTO products (product_name, image, pack_size, brand_id, brand_name, manufacturer, description, uses, how_to_use, requires_prescription, price, old_price, stock, sku, expiry_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(productName, image, packSize, brandId || null, brandName || '', manufacturer || '', description || '', uses || '', howToUse || '', requiresPrescription ? 1 : 0, price, oldPrice, stock, sku, expiryDate);
    return Product.findById(info.lastInsertRowid);
  },

  update: (id, updates) => {
    const existing = Product.findById(id);
    if (!existing) return null;

    const stmt = db.prepare(`
      UPDATE products SET
        product_name = COALESCE(?, product_name),
        price = COALESCE(?, price),
        old_price = COALESCE(?, old_price),
        stock = COALESCE(?, stock),
        pack_size = COALESCE(?, pack_size),
        requires_prescription = COALESCE(?, requires_prescription),
        description = COALESCE(?, description),
        uses = COALESCE(?, uses),
        how_to_use = COALESCE(?, how_to_use)
      WHERE id = ?
    `);

    stmt.run(
      updates.productName !== undefined ? updates.productName : null,
      updates.price !== undefined ? updates.price : null,
      updates.oldPrice !== undefined ? updates.oldPrice : null,
      updates.stock !== undefined ? updates.stock : null,
      updates.packSize !== undefined ? updates.packSize : null,
      updates.requiresPrescription !== undefined ? (updates.requiresPrescription ? 1 : 0) : null,
      updates.description !== undefined ? updates.description : null,
      updates.uses !== undefined ? updates.uses : null,
      updates.howToUse !== undefined ? updates.howToUse : null,
      id
    );

    return Product.findById(id);
  },

  delete: (id) => {
    return db.prepare('DELETE FROM products WHERE id = ?').run(id);
  }
};

export default Product;
