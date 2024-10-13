import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Login.css';
import { useUser } from '../contexts/UserContext'; // useUser hook import
import { toast } from 'react-toastify'; // Toastify import
import 'react-toastify/dist/ReactToastify.css'; // Toastify Styles import

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message] = useState('');
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const setToken = (token: string, remember: boolean) => {
    const now = new Date();
    if (remember) {
      const expirationTime = now.getTime() + 30 * 24 * 60 * 60 * 1000; // TOKEN  30 days
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', expirationTime.toString());
    } else {
      const expirationTime = now.getTime() + 8 * 60 * 60 * 1000; // TOKEN 8 hours
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('tokenExpiry', expirationTime.toString());
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/login`,
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
      toast.success('Login successful!', {
        position: 'top-center',
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        autoClose: 3000, // 3 Second later close
      });
      setToken(data.token, rememberMe);
      localStorage.setItem('userEmail', email); // User E-mail

      // User info save
      setUser({ email, token: data.token, balance: user?.balance || 0 });

      navigate('/games');
    } else {
      toast.error(data.message || 'Login failed', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
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
          {/* Password Change Link */}
        </p>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;
