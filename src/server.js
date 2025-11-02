import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import helmet from 'helmet';

const app = express();

// ========== SERVER START ==========
const PORT = process.env.PORT ?? 3000;

// ========== STANDARD MIDDLEWARE ==========
app.use(cors()); // дозволяє запити з інших доменів
app.use(helmet());// захищає HTTP заголовки
app.use(express.json()); // дозволяє приймати JSON у body
app.use(pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  })); // логування запитів

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
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    message: isProd ? 'Something went wrong, please try again later.'
      : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
