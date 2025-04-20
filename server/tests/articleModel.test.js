const { pool } = require('../models/db');
const ArticleModel = require('../models/articleModel');

jest.mock('../models/db', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('ArticleModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveArticle', () => {
    it('should save an article successfully', async () => {
      const mockArticle = {
        id: 1,
        user_id: 1,
        title: 'Test Article',
        description: 'Test Description',
        url: 'https://example.com',
        image_url: 'https://example.com/image.jpg',
        source: 'Test Source',
        published_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      };

      pool.query.mockResolvedValueOnce({ rows: [mockArticle] });

      const result = await ArticleModel.saveArticle(1, {
        title: 'Test Article',
        description: 'Test Description',
        url: 'https://example.com',
        imageUrl: 'https://example.com/image.jpg',
        source: 'Test Source',
        publishedAt: new Date()
      });

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO saved_articles'),
        expect.any(Array)
      );
      expect(result).toEqual(mockArticle);
    });
  });

  describe('getSavedArticles', () => {
    it('should retrieve saved articles for a user', async () => {
      const mockArticles = [
        {
          id: 1,
          user_id: 1,
          title: 'Test Article 1',
          url: 'https://example.com/1'
        },
        {
          id: 2,
          user_id: 1,
          title: 'Test Article 2',
          url: 'https://example.com/2'
        }
      ];

      pool.query.mockResolvedValueOnce({ rows: mockArticles });

      const result = await ArticleModel.getSavedArticles(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM saved_articles'),
        [1]
      );
      expect(result).toEqual(mockArticles);
    });
  });

  describe('deleteArticle', () => {
    it('should delete an article successfully', async () => {
      const mockArticle = {
        id: 1,
        user_id: 1,
        title: 'Test Article'
      };

      pool.query.mockResolvedValueOnce({ rows: [mockArticle] });

      const result = await ArticleModel.deleteArticle(1, 1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM saved_articles'),
        [1, 1]
      );
      expect(result).toEqual(mockArticle);
    });

    it('should return null if article not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await ArticleModel.deleteArticle(1, 999);

      expect(result).toBeNull();
    });
  });

  describe('isArticleSaved', () => {
    it('should return article if already saved', async () => {
      const mockArticle = {
        id: 1,
        user_id: 1,
        url: 'https://example.com'
      };

      pool.query.mockResolvedValueOnce({ rows: [mockArticle] });

      const result = await ArticleModel.isArticleSaved(1, 'https://example.com');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM saved_articles'),
        [1, 'https://example.com']
      );
      expect(result).toEqual(mockArticle);
    });

    it('should return null if article not saved', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await ArticleModel.isArticleSaved(1, 'https://example.com');

      expect(result).toBeNull();
    });
  });
}); 