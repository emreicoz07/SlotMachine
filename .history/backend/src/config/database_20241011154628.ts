import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Veritabanı bağlantısını .env'den al
  ssl: {
    rejectUnauthorized: false, // Render platformunda SSL kullanımı için gerekli
  },            
});

export default pool;
