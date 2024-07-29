import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const CreateNewQuiz = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Вы не авторизованы.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/createQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, categoryId: parseInt(category, 10) })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response Data:', data);
        navigate(`/addQuestion?quizId=${data.id}`);
      } else {
        const errorData = await response.json();
        alert('Ошибка создания теста: ' + (errorData.message || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка при создании теста:', error);
      alert('Не удалось создать тест.');
    }
  };

  return (
    <div className="container">
      <h1>Добавить новый тест</h1>
      <form id="addQuizForm" onSubmit={handleSubmit}>
        <input 
          type="text" 
          id="quiz-name" 
          placeholder="Имя теста" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          id="quiz-description" 
          placeholder="Описание" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          id="quiz-category" 
          placeholder="ID категории" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required 
        />
        <button type="submit">Создать</button>
      </form>
    </div>
  );
};

export default CreateNewQuiz;

