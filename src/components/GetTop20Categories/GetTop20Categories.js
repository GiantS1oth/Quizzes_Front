import React, { useState, useEffect } from 'react';
import './styles.css';

const GetTop20Categories = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
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
  }, []);

  const handleSelectCategory = (category) => {
    onSelectCategory(category);
  };

  return (
    <div className="search-results">
      {loading && <p>Загрузка...</p>}
      {message && !loading && <p>{message}</p>}
      {!loading && !message && categories.length > 0 && (
        <ul>
          {categories.map((category) => (
            <li key={category.id} onClick={() => handleSelectCategory(category)}>
              {category.name}
            </li>
          ))}
        </ul>
      )}
      {!loading && !message && categories.length === 0 && <p>Категории не найдены.</p>}
    </div>
  );
};

export default GetTop20Categories;
