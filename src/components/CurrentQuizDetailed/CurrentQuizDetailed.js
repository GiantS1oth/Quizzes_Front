import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';

const CurrentQuizDetailed = () => {
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search); // 
  const quizId = query.get('quizId'); 
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!quizId) {
        alert('ID теста не найден.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8192/quizzes/api/v1/quizzes/getQuizById?quiz_id=${quizId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка получения данных теста');
        }

        const quizData = await response.json();
        setQuiz(quizData);
      } catch (error) {
        console.error('Ошибка при загрузке деталей теста:', error);
        alert('Не удалось загрузить детали теста.');
      }
    };

    fetchQuizDetails();
  }, [quizId, token]);

  const openTheory = () => {
    if (!quizId) {
      alert('ID теста не найден.');
      return;
    }
    navigate(`/theory?quizId=${quizId}`);
  };

  const startQuiz = () => {
    if (!quizId) {
      alert('ID теста не найден.');
      return;
    }
    navigate(`/test?quizId=${quizId}&startTest=true`);
  };
  const returnToQuizzes = () => {
    navigate(`/myQuizzes`);
  }
  return (
    <div id="header">
      {quiz ? (
        <>
          <h1 id="quiz-name">{quiz.name}</h1>
          <p id="quiz-description">{quiz.description}</p>
          <button id="add-questions-button" onClick={() => navigate(`/addQuestion?quizId=${quizId}`)}>Добавить вопросы</button>
          <button onClick={openTheory}>Теория</button>
          <button onClick={startQuiz}>Пройти тест</button>
          <button onClick={returnToQuizzes}>Назад</button>
        </>
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
};

export default CurrentQuizDetailed;
