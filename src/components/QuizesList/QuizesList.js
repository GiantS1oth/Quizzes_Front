import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const QuizzesList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Вы не авторизованы.');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/getAllMyQuiz', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении тестов.');
        }

        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error('Ошибка при загрузке тестов:', error);
        alert('Не удалось загрузить тесты.');
      }
    };

    fetchQuizzes();
  }, [navigate]);

  const openQuizDetail = (quizId) => {
    navigate(`/quiz-detail?quizId=${quizId}`);
  };

  return (
    <div className="container">
      <h1>Мои тесты</h1>
      <div id="quizzes-list">
        {quizzes.length > 0 ? (
          quizzes.map(quiz => (
            <div key={quiz.id} className="quiz-item">
              <h2>{quiz.name}</h2>
              <p>{quiz.description}</p>
              <button onClick={() => openQuizDetail(quiz.id)}>Открыть детали</button>
            </div>
          ))
        ) : (
          <p>Нет доступных тестов.</p>
        )}
      </div>
    </div>
  );
};

export default QuizzesList;
