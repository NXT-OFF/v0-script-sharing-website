import mysql from 'mysql2/promise';

function getDbConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  
  console.log('[v0 DB] DATABASE_URL exists:', !!databaseUrl);
  console.log('[v0 DB] DATABASE_URL value:', databaseUrl ? databaseUrl.replace(/:[^:@]+@/, ':****@') : 'undefined');
  
  if (databaseUrl && databaseUrl.startsWith('mysql://')) {
    const url = new URL(databaseUrl);
    const config = {
      host: url.hostname,
      port: parseInt(url.port || '3306'),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1),
    };
    console.log('[v0 DB] Parsed config - host:', config.host, 'user:', config.user, 'database:', config.database);
    return config;
  }
  
  console.log('[v0 DB] Using fallback config');
  return {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'fivem_hub',
  };
}

const dbConfig = getDbConfig();
console.log('[v0 DB] Final config - host:', dbConfig.host, 'user:', dbConfig.user, 'database:', dbConfig.database);

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T>(sql: string, params?: unknown[]): Promise<T> {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

export async function getConnection() {
  return pool.getConnection();
}

export default pool;
