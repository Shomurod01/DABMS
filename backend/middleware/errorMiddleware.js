// a simple error class so we can throw errors with a status code attached
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// wraps async route handlers so we don't need try/catch everywhere
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// sits at the bottom of the middleware stack and handles any error that bubbles up
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // someone passed an invalid MongoDB ID
  if (err.name === 'CastError') {
    error = new AppError('Could not find what you were looking for', 404);
  }

  // trying to save something that already exists (like a duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`That ${field} is already taken`, 400);
  }

  // mongoose validation failed (missing required fields etc.)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // token is malformed
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid login token', 401);
  }

  // token is fine but has expired
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your session has expired, please log in again', 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { AppError, asyncHandler, errorHandler };
