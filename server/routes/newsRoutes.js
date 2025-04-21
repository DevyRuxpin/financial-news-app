const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get news with optional filters
router.get('/', authMiddleware, newsController.getNews);

// Save an article
router.post('/save', authMiddleware, newsController.saveArticle);

// Get saved articles
router.get('/saved', authMiddleware, newsController.getSavedArticles);

// Delete a saved article
router.delete('/saved/:articleId', authMiddleware, newsController.deleteSavedArticle);

module.exports = router;
