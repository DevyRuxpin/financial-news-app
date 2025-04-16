const express = require('express');
const { getNews, saveArticle, getSavedArticles, deleteSavedArticle } = require('../controllers/newsController');
const { jwtStrategy } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getNews);

// Protected routes
router.post('/save', jwtStrategy, saveArticle);
router.get('/saved/:user_id', jwtStrategy, getSavedArticles);
router.delete('/saved/:article_id', jwtStrategy, deleteSavedArticle);

module.exports = router;
