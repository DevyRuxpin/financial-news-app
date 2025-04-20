const request = require('supertest');
const { app } = require('../app');
const ArticleModel = require('../models/articleModel');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

jest.mock('../models/articleModel');
jest.mock('../models/userModel');
jest.mock('jsonwebtoken');

describe('Article Controller', () => {
  const mockToken = 'mockToken';
  const mockUserId = 1;
  const mockUser = { id: mockUserId, email: 'test@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    jwt.verify.mockReturnValue({ userId: mockUserId });
    UserModel.findById.mockResolvedValue(mockUser);
  });

  describe('POST /articles', () => {
    it('should save an article successfully', async () => {
      const mockArticle = {
        id: 1,
        title: 'Test Article',
        url: 'https://example.com',
        source: 'Test Source',
        user_id: mockUserId
      };
      ArticleModel.isArticleSaved.mockResolvedValue(null);
      ArticleModel.saveArticle.mockResolvedValue(mockArticle);

      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          title: 'Test Article',
          url: 'https://example.com',
          source: 'Test Source'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Article saved successfully',
        articleId: mockArticle.id
      });
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .post('/api/articles')
        .send({
          title: 'Test Article',
          url: 'https://example.com',
          source: 'Test Source'
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'No token provided' });
    });

    it('should handle server errors', async () => {
      ArticleModel.saveArticle.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          title: 'Test Article',
          url: 'https://example.com',
          source: 'Test Source'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error saving article' });
    });
  });

  describe('GET /articles', () => {
    it('should get saved articles successfully', async () => {
      const mockArticles = [
        {
          id: 1,
          title: 'Test Article 1',
          url: 'https://example.com/1',
          source: 'Test Source 1',
          user_id: mockUserId
        },
        {
          id: 2,
          title: 'Test Article 2',
          url: 'https://example.com/2',
          source: 'Test Source 2',
          user_id: mockUserId
        }
      ];
      ArticleModel.getSavedArticles.mockResolvedValue(mockArticles);

      const response = await request(app)
        .get('/api/articles')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArticles);
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .get('/api/articles');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'No token provided' });
    });

    it('should handle server errors', async () => {
      ArticleModel.getSavedArticles.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/articles')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error fetching articles' });
    });
  });

  describe('DELETE /articles/:id', () => {
    it('should delete an article successfully', async () => {
      ArticleModel.deleteArticle.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/articles/1')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Article deleted successfully' });
    });

    it('should return 400 if article ID is invalid', async () => {
      const response = await request(app)
        .delete('/api/articles/invalid-id')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid article ID' });
    });

    it('should return 404 if article not found', async () => {
      ArticleModel.deleteArticle.mockResolvedValue(false);

      const response = await request(app)
        .delete('/api/articles/999')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Article not found' });
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .delete('/api/articles/1');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'No token provided' });
    });

    it('should handle server errors', async () => {
      ArticleModel.deleteArticle.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/articles/1')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error deleting article' });
    });
  });
}); 