import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

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

  const removeFromFavorites = async (quizId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8192/quizzes/api/v1/quizzes/deleteFromFavoritesByQuizId?quiz_id=${quizId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
       
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка сети: ${response.status} ${response.statusText} - ${errorText}`);
      }
  
      
      setFavorites(favorites.filter(quiz => quiz.id !== quizId));
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage(`Ошибка удаления теста из избранного: ${error.message}`);
    }
  };
  

  return (
    <div className="favorites-container">
      <header id="header">
        <h1>Мои Избранные Тесты</h1>
        {message && <p className="message">{message}</p>}
      </header>
      <div className="favorites-list">
        {favorites.length > 0 ? (
          favorites.map((quiz) => (
            <div key={quiz.id} className="quiz-item">
              <div className="quiz-content" onClick={() => openQuizDetail(quiz.id)}>
                <h2>{quiz.name}</h2>
                <p>{quiz.description}</p>
              </div>
              <div className="actions">
                <button className="remove-button" onClick={() => removeFromFavorites(quiz.id)}>×</button>
              </div>
            </div>
          ))
        ) : (
          <p>Нет избранных тестов.</p>
        )}
      </div>
    </div>
  );
}

export default MyFavorites;
