const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage('Password must contain at least one letter and one number'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateArticle = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),
  body('url')
    .isURL()
    .withMessage('Please enter a valid URL')
    .trim(),
  body('source')
    .notEmpty()
    .withMessage('Source is required')
    .trim(),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateArticle
}; 