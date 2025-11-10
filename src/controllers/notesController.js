import { Note } from '../models/note.js';
import createHttpError from 'http-errors';
/*
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Notes API 🚀',
    availableRoutes: ['/notes', '/notes/:noteId']
  });
});
*/

// Отримати список усіх нотаток
export const getNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

// Отримати одну нотатку за id
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    next(createHttpError(404, "Note not found"));
    return;
  }
  res.status(200).json({ message: "Note deleted successfully" });
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const updatedNote = await Note.findByIdAndUpdate(
    { _id: noteId }, // Шукаємо по id
    req.body,
    { new: true } // Повертаємо оновлений документ
  );

  if (!updatedNote) {
    next(createHttpError(404, "Note not found"));
    return;
  }
  res.status(200).json(updatedNote);
};

  