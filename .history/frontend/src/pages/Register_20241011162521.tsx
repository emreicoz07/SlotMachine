import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate'i import ediyoruz
import '../assets/css/Register.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // useNavigate hook'u ile yönlendirme işlemi

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Şifre eşleşmesini kontrol et
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const response = await fetch(
      '${process.env.REACT_APP_API_URL}/api/auth/register',
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
      setMessage('Registration successful!');

      // Kayıt başarılı olduğunda login sayfasına yönlendirme
      setTimeout(() => {
        navigate('/login'); // Login sayfasına yönlendirme
      }, 2000); // 2 saniye bekleyip yönlendirme yapılıyor
    } else {
      setMessage(data.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Register;
