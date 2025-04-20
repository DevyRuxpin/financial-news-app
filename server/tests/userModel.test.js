const { pool } = require('../models/db');
const UserModel = require('../models/userModel');

jest.mock('../models/db', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('UserModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await UserModel.findByEmail('test@example.com');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        ['test@example.com']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await UserModel.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser = {
        id: 1,
        email: 'new@example.com'
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await UserModel.createUser('new@example.com', 'hashedPassword');

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
        ['new@example.com', 'hashedPassword']
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await UserModel.findById(1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = $1',
        [1]
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await UserModel.findById(999);

      expect(result).toBeNull();
    });
  });
}); 