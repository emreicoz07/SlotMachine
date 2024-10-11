import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',         // PostgreSQL'de kullandığın kullanıcı adı
  host: 'postgresql://gaming_db_nfin_user:48UpThWtZaEBtHDqNHuj7XFOh32TpuvD@dpg-cs4h6fdsvqrc738c26fg-a.frankfurt-postgres.render.com/gaming_db_nfin',        // Veritabanı sunucusunun adresi
  database: 'gaming_db',      // Oluşturduğun veritabanının adı
  password: 'k4rn4v4l', // PostgreSQL'e giriş yapmak için belirlediğin şifre
  port: 5432,               // PostgreSQL'in varsayılan portu
});

export default pool;
