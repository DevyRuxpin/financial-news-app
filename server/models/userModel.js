const databaseService = require('../services/databaseService');
const { ValidationError, DatabaseError } = require('../utils/errors');
const logger = require('../utils/logger');

class UserModel {
  static async validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }
  }

  static async validatePassword(password) {
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }
  }

  static async findByEmail(email) {
    try {
      await this.validateEmail(email);
      const { rows } = await databaseService.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by email', { email, error });
      throw error;
    }
  }

  static async createUser(email, password) {
    try {
      await this.validateEmail(email);
      await this.validatePassword(password);

      const { rows } = await databaseService.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, password]
      );
      return rows[0];
    } catch (error) {
      logger.error('Error creating user', { email, error });
      if (error.message === 'Duplicate entry') {
        throw new ValidationError('Email already exists');
      }
      throw new DatabaseError('Error creating user');
    }
  }

  static async findById(id) {
    try {
      if (!id) {
        throw new ValidationError('User ID is required');
      }
      const { rows } = await databaseService.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by ID', { id, error });
      throw error;
    }
  }

  static async updateUser(id, updates) {
    try {
      if (!id) {
        throw new ValidationError('User ID is required');
      }

      const validUpdates = {};
      if (updates.email) {
        await this.validateEmail(updates.email);
        validUpdates.email = updates.email;
      }
      if (updates.password) {
        await this.validatePassword(updates.password);
        validUpdates.password_hash = updates.password;
      }

      const setClause = Object.keys(validUpdates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');

      const { rows } = await databaseService.query(
        `UPDATE users SET ${setClause} WHERE id = $1 RETURNING id, email`,
        [id, ...Object.values(validUpdates)]
      );

      return rows[0] || null;
    } catch (error) {
      logger.error('Error updating user', { id, updates, error });
      throw error;
    }
  }
}

module.exports = UserModel; 
