import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Login.css';
import { useUser } from '../contexts/UserContext'; // useUser hook'unu import ediyoruz

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user, setUser } = useUser(); // Burada user'ı da alıyoruz

  const setToken = (token: string, remember: boolean) => {
    const now = new Date();
    if (remember) {
      const expirationTime = now.getTime() + 30 * 24 * 60 * 60 * 1000; // 30 gün
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', expirationTime.toString());
    } else {
      const expirationTime = now.getTime() + 8 * 60 * 60 * 1000; // 8 saat
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('tokenExpiry', expirationTime.toString());
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(
      '${process.env.REACT_APP_API_URL}/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      setToken(data.token, rememberMe);
      localStorage.setItem('userEmail', email); // Kullanıcı e-postasını kaydet

      // Kullanıcı bilgilerini güncelle
      setUser({ email, token: data.token, balance: user?.balance || 0 });

      setMessage('Login successful!');
      navigate('/games');
    } else {
      setMessage(data.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="remember-me-container">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label className="remember">Remember Me</label>
        </div>
        <button type="submit">Login</button>
        <p>
          Dont have an account? <Link to="/register">Create one here</Link>
        </p>
        <p>
          <Link to="/change-password">Forgot your password? Click here!</Link>{' '}
          {/* Şifre Değiştirme Linki */}
        </p>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;
