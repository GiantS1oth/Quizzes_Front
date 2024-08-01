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

  return (
    <div>
      <header id="header">
        <h1>Мои тесты</h1>
        {message && <p>{message}</p>}
      </header>
      <div id="quizzesList">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-item">
              <h2>{quiz.name}</h2>
              <p>{quiz.description}</p>
              <button onClick={() => openQuizDetail(quiz.id)}>Открыть детали</button>
              <button onClick={() => addToFavorites(quiz.id)}>Добавить в избранное</button>
            </div>
          ))
        ) : (
          <p>Нет доступных тестов.</p>
        )}
      </div>
    </div>
  );
}

export default MyQuizzes;
