import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
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

  const fruitImages: { [key: string]: string } = {
    lemon: lemonImage,
    apple: appleImage,
    banana: bananaImage,
    cherry: cherryImage,
  };

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 4); // 4 meyve olduğu için
  };

  // Spin başlamadan önce rastgele semboller gösterilsin
  useEffect(() => {
    const fruits = Object.keys(fruitImages); // Sembol isimlerini al
    const a = getRandomNumber();
    const b = getRandomNumber();
    const c = getRandomNumber();
    setSpinResult([fruits[a], fruits[b], fruits[c]]); // Rastgele semboller ayarla
  }, []);

  // Spin başlatma ve durdurma işlevi
  const handleSpin = async () => {
    // Eğer balance 0 ise alert ver ve spin işlemini durdur
    if (user.balance === 0) {
      alert('Your balance is 0. Please contact the game provider.');
      return; // Spin işlemini başlatma
    }

    setIsSpinning(true);
    setIsWin(false);

    const spinDuration = 4000; // Makaraların döneceği toplam süre
    const spinInterval = 500; // Makaraların kaç ms'de bir döneceği

    // Spin işlemi başlamadan önce interval başlatıyoruz
    const intervalId = setInterval(() => {
      const a = getRandomNumber();
      const b = getRandomNumber();
      const c = getRandomNumber();

      const fruits = Object.keys(fruitImages); // Sembol isimlerini al
      const resulttt = [fruits[a], fruits[b], fruits[c]];
      setSpinResult(resulttt);
    }, spinInterval);

    // Spin sonuçlarını simüle ederek belirli bir süre sonra durduruyoruz
    setTimeout(async () => {
      clearInterval(intervalId); // Makaraları durdur

      try {
        const response = await axios.post('http://localhost:4000/api/spin', {
          email: user.email,
        });
        const { result, winnings, balance: newBalance } = response.data;

        setSpinResult(result); // Spin sonuçlarını ayarla
        updateUserBalance(newBalance); // Kullanıcı bakiyesini güncelle

        if (winnings > 0) {
          setIsWin(true);
          setWinningsAmount(winnings);
          setShowWinOverlay(true);
          setTimeout(() => setShowWinOverlay(false), 3000); // WIN ekranını 3 saniye sonra gizle
        }

        setIsSpinning(false);
      } catch (error) {
        console.error('Error spinning:', error);
        setIsSpinning(false);
      }
    }, spinDuration); // Makaraları spinDuration süresi sonunda durdur
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
            disabled={isSpinning || user.balance === 0} // balance 0 ise buton disabled
          >
            Spin
          </button>
        </div>
      </div>

      {/* WIN Ekranı */}
      <div className={`win-overlay ${showWinOverlay ? 'show' : ''}`}>
        WIN
        <p>You Won: {winningsAmount} Coins!</p>
      </div>

      {spinResult && (
        <p className="spinresult">Spin Result: {spinResult.join(', ')}</p>
      )}
    </div>
  );
};

export default SpinPage;
