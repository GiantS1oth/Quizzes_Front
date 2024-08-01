import React, { useState, useEffect } from 'react';
import './styles.css';

const SearchCategoryByName = ({ onSelectCategory }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

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
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectCategory = (category) => {
    onSelectCategory(category);
    setQuery(category.name); 
    setResults([]); 
  };

  return (
    <div className="search-category-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Введите название категории"
        className="search-input"
      />
      {message && <p>{message}</p>}
      {results.length > 0 && (
        <div className="search-results">
          <ul>
            {results.map((category) => (
              <li key={category.id} onClick={() => handleSelectCategory(category)}>
                {category.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchCategoryByName;
