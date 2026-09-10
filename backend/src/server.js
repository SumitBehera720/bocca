import app from './app.js';
import { initDatabase } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize Database (Schema & Seeds)
initDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Farmart Backend API server running on http://localhost:${PORT}`);
  console.log(`🩺 Health check available at http://localhost:${PORT}/api/health`);
});
