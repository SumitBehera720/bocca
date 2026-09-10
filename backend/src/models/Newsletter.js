import db from '../config/database.js';

export const Newsletter = {
  subscribe: (email) => {
    try {
      const stmt = db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)');
      const info = stmt.run(email);
      return { id: info.lastInsertRowid, email, isNew: true };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.message.includes('UNIQUE')) {
        return { email, isNew: false, message: 'Already subscribed' };
      }
      throw error;
    }
  },

  getAll: () => {
    return db.prepare('SELECT id, email, created_at FROM newsletter_subscribers ORDER BY created_at DESC').all();
  }
};

export default Newsletter;
