import db from '../config/database.js';

export const User = {
  create: ({ username, email, passwordHash, role = 'customer' }) => {
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(username, email, passwordHash, role);
    return { id: info.lastInsertRowid, username, email, role };
  },

  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  },

  getAll: () => {
    const stmt = db.prepare('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    return stmt.all();
  }
};

export default User;
