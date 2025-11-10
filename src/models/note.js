import { Schema, model } from 'mongoose';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // прибирає пробіли на початку та в кінці
    },
    content: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      required: false,
      tags: ['Work', 'Personal', 'Meeting', 'Shopping', 'Ideas', 'Travel', 'Finance', 'Health', 'Important', 'Todo'],
      default: ['Todo'],
    },
  },
  {
    timestamps: true,
  },
);

export const Note = model('Note', noteSchema);