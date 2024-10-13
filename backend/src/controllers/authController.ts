import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  createUser,
  findUserByEmail,
  updateUserPassword,
} from '../models/userModel';
import { check, validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

// Kayıt işlemi için doğrulamalar
export const registerValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({
    min: 6,
  }),
];

// Login işlemi için doğrulamalar
export const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Password is required and must be at least 6 characters',
  ).isLength({ min: 6 }),
];

// Şifre değiştirme işlemi için doğrulamalar
export const changePasswordValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('oldPassword', 'Old password is required').exists(),
  check('newPassword', 'New password must be 6 or more characters').isLength({
    min: 6,
  }),
];

// Kullanıcı kaydı
export const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, hashedPassword);

    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown server error' });
    }
  }
};

// Kullanıcı girişi
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' },
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown server error' });
    }
  }
};

// Şifre değiştirme işlevi
export const changePassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Incorrect current password' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(user.id, hashedPassword);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown server error' });
    }
  }
};

// Kullanıcının balance bilgisini almak için yeni bir endpoint
export const getUserBalance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email } = req.params;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ balance: user.balance });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown server error' });
    }
  }
};
