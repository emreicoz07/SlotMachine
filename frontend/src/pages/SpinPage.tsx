import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom'; // useNavigate for redirection
import '../assets/css/SpinPage.css';
import Reel from '../components/ReelComponent';

import lemonImage from '../assets/images/lemon.png';
import appleImage from '../assets/images/apple.png';
import bananaImage from '../assets/images/banana.png';
import cherryImage from '../assets/images/cherry.png';

const SpinPage: React.FC = () => {
  const { user, updateUserBalance } = useUser();
  const [spinResult, setSpinResult] = useState<string[]>(['', '', '']);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [showWinOverlay, setShowWinOverlay] = useState<boolean>(false);
  const [winningsAmount, setWinningsAmount] = useState<number>(0);
  const navigate = useNavigate(); // Hook for redirection

  const fruitImages: { [key: string]: string } = {
    lemon: lemonImage,
    apple: appleImage,
    banana: bananaImage,
    cherry: cherryImage,
  };

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 4); // 4 fruits available
  };

  // Redirect to login if the user is not logged in
  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login page if no token is found
    }
  }, [navigate]);

  // Initialize spin symbols when the page loads
  useEffect(() => {
    const fruits = Object.keys(fruitImages); // Get fruit symbols
    const a = getRandomNumber();
    const b = getRandomNumber();
    const c = getRandomNumber();
    setSpinResult([fruits[a], fruits[b], fruits[c]]); // Set random symbols initially
  }, []);

  // Spin function to start and stop reels
  const handleSpin = async () => {
    try {
      // Fetch the balance from the backend before spinning
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/balance/${user.email}`,
      );
      const { balance: currentBalance } = response.data;

      // If balance is zero, alert and stop the spin
      if (currentBalance === 0) {
        alert('Your balance is 0. Please contact the game provider.');
        return;
      }

      // Update user balance
      updateUserBalance(currentBalance);

      setIsSpinning(true);
      setIsWin(false);

      const spinDuration = 2500; // Total duration of spin
      const spinInterval = 500; // Interval for reel changes

      // Start the interval to simulate spinning reels
      const intervalId = setInterval(() => {
        const a = getRandomNumber();
        const b = getRandomNumber();
        const c = getRandomNumber();

        const fruits = Object.keys(fruitImages); // Get fruit symbols
        setSpinResult([fruits[a], fruits[b], fruits[c]]);
      }, spinInterval);

      // Stop spinning after the spinDuration and fetch the result from the backend
      setTimeout(async () => {
        clearInterval(intervalId); // Stop the reels

        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/spin`,
            {
              email: user.email,
            },
          );
          const { result, winnings, balance: newBalance } = response.data;

          setSpinResult(result); // Set the final spin result
          updateUserBalance(newBalance); // Update balance

          if (winnings > 0) {
            setIsWin(true);
            setWinningsAmount(winnings);
            setShowWinOverlay(true);
            setTimeout(() => setShowWinOverlay(false), 3000); // Hide win overlay after 3 seconds
          }

          setIsSpinning(false);
        } catch (error) {
          console.error('Error spinning:', error);
          setIsSpinning(false);
        }
      }, spinDuration);
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  return (
    <div className="spin-page">
      <div className={`slot-machine-container ${showWinOverlay ? 'blur' : ''}`}>
        <div className="slot-machine-header">ONLINE</div>
        <div className={`slot-machine ${isSpinning ? 'spinning' : ''}`}>
          <Reel symbol={fruitImages[spinResult[0]]} spinning={isSpinning} />
          <Reel symbol={fruitImages[spinResult[1]]} spinning={isSpinning} />
          <Reel symbol={fruitImages[spinResult[2]]} spinning={isSpinning} />
        </div>
        <div className={`balance-and-button ${isWin ? 'win' : ''}`}>
          <div className="balance-container">
            <p>Coins: {user.balance}</p>
          </div>
          <button
            className="spin-button"
            onClick={handleSpin}
            disabled={isSpinning || user.balance === 0}
          >
            Spin
          </button>
        </div>
      </div>

      {/* WIN Overlay */}
      <div className={`win-overlay ${showWinOverlay ? 'show' : ''}`}>
        WIN
        <p>You Won: {winningsAmount} Coins!</p>
      </div>
    </div>
  );
};

export default SpinPage;
