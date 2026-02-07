import { executeQuery } from "./db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

// Helper for single row queries
async function executeQuerySingle<T>(
  query: string,
  params: (string | number | boolean | Date | null)[] = [],
): Promise<T | null> {
  const result = await executeQuery<T[]>(query, params);
  return result.length > 0 ? result[0] : null;
}

// Types
export type UserRole =
  | "user"
  | "reviewer"
  | "admin"
  | "registrar"
  | "system-admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  user: User;
  expires: Date;
}

// JWT Secret
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
);

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Create JWT token
export async function createToken(
  user: Pick<User, "id" | "role">,
): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
  return token;
}

// Verify JWT token
export async function verifyToken(
  token: string,
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

// Sign up user
export async function signUp(
  email: string,
  password: string,
  name: string,
  role: UserRole = "user",
): Promise<{ user: User | null; error: string | null }> {
  try {
    // Check if user exists
    const existingUser = await executeQuerySingle<User>(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (existingUser) {
      return { user: null, error: "البريد الإلكتروني مسجل مسبقاً" };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user - using column names from the actual schema
    // Create user - using column names from the actual schema
    const result = await executeQuery<User[]>(
      `INSERT INTO users (id, full_name, email, password_hash, role, is_active, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW(), NOW())
       RETURNING id, full_name, email, role, phone, NULL as avatar_url, is_active, created_at, updated_at`,
      [name, email, hashedPassword, role],
    );

    return { user: result[0], error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Sign up error:", error);
    return { user: null, error: message };
  }
}

// Sign in user
export async function signIn(
  email: string,
  password: string,
): Promise<{ user: User | null; token: string | null; error: string | null }> {
  try {
    // Get user with password - using column names from the actual schema
    const user = await executeQuerySingle<User & { password: string }>(
      "SELECT id, full_name, email, password_hash as password, role, phone, NULL as avatar_url, is_active, created_at, updated_at FROM users WHERE email = $1 AND (is_active = true OR is_active IS NULL)",
      [email],
    );

    console.log(await bcrypt.compare(password, user.password));
    console.log(await bcrypt.hash("demo123", 12));
    if (!user) {
      return {
        user: null,
        token: null,
        error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return {
        user: null,
        token: null,
        error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      };
    }

    // Create token
    const token = await createToken(user.id);

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword as User, token, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Sign in error:", error);
    return { user: null, token: null, error: message };
  }
}

// Get current user from token
export async function getCurrentUser(token: string): Promise<User | null> {
  try {
    const payload = await verifyToken(token);
    if (!payload) return null;

    const user = await executeQuerySingle<User>(
      `SELECT id, full_name, email, role, phone, NULL as avatar_url, is_active, created_at, updated_at
       FROM users WHERE id = $1 AND (is_active = true OR is_active IS NULL)`,
      [payload.userId],
    );

    return user;
  } catch {
    return null;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  data: Partial<Pick<User, "full_name" | "phone" | "avatar_url">>,
): Promise<{ user: User | null; error: string | null }> {
  try {
    const fields: string[] = [];
    const values: (string | number | boolean | Date | null)[] = [];
    let paramIndex = 1;

    if (data.full_name !== undefined) {
      fields.push(`full_name = $${paramIndex++}`);
      values.push(data.full_name);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramIndex++}`);
      values.push(data.phone);
    }
    if (data.avatar_url !== undefined) {
      // Avatar column doesn't exist yet, we'll skip for now
      // fields.push(`avatar_url = $${paramIndex++}`)
      // values.push(data.avatar_url)
    }

    if (fields.length === 0) {
      return { user: null, error: "No fields to update" };
    }

    fields.push(`updated_at = NOW()`);
    values.push(userId);

    const result = await executeQuery<User[]>(
      `UPDATE users SET ${fields.join(", ")}
       WHERE id = $${paramIndex}  
       RETURNING id, full_name, email, role, phone, NULL as avatar_url, is_active, created_at, updated_at`,
      values,
    );

    return { user: result[0] || null, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Update profile error:", error);
    return { user: null, error: message };
  }
}

// Change password
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await executeQuerySingle<{ password: string }>(
      "SELECT password_hash as password FROM users WHERE id = $1",
      [userId],
    );

    if (!user) {
      return { success: false, error: "المستخدم غير موجود" };
    }

    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "كلمة المرور الحالية غير صحيحة" };
    }

    const hashedPassword = await hashPassword(newPassword);
    await executeQuery(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [hashedPassword, userId],
    );

    return { success: true, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Change password error:", error);
    return { success: false, error: message };
  }
}

// Server-side: Get session from cookies
export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    const user = await getCurrentUser(token);
    if (!user) return null;

    return {
      user,
      expires: new Date(Date.now() + SESSION_DURATION),
    };
  } catch {
    return null;
  }
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000, // in seconds
    path: "/",
  });
}

// Clear auth cookie
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}
