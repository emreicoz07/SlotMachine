import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Kullanıcı arayüzü (type veya interface olarak tanımlanabilir)
interface User {
  email: string;
  token: string | null;
  balance: number | null;
}

// Context oluşturma
const UserContext = createContext<
  | {
      user: User;
      setUser: React.Dispatch<React.SetStateAction<User>>;
      updateUserBalance: (newBalance: number) => void;
    }
  | undefined
>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({
    email:
      localStorage.getItem('userEmail') ||
      sessionStorage.getItem('userEmail') ||
      '',
    token: localStorage.getItem('token') || sessionStorage.getItem('token'),
    balance: null, // Balance bilgisi null veya number olabilir
  });

  // Kullanıcının balance bilgisi backend'den çekilir
  useEffect(() => {
    const fetchUserBalance = async () => {
      if (user.email) {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/auth/balance/${user.email}`,
          );
          setUser((prevUser) => ({
            ...prevUser,
            balance: response.data.balance,
          }));
        } catch (error) {
          console.error('Error fetching user balance:', error);
        }
      }
    };

    fetchUserBalance();
  }, [user.email]);

  // Kullanıcının balance bilgisini güncelleyen fonksiyon
  const updateUserBalance = (newBalance: number) => {
    setUser((prevUser) => {
      localStorage.setItem('userBalance', newBalance.toString()); // LocalStorage'da balance'ı güncelle
      return { ...prevUser, balance: newBalance }; // Balance number olarak güncellenir
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUserBalance }}>
      {children}
    </UserContext.Provider>
  );
};

// Context'i kullanmak için özel hook oluşturuyoruz
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
