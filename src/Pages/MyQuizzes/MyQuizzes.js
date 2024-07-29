import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
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

  return (
    <div>
      <header id="header">
        <h1>Мои тесты</h1>
      </header>
      <div id="quizzesList">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
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
}

export default MyQuizzes;
