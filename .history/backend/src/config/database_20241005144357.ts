import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',         // PostgreSQL'de kullandığın kullanıcı adı
  host: 'localhost',        // Veritabanı sunucusunun adresi
  database: 'gaming_db',      // Oluşturduğun veritabanının adı
  password: 'k4rn4v4l', // PostgreSQL'e giriş yapmak için belirlediğin şifre
  port: 5432,               // PostgreSQL'in varsayılan portu
});

export default pool;
