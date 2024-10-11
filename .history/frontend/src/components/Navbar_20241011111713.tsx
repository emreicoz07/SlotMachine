import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Navbar.css';
import { useUser } from '../contexts/UserContext'; // useUser hook'unu import ettik
import slotMachineIcon from '../assets/images/slotmachinelogo.svg'; // SVG dosya yolunu belirt

const Navbar: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Hem localStorage hem de sessionStorage'ı temizleyelim
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userEmail');

    setUser({ email: null, token: null, balance: 0 });

    navigate('/login');
  };

  // Kullanıcı adını @ işaretine kadar göster
  const displayName = user.email
    ? user.email.split('@')[0].charAt(0).toUpperCase() +
      user.email.split('@')[0].slice(1)
    : '';

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img
            src={slotMachineIcon}
            alt="Slot Machine"
            className="slot-machine-icon"
          />
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/games">Games</Link>
        </li>
      </ul>
      <ul className="nav-links">
        {user.token ? (
          <li className="user-info">
            <span>
              {displayName} (Coins: {user.balance})
            </span>
            <button onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
