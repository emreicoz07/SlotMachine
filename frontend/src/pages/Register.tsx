import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate'i import ediyoruz
import { toast } from 'react-toastify'; // Toastify'ı import et
import 'react-toastify/dist/ReactToastify.css'; // Toastify'ın stillerini import et
import '../assets/css/Register.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // useNavigate hook'u ile yönlendirme işlemi

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // İşlem başladığında loading aktif

    // Şifre eşleşmesini kontrol et
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      setLoading(false); // İşlem tamamlanınca loading pasif
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await response.json();
    setLoading(false); // İşlem Tamamlanınca Loading pasif

    if (response.ok) {
      toast.success('Registration successful!', {
        position: 'top-center',
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        autoClose: 3000, // 3 saniye sonra kaybolacak
      });

      navigate('/login'); // Login sayfasına yönlendirme
    } else {
      toast.error(data.message || 'Registration failed', {
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
      {loading && <div className="spinner">Loading...</div>}
    </div>
  );
};

export default Register;
