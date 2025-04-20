const express = require('express');
const { validateArticle } = require('../middleware/validationMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');
const { saveArticle, getSavedArticles, deleteArticle } = require('../controllers/articleController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', validateArticle, saveArticle);
router.get('/', getSavedArticles);
router.delete('/:id', deleteArticle);

module.exports = router; 