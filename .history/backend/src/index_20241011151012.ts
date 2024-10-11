import express from 'express';
import cors from 'cors';
import gamesRoutes from './routes/gamesRoutes'; // Oyun rotasını dahil ediyoruz
import authRoutes from './routes/authRoutes'; // Auth rotasını dahil ediyoruz
import spinRoutes from './routes/SpinRoutes'; // Yeni spin rotasını dahil ediyoruz

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // frontend'in çalıştığı port
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // İzin verilen HTTP metodları
    credentials: true, // Cookie ve session bilgilerini kabul etmek için
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
