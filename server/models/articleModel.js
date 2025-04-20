const { pool } = require('./db');

const ArticleModel = {
  async saveArticle(userId, articleData) {
    const { rows } = await pool.query(
      'INSERT INTO saved_articles (user_id, title, url, source) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, articleData.title, articleData.url, articleData.source]
    );
    return rows[0];
  },

  async getSavedArticles(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM saved_articles WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  async deleteArticle(userId, articleId) {
    const { rows } = await pool.query(
      'DELETE FROM saved_articles WHERE id = $1 AND user_id = $2 RETURNING *',
      [articleId, userId]
    );
    return rows[0] || null;
  },

  async isArticleSaved(userId, url) {
    const { rows } = await pool.query(
      'SELECT * FROM saved_articles WHERE user_id = $1 AND url = $2',
      [userId, url]
    );
    return rows[0] || null;
  }
};

module.exports = ArticleModel; 