import React, { useState, useEffect } from 'react';
import './styles.css'; 

const SearchDialog = ({ show, onClose, onSearch, data }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (show) {
      setQuery('');
    }
  }, [show]);

  useEffect(() => {
    if (query) {
      onSearch(query); 
    }
  }, [query, onSearch]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  if (!show) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Поиск Quizzes</h2>
        <input
          type="text"
          placeholder="Введите запрос"
          value={query}
          onChange={handleChange}
          className="search-input-inside"
        />
        <h3>Результаты поиска</h3>
        <ul>
          {data.length > 0 ? (
            data.map(item => (
              <li key={item.id}>
                <a href={`/current-quiz-detail?quizId=${item.id}`}>{item.name}</a>
              </li>
            ))
          ) : (
            <li>Нет результатов</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchDialog;
