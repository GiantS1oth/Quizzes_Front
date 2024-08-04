import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Путь к стилям
import GetTop20Categories from '../../components/GetTop20Categories/GetTop20Categories';
import SearchDialog from '../../components/SearchDialog/SearchDialog';

function Quizzes() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const showFavorites = () => {
    navigate('/favorites');
  };

  const showMyQuizzes = () => {
    navigate('/myQuizzes');
  };

  const addNewQuiz = () => {
    navigate('/createQuiz');
  };

  const openSearchDialog = () => {
    setShowDialog(true);
  };

  const closeSearchDialog = () => {
    setShowDialog(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setDialogData([]);
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
        setDialogData(data);
        openSearchDialog(); 
      } else {
        const errorData = await response.json();
        console.error('Ошибка поиска:', errorData.message || 'Неизвестная ошибка');
      }
    } catch (error) {
      console.error('Ошибка поиска:', error);
    }
  };

  return (
    <div>
      <header id="header">
        <h1 id="username">Привет, {localStorage.getItem('username') || 'Гость'}!</h1>
        <div id="buttons-container">
          <button onClick={showFavorites}>Избранное</button>
          <button onClick={showMyQuizzes}>Мои</button>
          <button onClick={addNewQuiz}>Добавить новый тест</button>
        </div>
      </header>
      <main id="content">
        <input
          type="text"
          placeholder="Введите запрос для поиска"
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;
            setSearchQuery(value);
            handleSearch(value); 
          }}
          className="search-input"
        />
        <SearchDialog 
          show={showDialog} 
          onClose={closeSearchDialog} 
          onSearch={handleSearch} 
          data={dialogData}
        />
        <div>
          <GetTop20Categories />
        </div>
      </main>
    </div>
  );
}

export default Quizzes;
