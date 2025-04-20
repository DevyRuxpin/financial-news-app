const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../models/db');
const UserModel = require('../models/userModel');
const { AuthenticationError } = require('../utils/errors');
const logger = require('../utils/logger');

// Local strategy for email/password auth
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (user.rows.length === 0) return done(null, false);
      
      const isValid = await bcrypt.compare(password, user.rows[0].password_hash);
      if (!isValid) return done(null, false);
      
      return done(null, user.rows[0]);
    } catch (err) {
      return done(err);
    }
  }
));

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new AuthenticationError('No authentication token provided');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Add user to request object
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    logger.error('Authentication error', { error });
    if (error.name === 'JsonWebTokenError') {
      next(new AuthenticationError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new AuthenticationError('Token expired'));
    } else {
      next(error);
    }
  }
};

module.exports = { passport, authMiddleware };
