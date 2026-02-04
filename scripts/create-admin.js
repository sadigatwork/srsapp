
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

async function createAdmin() {
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

    const email = 'admin@example.com';
    const password = 'password123';
    const fullName = 'Admin User';
    
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    console.log(`Creating admin user: ${email}`);

    const result = await client.query(
      `INSERT INTO users (id, full_name, email, password_hash, role, is_active, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 'admin', true, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email`,
      [fullName, email, passwordHash]
    );

    if (result.rows.length > 0) {
        console.log('Admin user created successfully');
    } else {
        console.log('Admin user already exists');
    }

    client.release();
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createAdmin();
