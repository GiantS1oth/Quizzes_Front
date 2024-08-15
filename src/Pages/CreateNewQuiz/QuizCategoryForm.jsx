import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const QuizCategoryForm = ({ formData, setFormData, handleSubmit }) => {
  const [category, setCategory] = useState(formData.category || '');
  const [results, setResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(formData.selectedCategory || null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(category);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [category]);

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
        setSelectedCategory(data.length > 0 ? data[0] : null);
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

  const handleNext = async () => {
    let categoryId = selectedCategory?.id;

    if (!categoryId) {
      categoryId = await handleCreateCategory(category);
    }

    if (!categoryId) return;

    setFormData({ ...formData, category, selectedCategory: { id: categoryId, name: category } });
    handleSubmit(categoryId);
  };

  const handleBack = () => {
    navigate('/createQuiz/step2');
  };

  return (
    <div>
      <h1>Добавить новый тест - Шаг 3: Категория</h1>
      <input
  type="text"
  id="quiz-category"
  placeholder="Название категории"
  value={category}
  onChange={(e) => {
    const input = e.target.value.slice(0, 32); 
    setCategory(input);
  }}
  onBlur={() => {
    setTimeout(() => setShowResults(false), 100);
  }}
  required
  maxLength={32} 
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
      
    </div>
  );
};

export default QuizCategoryForm;
