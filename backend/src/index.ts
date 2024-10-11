import express from 'express';
import cors from 'cors';
import gamesRoutes from './routes/gamesRoutes'; // Oyun rotasını dahil ediyoruz
import authRoutes from './routes/authRoutes'; // Auth rotasını dahil ediyoruz
import spinRoutes from './routes/SpinRoutes'; // Yeni spin rotasını dahil ediyoruz
import dotenv from 'dotenv';
import pool from './config/database';

dotenv.config(); // .env dosyasındaki çevresel değişkenleri kullan

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware - frontend URL'ini çevresel değişkenden çek
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // frontend URL'ini .env'den al
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // İzin verilen HTTP metodları
    credentials: true, // Cookie ve session bilgilerini kabul etmek için
  }),
);

// Preflight (OPTIONS) isteklerini kabul ediyoruz
app.options('*', cors());

// Rotalar
app.use('/api/auth', authRoutes); // Auth rotası
app.use('/api', gamesRoutes); // Oyun rotası
app.use('/api', spinRoutes); // Spin rotasını kullanma

// Ana route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Sunucuyu başlatıyoruz
const port = process.env.PORT || 10000;
app.listen(port, async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS users(
    id   integer NOT NULL PRIMARY KEY,  
    email   varchar(255) NOT NULL,
    password varchar(255),
    balance int NOT NULL DEFAULT 20
)`);
  console.log(`Server is running on port ${port}`);
});
