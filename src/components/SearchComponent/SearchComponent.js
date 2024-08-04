import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchBy, setSearchBy] = useState('category'); // 'category' or 'author'
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const dropdownRef = useRef(null);

  const handleSearch = async () => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    let url = '';
    if (searchBy === 'category') {
      url = `http://localhost:8192/quizzes/api/v1/quizzes/searchByCategories?category_name=${query}`;
    } else if (searchBy === 'author') {
      url = `http://localhost:8192/quizzes/api/v1/quizzes/searchByAuthorName?author_name=${query}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (searchBy === 'category') {
          setCategories(data);
        } else if (searchBy === 'author') {
          setAuthors(data);
        }
        setResults(data);
        setShowResults(true);
      } else {
        const errorData = await response.json();
        setMessage('Ошибка поиска: ' + (errorData.message || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка поиска', error);
      setMessage('Не удалось выполнить поиск');
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setShowResults(false);
  };

  const handleSelectQuiz = (quiz) => {
    navigate(`/current-quiz-detail?quizId=${quiz.id}`);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSearchByChange = (value) => {
    setSearchBy(value);
    setQuery('');
    setResults([]);
    setMessage('');
    setShowDropdown(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-component">
      <div className="search-controls">
        <button onClick={toggleDropdown}>
          {searchBy === 'category' ? 'Искать по категории' : 'Искать по автору'}
        </button>
        {showDropdown && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <div onClick={() => handleSearchByChange('category')}>Искать по категории</div>
            <div onClick={() => handleSearchByChange('author')}>Искать по автору</div>
          </div>
        )}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Введите ${searchBy === 'category' ? 'название категории' : 'имя автора'}`}
        className="search-input"
      />
      {message && <p>{message}</p>}
      {showResults && (
        <div className="search-results">
          <ul>
            {searchBy === 'category' && categories.map((category) => (
              <li key={category.id}>
                <span onClick={() => handleSelectCategory(category)}>{category.name}</span>
                {selectedCategory && selectedCategory.id === category.id && (
                  <ul>
                    {category.quizzes.map((quiz) => (
                      <li key={quiz.id} onClick={() => handleSelectQuiz(quiz)}>
                        {quiz.name}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            {searchBy === 'author' && authors.map((author) => (
              <li key={author.id} onClick={() => handleSelectQuiz(author)}>
                {author.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
