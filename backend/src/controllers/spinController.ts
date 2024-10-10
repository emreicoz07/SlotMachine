import { Request, Response } from 'express';
import { findUserByEmail, updateUserBalance } from '../models/userModel';

// Reel tanımlamaları
const reel1 = [
  'cherry',
  'lemon',
  'apple',
  'lemon',
  'banana',
  'banana',
  'lemon',
  'lemon',
];
const reel2 = [
  'lemon',
  'apple',
  'lemon',
  'lemon',
  'cherry',
  'apple',
  'banana',
  'lemon',
];
const reel3 = [
  'lemon',
  'apple',
  'lemon',
  'apple',
  'cherry',
  'lemon',
  'banana',
  'lemon',
];

// Ödül tablosu
const rewards: { [key: string]: { [key: number]: number } } = {
  cherry: { 3: 50, 2: 40 },
  apple: { 3: 20, 2: 10 },
  banana: { 3: 15, 2: 5 },
  lemon: { 3: 3 },
};

export const spin = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.balance < 1) {
      res.status(400).json({ message: 'Insufficient balance' });
      return;
    }

    // Her reel için rastgele bir sonuç seçiliyor
    const reel1Result = reel1[Math.floor(Math.random() * reel1.length)];
    const reel2Result = reel2[Math.floor(Math.random() * reel2.length)];
    const reel3Result = reel3[Math.floor(Math.random() * reel3.length)];
    const result = [reel1Result, reel2Result, reel3Result];

    let winnings = 0;
    console.log('Generated Spin Result:', result); // Log ekleniyor

    // 3 sembolün de aynı olduğu durum (kazanç)
    if (reel1Result === reel2Result && reel2Result === reel3Result) {
      winnings = rewards[reel1Result]?.[3] || 0; // 3 eşleşme için ödül
    }
    // İlk 2 sembolün aynı olduğu durum
    else if (reel1Result === reel2Result) {
      winnings = rewards[reel1Result]?.[2] || 0; // 2 eşleşme için ödül
    }

    // Kullanıcının yeni bakiyesini hesaplıyoruz
    const newBalance = user.balance - 1 + winnings;
    await updateUserBalance(user.id, newBalance);

    res.json({
      result, // Dizi olarak döndürüyoruz
      winnings,
      balance: newBalance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
