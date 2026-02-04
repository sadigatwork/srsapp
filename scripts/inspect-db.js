
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

async function inspect() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    console.log('Columns in users table:');
    console.table(result.rows);
    client.release();
  } catch (error) {
    console.error('Inspection failed:', error);
  } finally {
    await pool.end();
  }
}

inspect();
