import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles.css';

function TheoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const quizId = query.get('quizId');

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8192/quizzes/api/v1/quizzes/getCardsByQuizId?quiz_id=${quizId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Неизвестная ошибка');
        }
      } catch (error) {
        console.error('Ошибка при загрузке вопросов:', error);
        setError('Не удалось загрузить вопросы.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    navigate(`/current-quiz-detail?quizId=${quizId}`);
  };

  return (
    <div>
      <header>
        <h1>Карточки теста</h1>
        <button onClick={() => navigate(`/current-quiz-detail?quizId=${quizId}`)}>Назад</button>
      </header>

      <main>
        <div id="card-container">
          {loading ? (
            <></>
          ) : error ? (
            <p>Ошибка: {error}</p>
          ) : questions.length > 0 ? (
            <div id="card-content">
              <p>Вопрос: {questions[currentQuestionIndex].questionText}</p>
              <p>Ответ: {questions[currentQuestionIndex].answer}</p>
            </div>
          ) : (
            <p>Нет вопросов для отображения</p>
          )}
          <button id="prev-button" onClick={handlePrev} disabled={currentQuestionIndex === 0}>Предыдущий</button>
          <button id="next-button" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>Следующий</button>
          <button onClick={handleFinish}>Завершить</button>
        </div>
      </main>
    </div>
  );
}

export default TheoryPage;
