import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  './styled.css';

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/quizzes');
    }
  }, [navigate]);

  return (
    <div className='background'>
  <header>
    <div className='logo-container'>
      <img src="\Assets\logo.svg" alt="Q logo" className="logo" />
      <img src="\Assets\Vector.svg" alt="Q logo" className="logo-letter" /> 
    </div>
    <div className="auth-buttons">
      <button className="register-button" onClick={() => navigate('/register')}>Зарегистрироваться&nbsp;
        <img src="\Assets\arrow_right.svg" alt="arrow" />
      </button>
      <button className="login-button" onClick={() => navigate('/login')}>Войти&nbsp; 
        <img src="\Assets\arrow_right.svg" alt="arrow" />
      </button>
    </div>
  </header>
  <main>
    <div className='body-container'>
      <div className="banner">
        <div className="banner-item">
          <h2>1000</h2>
          <p>Тестов и квизов</p>
        </div> 
        <div className="banner-item">
          <h2>1000</h2>
          <p>Членов группы</p>
        </div>
        <div className="banner-item">
          <h2>1000</h2>
          <p> Посетителей на неделе</p>
        </div>
      </div>
      <div className="sidebar">
        <div className='whats-quizzes'></div>
      </div>
    </div>
    <section className="current-week">
      <h1>Актуальные на этой неделе</h1>
      <div className="current-week-items">
        <div className="item black"></div>
        <div className="item blue"></div>
        <div className="item dark-blue"></div>
      </div>
    </section>
  </main>
  <footer className='footer'>
  ©2024 Quizzes Team 
  </footer>
</div>
    
  );
}

export default HomePage;
