import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate'i ekledik
import '../assets/css/Games.css'; // Stil dosyasını import edelim

interface Game {
  id: number;
  title: string;
  providerName: string;
  thumb: {
    url: string;
  };
}

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [showPopup, setShowPopup] = useState(false); // Popup state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Giriş yapıldı mı kontrolü
  const navigate = useNavigate();

  const fetchGames = async (query?: string) => {
    let url = `${process.env.REACT_APP_API_URL}/api/games`;
    if (query && query.length > 0) {
      url += `?search=${query}`;
    }
    try {
      const response = await axios.get(url);
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  useEffect(() => {
    // Sayfa her yüklendiğinde token kontrolü yapıyoruz
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // Eğer token varsa kullanıcı giriş yapmıştır
    } else {
      setIsLoggedIn(false); // Token yoksa giriş yapılmamış
    }
  }, []);

  useEffect(() => {
    fetchGames(searchTerm);
  }, [searchTerm]);

  /*   const filteredGames = games.filter((game) => {
    const matchesSearch = game.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesProvider = selectedProvider
      ? game.providerName === selectedProvider
      : true;
    return matchesSearch && matchesProvider;
  }); */

  const handleGameClick = (gameId: number) => {
    if (!isLoggedIn) {
      setShowPopup(true); // Giriş yapılmamışsa popup'ı aç
    } else {
      navigate(`/spin/${gameId}`); // Giriş yapılmışsa spin sayfasına yönlendir
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false); // Popup'ı kapatma işlevi
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Login sayfasına yönlendir
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Register sayfasına yönlendir
  };

  return (
    <div className="games-page">
      <div className={`games-container ${showPopup ? 'blurred' : ''}`}>
        {' '}
        {/* Popup varsa arka plan bulanık */}
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search for a game..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            <option value="">All Providers</option>
            <option value="Play'n GO">Play'n GO</option>
            <option value="Pragmatic Play">Pragmatic Play</option>
            <option value="Yggdrasil">Yggdrasil</option>
          </select>
        </div>
        <div className="games-list">
          {games.map((game) => (
            <div
              key={game.id}
              className="game-item"
              onClick={() => handleGameClick(game.id)}
            >
              <h3>{game.title}</h3>
              <p>{game.providerName}</p>
              <img src={game.thumb?.url} alt={game.title} />
            </div>
          ))}
        </div>
      </div>

      {/* Popup bölümü */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Login Required</h3>
            <p>You need to login to play this game.</p>
            <div className="popup-actions">
              <button onClick={handleLoginRedirect}>Login</button>
              <button onClick={handleRegisterRedirect}>Register</button>
              <button onClick={handlePopupClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;
