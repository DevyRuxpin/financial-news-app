const request = require('supertest');
const { app } = require('../app');
const { pool } = require('../models/db');

jest.mock('../models/db', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('Health Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return healthy status when database is connected', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });

      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'healthy',
        timestamp: expect.any(String),
        database: 'connected',
        uptime: expect.any(Number)
      });
      expect(pool.query).toHaveBeenCalledWith('SELECT 1');
    });

    it('should return unhealthy status when database is disconnected', async () => {
      const errorMessage = 'Connection refused';
      pool.query.mockRejectedValueOnce(new Error(errorMessage));

      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(503);
      expect(response.body).toEqual({
        status: 'unhealthy',
        timestamp: expect.any(String),
        database: 'disconnected',
        error: errorMessage
      });
      expect(pool.query).toHaveBeenCalledWith('SELECT 1');
    });
  });
}); 