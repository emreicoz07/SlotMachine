import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { Game } from '../models/userModel';

const router = Router();

// Oyun verilerini JSON dosyasından okuma ve API ile gönderme
router.get('/games', (req, res) => {
  const gameDataPath = path.join(__dirname, '../data/game-data.json'); // game-data.json dosyasının yolu
  fs.readFile(gameDataPath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading game data' });
    }
    const games: Game[] = JSON.parse(data);
    if (!req.query.search) {
      res.json(games);
    } else {
      res.json(
        games.filter((game) =>
          game.title
            .toLowerCase()
            .includes((req.query.search as string).toLowerCase()),
        ),
      );
    }
  });
});

export default router;
