import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH 
  ? path.resolve(__dirname, '../../', process.env.DB_PATH)
  : path.resolve(__dirname, '../../database/farmart.sqlite');

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let rawDb = null;
const SQL = await initSqlJs();

if (fs.existsSync(dbPath)) {
  const fileBuffer = fs.readFileSync(dbPath);
  rawDb = new SQL.Database(fileBuffer);
} else {
  rawDb = new SQL.Database();
}

const saveToFile = () => {
  try {
    const data = rawDb.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (err) {
    console.error('Error saving database to disk:', err);
  }
};

// Database wrapper matching standard SQL query interfaces
export const db = {
  raw: rawDb,
  
  exec: (sql) => {
    const res = rawDb.exec(sql);
    saveToFile();
    return res;
  },

  prepare: (sql) => {
    return {
      all: (...params) => {
        const stmt = rawDb.prepare(sql);
        if (params.length > 0) {
          stmt.bind(params);
        }
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        return rows;
      },

      get: (...params) => {
        const stmt = rawDb.prepare(sql);
        if (params.length > 0) {
          stmt.bind(params);
        }
        let row = null;
        if (stmt.step()) {
          row = stmt.getAsObject();
        }
        stmt.free();
        return row;
      },

      run: (...params) => {
        const stmt = rawDb.prepare(sql);
        if (params.length > 0) {
          stmt.bind(params);
        }
        stmt.step();
        stmt.free();
        
        // Get last insert rowid
        const lastIdStmt = rawDb.prepare('SELECT last_insert_rowid() AS id');
        lastIdStmt.step();
        const lastId = lastIdStmt.getAsObject().id;
        lastIdStmt.free();

        saveToFile();
        return { lastInsertRowid: lastId };
      }
    };
  },

  transaction: (fn) => {
    return (...args) => {
      rawDb.exec('BEGIN TRANSACTION;');
      try {
        const result = fn(...args);
        rawDb.exec('COMMIT;');
        saveToFile();
        return result;
      } catch (err) {
        rawDb.exec('ROLLBACK;');
        throw err;
      }
    };
  }
};

export const initDatabase = () => {
  try {
    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    const seedPath = path.resolve(__dirname, '../../database/seed.sql');

    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      rawDb.exec(schemaSql);
      saveToFile();
      console.log('✅ Pharmacy Database schema initialized successfully');
    }

    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      rawDb.exec(seedSql);
      saveToFile();
      console.log('✅ Pharmacy Database seeded with medicines & medical catalog successfully');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

export default db;
