const bcrypt = require('bcrypt');
const { pool } = require('../models/db');
const passport = require('../middleware/authMiddleware');

const register = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
};

const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ error: 'Login failed' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Logged in successfully', user });
    });
  })(req, res, next);
};

module.exports = { register, login };
