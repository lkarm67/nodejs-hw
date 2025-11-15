import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import { errors } from 'celebrate';

const app = express();

// ========== SERVER START ==========
const PORT = process.env.PORT ?? 3000;

// ========== STANDARD MIDDLEWARE ==========
app.use(logger);
app.use(cors());
app.use(helmet());
app.use(express.json());

// ========== ROUTES ==========
app.use(notesRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Notes API 🚀',
    availableRoutes: ['/notes', '/notes/:noteId']
  });
});

// ========== 404 HANDLER ==========
app.use(notFoundHandler);

// ========== CELEBRATE ERRORS ==========
app.use(errors());  

// ========== CUSTOM ERROR HANDLER ==========
app.use(errorHandler);

// ========== START SERVER ==========
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
