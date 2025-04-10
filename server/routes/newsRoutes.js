const express = require('express');
const { getNews, saveArticle, getSavedArticles } = require('../controllers/newsController');
const passport = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getNews);
router.post('/save', passport.authenticate('local', { session: false }), saveArticle);
router.get('/saved/:user_id', passport.authenticate('local', { session: false }), getSavedArticles);

module.exports = router;
