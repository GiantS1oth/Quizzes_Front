import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


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
  
  const returnBack = () => {
    navigate('/quizzes')
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate(`/`);
  }

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
