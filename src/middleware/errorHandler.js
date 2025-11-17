import { isCelebrateError } from "celebrate";
import { HttpError } from "http-errors";

export const errorHandler = (err, req, res, next) => {
  console.error("Error Middleware:", err);

  // 1. Перевірка помилок celebrate
  if (isCelebrateError(err)) {
    const segment = ["body", "query", "params", "headers"]
      .map(k => err.details.get(k))
      .find(v => v);

    return res.status(400).json({
      message: segment.message,       // основне повідомлення про помилку
      details: segment.details,       // масив Joi-помилок
    });
  }

  // 2. http-errors
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message || err.name,
    });
  }

  // 3. Інші помилки
  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: isProd
      ? "Something went wrong. Please try again later."
      : err.message,
  });
};
