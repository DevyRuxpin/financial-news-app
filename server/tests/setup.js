const path = require('path');
const dotenv = require('dotenv');

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// Verify critical environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Log test environment setup
console.log('Test environment configured with:', {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL
}); 