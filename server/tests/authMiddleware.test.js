const { passport, authenticate } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const { pool } = require('../models/db');
const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

jest.mock('../models/db');
jest.mock('../models/userModel');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('Authentication Middleware', () => {
  const mockUser = { id: 1, email: 'test@example.com', password_hash: 'hashedPassword' };
  const mockReq = {
    headers: {},
    user: null
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes.status.mockReturnThis();
  });

  describe('Local Strategy', () => {
    const strategy = passport._strategies.local;

    it('should authenticate user with valid credentials', async () => {
      pool.query.mockResolvedValueOnce({ rows: [mockUser] });
      bcrypt.compare.mockResolvedValueOnce(true);

      const done = jest.fn();
      await strategy._verify('test@example.com', 'password', done);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        ['test@example.com']
      );
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(done).toHaveBeenCalledWith(null, mockUser);
    });

    it('should reject non-existent user', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const done = jest.fn();
      await strategy._verify('nonexistent@example.com', 'password', done);

      expect(done).toHaveBeenCalledWith(null, false);
    });

    it('should reject invalid password', async () => {
      pool.query.mockResolvedValueOnce({ rows: [mockUser] });
      bcrypt.compare.mockResolvedValueOnce(false);

      const done = jest.fn();
      await strategy._verify('test@example.com', 'wrongpassword', done);

      expect(done).toHaveBeenCalledWith(null, false);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      pool.query.mockRejectedValueOnce(error);

      const done = jest.fn();
      await strategy._verify('test@example.com', 'password', done);

      expect(done).toHaveBeenCalledWith(error);
    });
  });

  describe('authenticate middleware', () => {
    it('should return 401 if no token is provided', async () => {
      await authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No token provided' });
    });

    it('should return 401 if token format is invalid', async () => {
      mockReq.headers.authorization = 'InvalidFormat token123';

      await authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid token format' });
    });

    it('should return 401 if token is invalid', async () => {
      mockReq.headers.authorization = 'Bearer invalid_token';
      jwt.verify.mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });

      await authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    });

    it('should return 401 if token is expired', async () => {
      mockReq.headers.authorization = 'Bearer expired_token';
      jwt.verify.mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired');
      });

      await authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token expired' });
    });

    it('should return 401 if user not found', async () => {
      mockReq.headers.authorization = 'Bearer valid_token';
      jwt.verify.mockReturnValue({ userId: 1 });
      UserModel.findById.mockResolvedValue(null);

      await authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should authenticate successfully with valid token', async () => {
      mockReq.headers.authorization = 'Bearer valid_token';
      jwt.verify.mockReturnValue({ userId: 1 });
      UserModel.findById.mockResolvedValue(mockUser);

      await authenticate(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBe(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle unexpected errors', async () => {
      mockReq.headers.authorization = 'Bearer valid_token';
      jwt.verify.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
}); 