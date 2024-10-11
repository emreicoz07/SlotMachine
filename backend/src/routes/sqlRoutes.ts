import { Router } from 'express';
import pool from '../config/database';

const router = Router();

router.post('/create', async (req, res) => {
  await pool.query(`CREATE TABLE IF NOT EXISTS users(
    id   integer NOT NULL PRIMARY KEY,  
    email   varchar(255) NOT NULL,
    password varchar(255),
    balance int NOT NULL DEFAULT 20
)`);
  res.send();
});
