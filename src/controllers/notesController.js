import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// Отримати список усіх нотаток
export const getAllNotes = async (req, res) => {
  	// Отримуємо параметри пагінації
  const { page = 1, perPage = 10, tag, search } = req.query;

  const skip = (page - 1) * perPage;

  // Створюємо базовий запит до колекції
  const notesQuery = Note.find();

  // Додаємо фільтри за тегом та пошуком
  if (tag) {
    notesQuery.where('tag').equals(tag);
  }
  if (search) {
    notesQuery.where('title', { $text: { $search: search } });
  }

  // Виконуємо одразу два запити паралельно
  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);
	
	// Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
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
  try {
    const { noteId } = req.params;
    const note = await Note.findOneAndDelete({ _id: noteId });

    if (!note) {
      return next(createHttpError(404, "Note not found"));
    }

    res.status(200).json(note); // Повертаємо видалену нотатку
  } catch (error) {
    next(error);
  }
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

  