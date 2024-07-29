import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function QuizCreated() {
  const navigate = useNavigate();

  const goBackToQuizzes = () => {
    navigate('/quizzes');
  };

  return (
    <div className="container">
      <h1>Тест успешно создан!</h1>
      <button onClick={goBackToQuizzes}>Назад к тестам</button>
    </div>
  );
}

export default QuizCreated;
