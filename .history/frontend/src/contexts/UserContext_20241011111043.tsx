import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';

// Kullanıcı arayüzü
interface User {
  email: string | null;
  token: string | null;
  balance: number | null;
}

// Context tipi
interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  updateUserBalance: (newBalance: number) => void;
}

// Başlangıç değerleri için UserContext oluşturulur
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    email:
      localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail'),
    token: localStorage.getItem('token') || sessionStorage.getItem('token'),
    balance: null,
  });

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

  const updateUserBalance = (newBalance: number) => {
    setUser((prevUser) => {
      localStorage.setItem('userBalance', newBalance.toString());
      return { ...prevUser, balance: newBalance };
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUserBalance }}>
      {children}
    </UserContext.Provider>
  );
};

// Context'i kullanmak için özel hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
