const express = require('express');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

module.exports = router;
