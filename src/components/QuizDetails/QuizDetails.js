// QuizDetails.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';

const QuizDetails = () => {
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const quizId = query.get('quizId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchQuizDetail = async () => {
      if (!quizId) {
        alert('ID теста не найден.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8192/api/v1/quizzes/getQuizById?quiz_id=${quizId}`, {
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

    fetchQuizDetail();
  }, [quizId, token]);

  const openTheory = () => {
    navigate(`/theory?quizId=${quizId}`);
  };

  const startQuiz = () => {
    navigate(`/test?quizId=${quizId}`);
  };

  const addQuestions = () => {
    navigate(`/addQuestion`, { state: { quiz } });
  };

  if (!quiz) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <header id="header">
        <h1 id="quiz-name">{quiz.name}</h1>
        <p id="quiz-description">{quiz.description}</p>
        <button id="add-questions-button" onClick={addQuestions}>Добавить вопросы</button>
        <button onClick={openTheory}>Теория</button>
        <button onClick={startQuiz}>Пройти тест</button>
      </header>
    </div>
  );
};

export default QuizDetails;
