import { initDatabase } from '../src/config/database.js';

console.log('Initializing Farmart SQL Database...');
initDatabase();
console.log('Database initialization complete.');
process.exit(0);
