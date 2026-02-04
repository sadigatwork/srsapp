import { Pool, PoolClient } from "pg"

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Export the pool for direct access
export const db = pool

// Helper function for executing raw SQL queries
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T> {
  const client = await pool.connect()
  try {
    const result = await client.query(query, params)
    return result.rows as T
  } catch (error) {
    console.error("Database query error:", error)
    console.error("Query:", query)
    console.error("Params:", params)
    throw error
  } finally {
    client.release()
  }
}

// Helper function for single row query
export async function executeQuerySingle<T = any>(query: string, params: any[] = []): Promise<T | null> {
  const result = await executeQuery<T[]>(query, params)
  return result.length > 0 ? result[0] : null
}

// Helper function for transactions
export async function transaction<T = any>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Transaction error:", error)
    throw error
  } finally {
    client.release()
  }
}

// Health check function
export async function checkConnection(): Promise<boolean> {
  try {
    const client = await pool.connect()
    await client.query("SELECT 1")
    client.release()
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}

// Graceful shutdown
export async function closePool(): Promise<void> {
  await pool.end()
}
