import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Oyun verilerini JSON dosyasından okuma ve API ile gönderme
router.get('/games', (req, res) => {
  const gameDataPath = path.join(__dirname, '../data/game-data.json'); // game-data.json dosyasının yolu
  fs.readFile(gameDataPath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading game data' });
    }
    const games = JSON.parse(data);
    res.json(games); // JSON formatında oyun verilerini geri gönder
  });
});

export default router;
