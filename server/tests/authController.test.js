const request = require('supertest');
const { app } = require('../app');
const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/userModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      UserModel.findByEmail.mockResolvedValue(null);
      UserModel.createUser.mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      jwt.sign.mockReturnValue('mockToken');

      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'Password123' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'User registered successfully',
        token: 'mockToken',
        user: { id: 1, email: 'test@example.com' }
      });
    });

    it('should return 400 if user already exists', async () => {
      UserModel.findByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'Password123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'User already exists' });
    });

    it('should handle server errors', async () => {
      UserModel.findByEmail.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'Password123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error registering user' });
    });
  });

  describe('POST /login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword'
      };
      UserModel.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'Password123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Login successful',
        token: 'mockToken',
        user: { id: 1, email: 'test@example.com' }
      });
    });

    it('should return 401 for invalid credentials', async () => {
      UserModel.findByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid credentials' });
    });

    it('should return 401 for incorrect password', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword'
      };
      UserModel.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid credentials' });
    });

    it('should handle server errors', async () => {
      UserModel.findByEmail.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'Password123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error logging in' });
    });
  });
}); 