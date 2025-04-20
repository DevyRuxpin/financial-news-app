const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { ValidationError, AuthenticationError } = require('../utils/errors');
const logger = require('../utils/logger');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Create user
    const user = await UserModel.createUser(email, password);

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    logger.error('Registration error', { error });
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    logger.error('Login error', { error });
    next(error);
  }
};

const logout = async (req, res) => {
  try {
    // In a real application, you might want to invalidate the token
    // or add it to a blacklist. For now, we'll just return success.
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Logout error', { error });
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    res.status(200).json({
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    logger.error('Get current user error', { error });
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Update password
    const updatedUser = await UserModel.updateUser(user.id, { password: newPassword });

    res.status(200).json({
      message: 'Password reset successful',
      user: { id: updatedUser.id, email: updatedUser.email }
    });
  } catch (error) {
    logger.error('Password reset error', { error });
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  resetPassword
};
