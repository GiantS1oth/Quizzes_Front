import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div id="logo">Логотип</div>
      <button onClick={() => navigate('/register')}>Регистрация</button>
      <button onClick={() => navigate('/login')}>Войти</button>
    </div>
  );
}

export default HomePage;

