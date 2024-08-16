import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import '../styles.css'; 
import GetTop20Categories from '../../components/GetTop20Categories/GetTop20Categories';
import SearchDialog from '../../components/SearchDialog/SearchDialog';
import ProfileContainer from '../../components/ProfileContainer/ProfileContainer';

function Quizzes() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsTokenValid(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/checkToken', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          setIsTokenValid(false);
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        } else {
          setIsTokenValid(true);
        }
      } catch (error) {
        console.error('Ошибка проверки токена:', error);
        setIsTokenValid(false);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      }
    };

    checkToken();
  }, []);

  const showFavorites = () => {
    navigate('/favorites');
  };

  const showMyQuizzes = () => {
    navigate('/myQuizzes');
  };

  const addNewQuiz = () => {
    if (!isTokenValid) {
      alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
      navigate('/'); 
      return;
    }
    navigate('/createQuiz'); 
  };

  const openSearchDialog = () => {
    setSearchQuery(''); 
    setShowDialog(true);
  };

  const closeSearchDialog = () => {
    setShowDialog(false);
  };

  
  const debouncedSearch = _.debounce(async (query) => {
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
  }, 300); 

  const handleSearch = (query) => {
    debouncedSearch(query);
  };

  return (
    <div>
      <div className='header-wrapper'>
        <div className='header-container'>
          <div className='cabinet'></div>
          <h1 onClick={showMyQuizzes}>Мои Тесты</h1>
          <h1 onClick={showFavorites}>Избранное</h1>
          <h1 onClick={addNewQuiz}>Создать тест</h1>
        </div>
      </div>
      <ProfileContainer /> 
      <div id="buttons-container" className='buttons-container'>
        <button className="button my-quizzes-button" onClick={showMyQuizzes}
          disabled={!isTokenValid}
        ></button>
        <button className="button favorites-button" onClick={showFavorites}
          disabled={!isTokenValid}
        ></button>
        <button
          className="button add-quiz-button"
          onClick={addNewQuiz}
          disabled={!isTokenValid} 
        >
          Добавить новый тест
        </button>
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
          <div className='category-button-container'>
            <GetTop20Categories />
          </div>    
        </div>
      </div>
    </div>
  );
}

export default Quizzes;
