const request = require('supertest');
const { app } = require('../app');
const { pool } = require('../models/db');

describe('Integration Tests', () => {
  let authToken;
  let testArticleId;

  beforeAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM saved_articles');
    await pool.query('DELETE FROM users');
  });

  afterAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM saved_articles');
    await pool.query('DELETE FROM users');
    await pool.end();
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.database).toBe('connected');
    });
  });

  describe('Authentication Flow', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    });

    it('should not register with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      authToken = response.body.token;
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('Article Management', () => {
    it('should save an article', async () => {
      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Article',
          url: 'https://example.com/test-article',
          source: 'Test Source'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Article saved successfully');
      testArticleId = response.body.articleId;
    });

    it('should not save duplicate article', async () => {
      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Article',
          url: 'https://example.com/test-article',
          source: 'Test Source'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Article already saved');
    });

    it('should get saved articles', async () => {
      const response = await request(app)
        .get('/api/articles')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Test Article');
    });

    it('should delete an article', async () => {
      const response = await request(app)
        .delete(`/api/articles/${testArticleId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Article deleted successfully');
    });

    it('should not find deleted article', async () => {
      const response = await request(app)
        .get('/api/articles')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid routes', async () => {
      const response = await request(app)
        .get('/api/invalid-route');

      expect(response.status).toBe(404);
    });

    it('should handle unauthorized access', async () => {
      const response = await request(app)
        .get('/api/articles');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token provided');
    });

    it('should handle invalid token', async () => {
      const response = await request(app)
        .get('/api/articles')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token');
    });
  });
}); 