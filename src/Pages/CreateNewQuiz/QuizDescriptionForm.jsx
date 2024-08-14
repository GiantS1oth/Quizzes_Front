import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const QuizDescriptionForm = ({ formData, setFormData }) => {
  const [description, setDescription] = useState(formData.description || '');
  const navigate = useNavigate();

  const handleNext = () => {
    setFormData({ ...formData, description });
    navigate('/createQuiz/step3');
  };

  const handleBack = () => {
    navigate('/createQuiz/step1');
  };

  return (
    <div>
      <h1>Добавить новый тест - Шаг 2: Описание</h1>
      <input
        type="text"
        id="quiz-description"
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      
    </div>
  );
};

export default QuizDescriptionForm;
