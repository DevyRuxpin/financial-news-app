const express = require('express');
const { validateRegister, validateLogin, validatePasswordReset } = require('../middleware/validationMiddleware');
const { register, login, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/reset-password', validatePasswordReset, resetPassword);

module.exports = router;
