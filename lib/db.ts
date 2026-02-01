import mysql from 'mysql2/promise';

// Parse DATABASE_URL if provided
function getDbConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    // Parse mysql://user:password@host:port/database
    const url = new URL(databaseUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port || '3306'),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading /
    };
  }
  
  // Fallback to individual env vars
  return {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'fivem_hub',
  };
}

const dbConfig = getDbConfig();

// Database connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T>(sql: string, params?: unknown[]): Promise<T> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error) {
    console.error('[DB Error]', error);
    throw error;
  }
}

export async function getConnection() {
  return pool.getConnection();
}

export default pool;
