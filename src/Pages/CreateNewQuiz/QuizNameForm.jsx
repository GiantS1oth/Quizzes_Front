import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const QuizNameForm = ({ formData, setFormData }) => {
  const [name, setName] = useState(formData.name || '');
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleNext = () => {
    setFormData({ ...formData, name });
    navigate('/createQuiz/step2');
  };

  const returnToQuizzes = () => {
    navigate(`/quizzes`);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate(`/`);
  };

  return (
    <div>
      <div className='header-wrapper-myquizzes'></div>
      <div >
        <h1>Добавить новый тест - Шаг 1: Имя теста</h1>
        <input
          type="text"
          id="quiz-name"
          placeholder="Имя теста"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
      </div>
    </div>
  );
};

export default QuizNameForm;
