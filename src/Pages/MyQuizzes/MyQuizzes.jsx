import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/getAllMyQuiz', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (Array.isArray(data)) {
       
        const favoritesFromStorage = JSON.parse(localStorage.getItem('favorites')) || [];
        const quizzesWithFavorites = data.map(quiz => ({
          ...quiz,
          isFavorite: favoritesFromStorage.includes(quiz.id)
        }));
        setQuizzes(quizzesWithFavorites);
      }
    };

    fetchQuizzes();
  }, []);

  const openQuizDetail = (quizId) => {
    navigate(`/current-quiz-detail?quizId=${quizId}`);
  };

  const toggleFavorite = async (quizId, isFavorite) => {
    const token = localStorage.getItem('token');
    const url = isFavorite
      ? `http://localhost:8192/quizzes/api/v1/quizzes/deleteFromFavoritesByQuizId?quiz_id=${quizId}`
      : `http://localhost:8192/quizzes/api/v1/quizzes/addToFavorites?quiz_id=${quizId}`;
    const method = isFavorite ? 'DELETE' : 'POST';

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

      
      const updatedFavorites = isFavorite
        ? JSON.parse(localStorage.getItem('favorites')).filter(id => id !== quizId)
        : [...(JSON.parse(localStorage.getItem('favorites')) || []), quizId];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

      setQuizzes(prevQuizzes =>
        prevQuizzes.map(quiz =>
          quiz.id === quizId ? { ...quiz, isFavorite: !isFavorite } : quiz
        )
      );

      setMessage(isFavorite ? 'Тест удален из избранного.' : 'Тест добавлен в избранное.');
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
        <h1 id="username">Привет, {localStorage.getItem('username') || 'Гость'}!</h1>
        <button onClick={handleLogout}>Выход</button>
      </div>
      <div id="quizzes-list" className='quizzes-list'>
        <button className='return-button' onClick={returnBack}></button>
        <div className='tests-icon'></div>
        <div className='quiz-items'>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-item" onClick={() => openQuizDetail(quiz.id)}>
                <p>{quiz.name}</p>
                <div className='div-category'>{quiz.categoryName}</div>
                <button
                  className={`add-favorites-button ${quiz.isFavorite ? 'active' : ''}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite(quiz.id, quiz.isFavorite);
                  }}
                ></button>
              </div>
            ))
          ) : (
            <p>Нет доступных тестов.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyQuizzes;
