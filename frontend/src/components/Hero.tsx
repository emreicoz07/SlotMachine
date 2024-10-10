import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate'i import ediyoruz
import '../assets/css/Hero.css';

const Hero: React.FC = () => {
  const navigate = useNavigate(); // useNavigate'i kullanarak yönlendirme işlemi yapacağız

  const handleStartNow = () => {
    navigate('/games'); // Butona tıklanınca "/games" sayfasına yönlendiriyoruz
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Welcome to Epic Game</h1>
        <p>Join the adventure and explore new worlds!</p>
        <button className="cta-button" onClick={handleStartNow}>
          Start Now
        </button>{' '}
        {/* Yönlendirme işlemi */}
      </div>
    </div>
  );
};

export default Hero;
