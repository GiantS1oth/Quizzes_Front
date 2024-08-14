import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/getAllMyFavorites', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Ошибка сети: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setFavorites(data);
        } else {
          setMessage('Не удалось загрузить избранные тесты.');
        }
      } catch (error) {
        console.error('Ошибка:', error);
        setMessage(`Ошибка загрузки избранных тестов: ${error.message}`);
      }
    };

    fetchFavorites();
  }, []);

  const openQuizDetail = (quizId) => {
    navigate(`/current-quiz-detail?quizId=${quizId}`);
  };

  const toggleFavorite = async (quizId) => {
    const token = localStorage.getItem('token');
    const url = `http://localhost:8192/quizzes/api/v1/quizzes/deleteFromFavoritesByQuizId?quiz_id=${quizId}`;
    const method = 'DELETE';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка сети: ${response.status} ${response.statusText} - ${errorText}`);
      }

      
      const updatedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]').filter(id => id !== quizId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

      
      setFavorites(prevFavorites => prevFavorites.filter(quiz => quiz.id !== quizId));

      setMessage('Тест удален из избранного.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage(`Ошибка изменения статуса теста: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const returnBack = () => {
    navigate('/quizzes');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate(`/`);
  };

  return (
    <div>
      <div className='header-wrapper-myquizzes'></div>
      <div className='profile-container'>
        <h1 id="username">Привет, {localStorage.getItem('username')}!</h1>
        <button onClick={handleLogout}>Выход</button>
      </div>
      <div className='my-favorites-container'>
        <button className='return-button' onClick={returnBack}></button>
        <div className="favorites-list">
          {favorites.length > 0 ? (
            favorites.map((quiz) => (
              <div key={quiz.id} className="quiz-item">
                <div className="quiz-content" onClick={() => openQuizDetail(quiz.id)}>
                  <p>{quiz.name}</p>
                </div>
                <button
                  className='add-favorites-button active'
                  onClick={() => toggleFavorite(quiz.id)}
                >
                </button>
              </div>
            ))
          ) : (
            <p>Нет избранных тестов.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyFavorites;
