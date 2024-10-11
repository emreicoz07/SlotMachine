import React, { useState, useEffect } from 'react';
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

  // Spin işlemi
  const handleSpin = async () => {
    if (user.balance === 0) {
      // Balance 0 ise alert ile kullanıcıyı bilgilendir ve spin işlemini engelle
      alert('Coininiz bitmiştir, lütfen admin ile görüşünüz.');
      return;
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

        // Spin sonuçlarını sırasıyla gösteriyoruz
        setTimeout(() => {
          setReelStates([1, 1, 1]);
          setSpinResult((prev) => [result[0], prev[1], prev[2]]);
        }, 1000);

        setTimeout(() => {
          setReelStates([0, 1, 1]);
          setSpinResult((prev) => [prev[0], result[1], prev[2]]);
        }, 1100);

        setTimeout(() => {
          setReelStates([0, 0, 1]);
          setSpinResult((prev) => [prev[0], prev[1], result[2]]);
        }, 1200);

        setTimeout(() => {
          setReelStates([0, 0, 0]);
          updateUserBalance(newBalance); // Balance güncelleniyor
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
    }, spinDuration); // Spin işlemi 4 saniye sürecek
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
            disabled={isSpinning || user.balance === 0} // balance 0 ise buton disable
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
