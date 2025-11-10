import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

const app = express();

// ========== SERVER START ==========
const PORT = process.env.PORT ?? 3000;

// ========== STANDARD MIDDLEWARE ==========
app.use(logger); // 1. Логер першим — бачить усі запити
app.use(cors()); // дозволяє запити з інших доменів
app.use(helmet()); // захищає HTTP заголовки
app.use(express.json()); // дозволяє приймати JSON у body
app.use(notesRoutes); // Підключаємо маршрути нотаток

      

// ========== ROUTES ==========


app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Notes API 🚀',
    availableRoutes: ['/notes', '/notes/:noteId']
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
