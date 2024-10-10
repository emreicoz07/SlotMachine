import { Router } from 'express';
import { spin } from '../controllers/spinController'; // Doğru path olduğundan emin olun

const router = Router();

router.post('/spin', spin); // Spin endpoint'i tanımlandı

export default router;
