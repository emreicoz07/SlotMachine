import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate added
import '../assets/css/Games.css'; // Style import

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
  const [showPopup, setShowPopup] = useState(false); // Popup state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login Check
  const navigate = useNavigate();

  // Fetch games from the backend
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

  // Token kontrolü ve giriş yapılmadıysa login sayfasına yönlendirme
  // Token Check
  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Eğer token yoksa login sayfasına yönlendir
    } else {
      setIsLoggedIn(true); // Eğer token varsa kullanıcı giriş yapmıştır
    }
  }, [navigate]);

  // Fetch games based on the search term
  useEffect(() => {
    fetchGames(searchTerm);
  }, [searchTerm]);

  // Handle when a game is clicked
  const handleGameClick = (gameId: number) => {
    if (!isLoggedIn) {
      setShowPopup(true); // Giriş yapılmamışsa popup'ı aç
    } else {
      navigate(`/spin/${gameId}`); // Navigate Game
    }
  };

  // Close the popup
  const handlePopupClose = () => {
    setShowPopup(false);
  };

  // Redirect to the login page
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Redirect to the registration page
  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="games-page">
      <div className={`games-container ${showPopup ? 'blurred' : ''}`}>
        {/* Popup Background */}
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search for a game..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

      {/* Popup */}
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
