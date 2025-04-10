const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { pool } = require('../models/db');

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

module.exports = passport;
