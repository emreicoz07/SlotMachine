import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/ChangePassword.css'; // Stil dosyasını import ediyoruz

const ChangePassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(
      '${process.env.REACT_APP_API_URL}/api/auth/change-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      setMessage('Password changed successfully!');
      setTimeout(() => navigate('/login'), 2000); // Başarılı olursa login sayfasına yönlendirme
    } else {
      setMessage(data.message || 'Password change failed');
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
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
          <label>Current Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default ChangePassword;
