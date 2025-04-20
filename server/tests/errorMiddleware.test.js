const errorHandler = require('../middleware/errorMiddleware');

describe('Error Handler Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle ValidationError', () => {
    const error = {
      name: 'ValidationError',
      errors: { field: 'Error message' }
    };

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Validation Error',
      errors: { field: 'Error message' }
    });
  });

  it('should handle UnauthorizedError', () => {
    const error = {
      name: 'UnauthorizedError',
      message: 'Unauthorized access'
    };

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Unauthorized',
      error: 'Unauthorized access'
    });
  });

  it('should handle unique violation error', () => {
    const error = {
      code: '23505',
      detail: 'Key (email)=(test@example.com) already exists.'
    };

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Resource already exists',
      error: 'Key (email)=(test@example.com) already exists.'
    });
  });

  it('should handle foreign key violation error', () => {
    const error = {
      code: '23503',
      detail: 'Key (user_id)=(123) is not present in table "users".'
    };

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Related resource not found',
      error: 'Key (user_id)=(123) is not present in table "users".'
    });
  });

  it('should handle unknown errors in development', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Test error');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      error: 'Test error'
    });
  });

  it('should handle unknown errors in production', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Test error');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      error: 'Something went wrong'
    });
  });
}); 