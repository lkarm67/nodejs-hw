import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ========== SERVER START ==========
const PORT = process.env.PORT ?? 3000;

// ========== STANDARD MIDDLEWARE ==========
app.use(logger);
app.use(cors()); // дозволяє запити з інших доменів
app.use(helmet()); // захищає HTTP заголовки
app.use(express.json()); // дозволяє приймати JSON у body

      

// ========== ROUTES ==========

// Отримати всі нотатки
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

// Отримати нотатку за ID
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

// Тестовий маршрут для перевірки помилки
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Notes API 🚀',
    availableRoutes: ['/notes', '/notes/:noteId', '/test-error']
  });
});


// ========== 404 HANDLER (неіснуючі маршрути) ==========
app.use(notFoundHandler);

// ========== ERROR HANDLER ==========
app.use(errorHandler);

// ========== START SERVER & CONNECT TO DB ==========
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
