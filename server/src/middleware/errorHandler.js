// Consistent JSON error handler compliant with TaskFlow specification
// Shape: { "error": { "message": "...", "code": "..." } }

const errorHandler = (err, req, res, next) => {
  // If headers are already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected server error occurred';
  let code = err.code || 'SERVER_ERROR';

  // Handle malformed JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON body';
    code = 'MALFORMED_JSON';
  }

  // Handle Mongoose connection buffering timeout
  if (err.name === 'MongooseError' && err.message.includes('buffering timed out')) {
    statusCode = 503;
    message = 'Database unavailable. Please ensure MongoDB is running or configure MONGODB_URI in server/.env';
    code = 'DATABASE_UNAVAILABLE';
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map(val => val.message);
    message = messages.join('. ');
    code = 'VALIDATION_ERROR';
  }

  // Handle Mongoose bad ObjectId / CastError
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field '${err.path}'`;
    code = 'INVALID_ID';
  }

  // Handle MongoDB duplicate key (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with that ${field} already exists`;
    code = 'DUPLICATE_VALUE';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
    code = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
    code = 'TOKEN_EXPIRED';
  }

  // Ensure 500 errors don't leak internals to client
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    error: {
      message,
      code
    }
  });
};

module.exports = errorHandler;
