import React, { useState, useEffect, useRef } from 'react';
import './styles.css'; 

const SearchDialog = ({ show, onClose, onSearch, data }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null); 

  useEffect(() => {
    if (show) {
      setQuery('');
      
      if (inputRef.current) {
        inputRef.current.focus();
      }
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
          ref={inputRef} 
        />
        <h3>Результаты поиска</h3>
        <ul >
          {data.length > 0 ? (
            data.map(item => (
              <div className='search-list' key={item.id}>
                <a href={`/current-quiz-detail?quizId=${item.id}`}>{item.name}</a>
              </div>
            ))
          ) : (
            <></>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchDialog;
