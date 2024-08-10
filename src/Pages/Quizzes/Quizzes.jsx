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

  const handleLoout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate(`/`);
  }

  return (
    
    <div>
      <div className='header-wrapper'>
        <div className='cabinet'></div>
      </div>
        <div className='profile-container'>
        <h1 id="username">Привет, {localStorage.getItem('username') || 'Гость'}!</h1>
        <button onClick={handleLoout}>Выход</button>
        </div>
        <div id="buttons-container" className='buttons-container'>
          <button className="button my-quizzes-button" onClick={showMyQuizzes}></button>
        
          <button className="button favorites-button" onClick={showFavorites}></button>
          
          <button className="button add-quiz-button" onClick={addNewQuiz}>Добавить новый тест</button>
</div>
        <div className='top20'> 
         
          <div>
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
           <GetTop20Categories />
          </div>
        </div>
     
    </div>
  );
}

export default Quizzes;
