const ArticleModel = require('../models/articleModel');

const saveArticle = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, url, source } = req.body;

    // Check if article is already saved
    const existingArticle = await ArticleModel.isArticleSaved(userId, url);
    if (existingArticle) {
      return res.status(400).json({ message: 'Article already saved' });
    }

    const savedArticle = await ArticleModel.saveArticle(userId, { title, url, source });
    res.status(201).json({ 
      message: 'Article saved successfully',
      articleId: savedArticle.id
    });
  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).json({ message: 'Error saving article' });
  }
};

const getSavedArticles = async (req, res) => {
  try {
    const userId = req.user.id;
    const articles = await ArticleModel.getSavedArticles(userId);
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Error fetching articles' });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const userId = req.user.id;
    const articleId = parseInt(req.params.id);

    if (isNaN(articleId)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }

    const deletedArticle = await ArticleModel.deleteArticle(userId, articleId);
    if (!deletedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Error deleting article' });
  }
};

module.exports = {
  saveArticle,
  getSavedArticles,
  deleteArticle
}; 