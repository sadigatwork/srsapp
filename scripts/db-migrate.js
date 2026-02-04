
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set inside .env');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await pool.connect();
    console.log('Connected to database');

    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema migration...');
    await client.query(schemaSql);
    console.log('Schema migration completed successfully');
    
    // Also run seed data if it exists
    const seedPath = path.join(process.cwd(), 'database', 'seed-data.sql');
    if (fs.existsSync(seedPath)) {
        console.log('Running seed data...');
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await client.query(seedSql);
        console.log('Seed data applied successfully');
    }

    client.release();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
