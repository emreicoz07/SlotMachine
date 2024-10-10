import { Router } from 'express';
import {
  register,
  login,
  registerValidation,
  changePassword,
  getUserBalance,
} from '../controllers/authController';

const router = Router();

// Register route
router.post('/register', registerValidation, register);

// Login route
router.post('/login', login);

// Change password route
router.post('/change-password', changePassword); // Use the correct changePassword handler

// Balance rotası
router.get('/balance/:email', getUserBalance);

export default router;
