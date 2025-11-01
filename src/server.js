import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';

// Завантаження змінних з .env
dotenv.config();

const app = express();

// ========== STANDARD MIDDLEWARE ==========
app.use(cors()); // дозволяє запити з інших доменів
app.use(express.json()); // дозволяє приймати JSON у body
app.use(pino()); // логування запитів

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

// ========== 404 HANDLER (неіснуючі маршрути) ==========
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: err.message });
});

// ========== SERVER START ==========
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Сервер запущено на порті ${PORT}`);
});
