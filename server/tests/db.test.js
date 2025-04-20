const { Pool } = require('pg');

describe('Database Configuration', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  it('should use test database URL when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = 'test_database_url';
    
    const { pool } = require('../models/db');
    expect(pool.options.connectionString).toBe('test_database_url');
    expect(pool.options.ssl).toBe(false);
  });

  it('should use default test database URL when DATABASE_URL is not set in test environment', () => {
    process.env.NODE_ENV = 'test';
    delete process.env.DATABASE_URL;
    
    const { pool } = require('../models/db');
    expect(pool.options.connectionString).toBe('postgresql://marcharriman@localhost:5432/news_app_test');
    expect(pool.options.ssl).toBe(false);
  });

  it('should use production database URL when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    process.env.DATABASE_URL = 'production_database_url';
    
    const { pool } = require('../models/db');
    expect(pool.options.connectionString).toBe('production_database_url');
    expect(pool.options.ssl).toEqual({ rejectUnauthorized: false });
  });

  it('should use development database URL when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development';
    process.env.DATABASE_URL = 'development_database_url';
    
    const { pool } = require('../models/db');
    expect(pool.options.connectionString).toBe('development_database_url');
    expect(pool.options.ssl).toBe(false);
  });
}); 