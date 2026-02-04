-- Migration script: Move from Supabase to Local PostgreSQL
-- This script ensures the schema is ready for local PostgreSQL authentication

-- First, add role column directly to users table for simpler auth
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Delete existing demo users if they exist
DELETE FROM users WHERE email IN (
  'sysadmin@demo.com',
  'admin@demo.com',
  'registrar@demo.com',
  'reviewer@demo.com',
  'user@demo.com'
);

-- Insert demo users with hashed passwords
-- Using the existing columns: id, name, email, password, phone, avatar, role_id, created_at, updated_at
-- Password hash for "demo123" using bcrypt
INSERT INTO users (id, name, email, password, role, is_active, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'مدير النظام', 'sysadmin@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4Dg.pHk0xQCpFPHW', 'system-admin', true, NOW(), NOW()),
  (gen_random_uuid(), 'المدير العام', 'admin@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4Dg.pHk0xQCpFPHW', 'admin', true, NOW(), NOW()),
  (gen_random_uuid(), 'مسؤول التسجيل', 'registrar@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4Dg.pHk0xQCpFPHW', 'registrar', true, NOW(), NOW()),
  (gen_random_uuid(), 'المراجع', 'reviewer@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4Dg.pHk0xQCpFPHW', 'reviewer', true, NOW(), NOW()),
  (gen_random_uuid(), 'مستخدم تجريبي', 'user@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4Dg.pHk0xQCpFPHW', 'user', true, NOW(), NOW());

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Display confirmation
SELECT 'Migration completed successfully!' as status;
SELECT id, name, email, role FROM users WHERE email LIKE '%@demo.com';
