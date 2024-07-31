import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const CreateNewQuiz = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (query) => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8192/quizzes/api/v1/quizzes/searchByCategories?category_name=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        const errorData = await response.json();
        setMessage('Ошибка поиска категории: ' + (errorData.message || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка поиска категории', error);
      setMessage('Не удалось выполнить поиск категории');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(category);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [category]);

  const handleSelectCategory = (categoryItem) => {
    setCategory(categoryItem.name);
    setSelectedCategory(categoryItem); 
    setResults([]);
    setShowResults(false); 
  };

  const handleCreateCategory = async (categoryName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/createCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: categoryName })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Категория успешно создана');
        return data.id;
      } else {
        const errorData = await response.json();
        setMessage('Ошибка сохранения категории: ' + (errorData.message || 'Неизвестная ошибка'));
        return null;
      }
    } catch (error) {
      console.error('Ошибка создания категории', error);
      setMessage('Не удалось создать категорию');
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Вы не авторизованы.');
      navigate('/login');
      return;
    }

    let categoryId = selectedCategory?.id;

    if (!categoryId) {
      categoryId = await handleCreateCategory(category);
      if (!categoryId) return;
    }

    try {
      const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/createQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, categoryId })
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
        <div className="category-container">
          <input
            type="text"
            id="quiz-category"
            placeholder="Название категории"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setShowResults(true); // Показать результаты поиска при вводе
            }}
            onBlur={() => {
              // Установить задержку для скрытия результатов поиска, чтобы пользователь мог кликнуть на результат
              setTimeout(() => setShowResults(false), 100);
            }}
            required
          />
          {showResults && results.length > 0 && (
            <div className="search-results">
              <ul>
                {results.map((categoryItem) => (
                  <li key={categoryItem.id} onClick={() => handleSelectCategory(categoryItem)}>
                    {categoryItem.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {isLoading && <p>Загрузка...</p>}
        </div>
        <button type="submit">Создать</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateNewQuiz;
