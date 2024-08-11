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
        setQuizzes(data);
      }
    };

    fetchQuizzes();
  }, []);

  const openQuizDetail = (quizId) => {
    navigate(`/current-quiz-detail?quizId=${quizId}`);
  };

  const addToFavorites = async (quizId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8192/quizzes/api/v1/quizzes/addToFavorites?quiz_id=${quizId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка сети: ${response.status} ${response.statusText} - ${errorText}`);
      }

      if (response.status === 200) {
        setMessage('Тест добавлен в избранное.');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Не удалось добавить тест в избранное.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage(`Ошибка добавления теста в избранное: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    }
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
       <div className='header-wrapper-myquizzes'>
      </div>
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
          className='add-favorites-button'
          onClick={(event) => {
            event.stopPropagation(); 
            addToFavorites(quiz.id);
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
