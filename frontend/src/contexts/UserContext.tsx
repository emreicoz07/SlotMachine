import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState({
    email:
      localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail'),
    token: localStorage.getItem('token') || sessionStorage.getItem('token'),
    balance: null as number | null, // Balance bilgisi null veya number olabilir
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
export const useUser = () => useContext(UserContext);
