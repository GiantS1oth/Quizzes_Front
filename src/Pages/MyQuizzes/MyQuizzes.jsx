import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [message, setMessage] = useState('');
  const [city, setCity] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); 
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    
    const savedProfilePicture = localStorage.getItem('profilePicture');
    if (savedProfilePicture) {
      setProfilePicture(savedProfilePicture);
    }

    const fetchQuizzes = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/getAllMyQuiz', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        const favoritesFromStorage = JSON.parse(localStorage.getItem('favorites')) || [];
        const quizzesWithFavorites = data.map(quiz => ({
          ...quiz,
          isFavorite: favoritesFromStorage.includes(quiz.id)
        }));
        setQuizzes(quizzesWithFavorites);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const data = await response.json();
        setCity(data.city);
      } catch (error) {
        console.error('Ошибка при получении города:', error);
        setCity('Не удалось определить город');
      }
    };

    fetchCity();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        localStorage.setItem('profilePicture', base64Image);
        setProfilePicture(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate(`/`);
  };

  const openQuizDetail = (quizId) => {
    navigate(`/current-quiz-detail?quizId=${quizId}`);
  };

  const toggleFavorite = async (quizId, isFavorite) => {
    const token = localStorage.getItem('token');
    const url = isFavorite
        ? `http://localhost:8192/quizzes/api/v1/quizzes/deleteFromFavoritesByQuizId?quiz_id=${quizId}`
        : `http://localhost:8192/quizzes/api/v1/quizzes/addToFavorites?quiz_id=${quizId}`;
    const method = isFavorite ? 'DELETE' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка сети: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const updatedFavorites = isFavorite
          ? JSON.parse(localStorage.getItem('favorites')).filter(id => id !== quizId)
          : [...(JSON.parse(localStorage.getItem('favorites')) || []), quizId];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

      setQuizzes(prevQuizzes =>
          prevQuizzes.map(quiz =>
              quiz.id === quizId ? { ...quiz, isFavorite: !isFavorite } : quiz
          )
      );

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage(`Ошибка изменения статуса теста: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const returnBack = () => {
    navigate('/quizzes');
  };

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
        <div className='profile-container'>
          <div className='profile-picture'>
            {profilePicture && <img src={profilePicture} alt="Profile" />}
            <input
                type="file"
                id="profile-picture-input"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <div
                className='change-picture-button'
                onClick={() => document.getElementById('profile-picture-input').click()}
            >

            </div>
          </div>
          <h1 id="username">Привет, {localStorage.getItem('username')}!</h1>
          <p className='city'>{city}</p>
          <button className='profile-exit' onClick={handleLogout}>Выход</button>
        </div>
        <div id="quizzes-list" className='quizzes-list'>
          <button className='return-button' onClick={returnBack}></button>
          <div className='tests-icon'></div>
          <div className='quiz-items'>
            {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                    <div key={quiz.id} className="quiz-item" onClick={() => openQuizDetail(quiz.id)}>
                      <p>{quiz.name}</p>
                      <div className='div-category'>{quiz.categoryName}</div>
                      <button
                          className={`add-favorites-button ${quiz.isFavorite ? 'active' : ''}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleFavorite(quiz.id, quiz.isFavorite);
                          }}
                      ></button>
                    </div>
                ))
            ) : (
                <></>
            )}
          </div>
        </div>
        {message && <p>{message}</p>}
      </div>
  );
}

export default MyQuizzes;
