import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import '../assets/css/SpinPage.css';
import Reel from '../components/ReelComponent';

// Görselleri import ediyoruz
import lemonImage from '../assets/images/lemon.png';
import appleImage from '../assets/images/apple.png';
import bananaImage from '../assets/images/banana.png';
import cherryImage from '../assets/images/cherry.png';

const SpinPage: React.FC = () => {
  const { user, updateUserBalance } = useUser();
  const [spinResult, setSpinResult] = useState<string[]>(['', '', '']);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [reelStates, setReelStates] = useState<number[]>([0, 0, 0]); // Her reel'in animasyon durumunu tutar
  const [isWin, setIsWin] = useState<boolean>(false); // Kazanç durumu
  const [showWinOverlay, setShowWinOverlay] = useState<boolean>(false); // WIN ekranı kontrolü

  const fruitImages: { [key: string]: string } = {
    lemon: lemonImage,
    apple: appleImage,
    banana: bananaImage,
    cherry: cherryImage,
  };

  // Rasgele semboller döndüren bir fonksiyon
  const getRandomFruits = () => {
    const fruits = Object.keys(fruitImages); // Sembol isimlerini al
    return [1, 2, 3].map(
      () => fruits[Math.floor(Math.random() * fruits.length)],
    ); // Rasgele semboller seç
  };

  // Sayfa ilk yüklendiğinde rasgele sembollerle makaraları doldur
  useEffect(() => {
    const initialFruits = getRandomFruits();
    setSpinResult(initialFruits); // Başlangıç sembollerini yerleştir
  }, []); // Boş dependency array ile sadece bir kez çalışır

  // Spin işlemi
  const handleSpin = async () => {
    if (user.balance === 0) {
      // Balance 0 ise alert ile kullanıcıyı bilgilendir
      alert('Coininiz bitmiştir, lütfen admin ile görüşünüz.');
      return;
    }

    setIsSpinning(true);
    setIsWin(false);

    try {
      const response = await axios.post('http://localhost:4000/api/spin', {
        email: user.email,
      });
      const { result, winnings, balance: newBalance } = response.data;

      // Spin sonuçlarını sırasıyla gösteriyoruz
      setTimeout(() => {
        setReelStates([1, 1, 1]);
        setSpinResult((prev) => [result[0], prev[1], prev[2]]);
      }, 1500);

      setTimeout(() => {
        setReelStates([0, 1, 1]);
        setSpinResult((prev) => [prev[0], result[1], prev[2]]);
      }, 2000);

      setTimeout(() => {
        setReelStates([0, 0, 1]);
        setSpinResult((prev) => [prev[0], prev[1], result[2]]);
      }, 2500);

      setTimeout(() => {
        setReelStates([0, 0, 0]);
        updateUserBalance(newBalance);
        if (winnings > 0) {
          setIsWin(true); // Kazanç var
          setShowWinOverlay(true); // WIN ekranını göster
          setTimeout(() => {
            setShowWinOverlay(false); // WIN ekranını birkaç saniye sonra gizle
          }, 1000); // 1 saniye boyunca WIN yazısı görünsün
        }
        setIsSpinning(false);
      }, 1300);
    } catch (error) {
      console.error('Error spinning:', error);
      setIsSpinning(false);
    }
  };

  return (
    <div className="spin-page">
      <div className={`slot-machine-container ${showWinOverlay ? 'blur' : ''}`}>
        <div className="slot-machine-header">ONLINE</div>
        <div className={`slot-machine ${isSpinning ? 'spinning' : ''}`}>
          <Reel
            symbol={fruitImages[spinResult[0]]}
            spinning={!!reelStates[0]}
          />
          <Reel
            symbol={fruitImages[spinResult[1]]}
            spinning={!!reelStates[1]}
          />
          <Reel
            symbol={fruitImages[spinResult[2]]}
            spinning={!!reelStates[2]}
          />
        </div>
        <div className={`balance-and-button ${isWin ? 'win' : ''}`}>
          <div className="balance-container">
            <p>Coins: {user.balance}</p>
          </div>
          <button
            className="spin-button"
            onClick={handleSpin}
            disabled={isSpinning}
          >
            Spin
          </button>
        </div>
      </div>

      {/* WIN Ekranı */}
      <div className={`win-overlay ${showWinOverlay ? 'show' : ''}`}>WIN</div>

      {spinResult && (
        <p className="spinresult">Spin Result: {spinResult.join(', ')}</p>
      )}
    </div>
  );
};

export default SpinPage;
