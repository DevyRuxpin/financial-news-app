const { afterAll } = require('@jest/globals');

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Mock console.error to keep test output clean
console.error = jest.fn();

// Increase timeout for all tests
jest.setTimeout(10000);

// Clean up after tests
afterAll(async () => {
  // Add any cleanup code here
  // For example, close database connections
});

// Mock any global dependencies here if needed 