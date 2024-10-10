import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Login from './pages/login';
import Register from './pages/Register';
import Games from './pages/Games';
import ChangePassword from './pages/ChangePassword';
import { UserProvider } from './contexts/UserContext'; // UserProvider import edildi
import SpinPage from './pages/SpinPage';

const App: React.FC = () => {
  return (
    <UserProvider>
      {' '}
      {/* UserProvider ile tüm uygulamayı sarıyoruz */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/games" element={<Games />} />
          <Route path="/spin/:gameId" element={<SpinPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
