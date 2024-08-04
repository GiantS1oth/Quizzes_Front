import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css'; 

const GetTop20Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const quizId = query.get('quizId');

  useEffect(() => {
    console.log('Location search:', location.search); // Проверяем содержимое location.search
    console.log('Quiz ID:', quizId); // Проверяем значение quizId

    const fetchTopCategories = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage('Токен не найден. Пожалуйста, авторизуйтесь.');
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/getTop20Categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          const errorData = await response.json();
          setMessage('Ошибка получения категорий: ' + (errorData.message || 'Неизвестная ошибка'));
        }
      } catch (error) {
        console.error('Ошибка получения категорий', error);
        setMessage('Не удалось получить категории');
      } finally {
        setLoading(false);
      }
    };

    fetchTopCategories();
  }, [location.search]);

  const handleSelectQuiz = (category) => {
    navigate(`/current-quiz-detail?quizId=${category.id}`);
  };

  return (
    <div className="top-categories-container">
      {loading && <p>Загрузка...</p>}
      {message && !loading && <p>{message}</p>}
      {!loading && !message && categories.length > 0 && (
        <>
          {categories.map((category) => (
            <button
              key={category.id}
              className="top-category-button"
              onClick={() => handleSelectQuiz(category)}
            >
              {category.name}
            </button>
          ))}
        </>
      )}
      {!loading && !message && categories.length === 0 && <p>Категории не найдены.</p>}
    </div>
  );
};

export default GetTop20Categories;
