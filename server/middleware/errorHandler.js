// petpal-mvp/server/middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Server Error:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    statusCode = 400;
    message = "Invalid input data";
  }

  // Handle Mongoose CastError for invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID format";
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate resource detected";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
