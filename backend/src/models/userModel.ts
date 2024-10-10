import pool from '../config/database';

export interface User {
  id: number;
  email: string;
  password: string;
  balance: number;
}
//Create User
export const createUser = async (
  email: string,
  hashedPassword: string,
): Promise<User> => {
  const startingBalance = 20; // Kullanıcıya verilecek başlangıç bakiyesi
  const result = await pool.query(
    'INSERT INTO users (email, password, balance) VALUES ($1, $2, $3) RETURNING *',
    [email, hashedPassword, startingBalance], // Bakiye olarak 100 veriyoruz
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  return result.rows.length > 0 ? result.rows[0] : null;
};
//Update password
export const updateUserPassword = async (
  userId: number,
  hashedPassword: string,
): Promise<void> => {
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [
    hashedPassword,
    userId,
  ]);
};
// Balance güncelleme fonksiyonu
export const updateUserBalance = async (
  userId: number,
  newBalance: number,
): Promise<void> => {
  await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [
    newBalance,
    userId,
  ]);
};
