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
      <img src="\Assets\vector.svg" alt="Q logo" className="logo" />
      <img src="\Assets\uizzes.svg" alt="Q logo" className="logo-letter" /> 
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
      <img src="\Assets\Актуальные на этой неделе_.svg" alt="week-actual" className='week-actual'/>
      <div className="current-week-items">
            <div className="item black">
              <h2>Математика 1й(класс)</h2>
              <p>Какие числа пропущены?
              7, ☐, ☐, 4</p>
        </div>
            <div className="item blue">
            <h2>Ангийский язык 2й(курс)</h2>
              <p>She ___ to the store yesterday </p>
        </div>
            <div className="item dark-blue">
            <h2>География</h2>
              <p>Какой язык имеет официальный статус в государстве Андорра?</p>
        </div>
      </div>
    </section>
  </main>
</div>
    
  );
}

export default HomePage;
