const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred', {
    error: err,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired'
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }

  // Handle authentication errors
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      status: 'fail',
      message: err.message
    });
  }

  // Handle database errors
  if (err.name === 'DatabaseError') {
    return res.status(500).json({
      status: 'error',
      message: 'Database error occurred'
    });
  }

  // Handle not found errors
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }

  // Handle other operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
};

module.exports = errorHandler; 