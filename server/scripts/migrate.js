const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read SQL files
const schemaPath = path.join(__dirname, '../database/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    console.log('DATABASE_URL not set, skipping migration');
    process.exit(0);
}

// Create a new pool
const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Starting database migration...');
        
        // Begin transaction
        await client.query('BEGIN');

        // Execute schema
        await client.query(schema);

        // Commit transaction
        await client.query('COMMIT');
        console.log('Migration completed successfully');
    } catch (err) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
}); 