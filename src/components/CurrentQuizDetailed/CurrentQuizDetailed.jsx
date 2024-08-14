import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';

const CurrentQuizDetailed = () => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null);
  const [isFavoriteButtonVisible, setIsFavoriteButtonVisible] = useState(true); 

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const quizId = query.get('quizId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!quizId) {
        alert('ID теста не найден.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8192/quizzes/api/v1/quizzes/getQuizById?quiz_id=${quizId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка получения данных теста');
        }

        const quizData = await response.json();
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setQuiz({
          ...quizData,
          isFavorite: favorites.includes(quizId),
        });

      } catch (error) {
        console.error('Ошибка при загрузке деталей теста:', error);
        alert('Не удалось загрузить детали теста.');
      }
    };

    fetchQuizDetails();
  }, [quizId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8192/quizzes/api/v1/quizzes/getCardsByQuizId?quiz_id=${quizId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Неизвестная ошибка');
        }
      } catch (error) {
        console.error('Ошибка при загрузке вопросов:', error);
        setError('Не удалось загрузить вопросы.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  const toggleQuestion = (index) => {
    setExpandedQuestionIndex(expandedQuestionIndex === index ? null : index);
  };

  const openTheory = () => {
    if (!quizId) {
      alert('ID теста не найден.');
      return;
    }
    navigate(`/theory?quizId=${quizId}`);
  };

  const startQuiz = () => {
    if (!quizId) {
      alert('ID теста не найден.');
      return;
    }
    navigate(`/test?quizId=${quizId}&startTest=true`);
  };

  const returnToQuizzes = () => {
    navigate(`/myQuizzes`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate(`/`);
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

     
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const updatedFavorites = isFavorite
        ? favorites.filter(id => id !== quizId)
        : [...favorites, quizId];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

     
      setQuiz(prevQuiz => ({
        ...prevQuiz,
        isFavorite: !isFavorite,
      }));

      
      setIsFavoriteButtonVisible(false);

      setMessage(isFavorite ? 'Тест удален из избранного.' : 'Тест добавлен в избранное.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage(`Ошибка изменения статуса теста: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div>
      <div className='header-wrapper-myquizzes'></div>
      <div className='profile-container'>
        <h1 id="username">Привет, {username}!</h1>
        <button onClick={handleLogout}>Выход</button>
      </div>
      <div className='quiz-detailed-container'>
        <button className='return-button' onClick={returnToQuizzes}></button>
        {quiz ? (
          <div className='quiz-inside-detailed'>
            <h1 id="quiz-name" className='quiz-name-detailed-quiz'>{quiz.name}</h1>
            <div className='favorites-button-qd'>
              {isFavoriteButtonVisible && (
                <button
                  className={`add-favorites-button ${quiz.isFavorite ? 'active' : ''}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite(quiz.id, quiz.isFavorite);
                  }}
                >
                </button>
              )}
            </div>
            <div className='div-category-for-currentquiz'>{quiz.categoryName}</div>

            <div className='displayed-questions'>
              {loading ? (
                <></>
              ) : error ? (
                <p>Ошибка: {error}</p>
              ) : questions.length > 0 ? (
                questions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`question-item ${expandedQuestionIndex === index ? 'expanded' : ''}`}
                    onClick={() => toggleQuestion(index)}
                  >
                    <p style={{ margin: 0 }}>Вопрос {index + 1}</p>
                    {expandedQuestionIndex === index && (
                      <p style={{ marginTop: '5px' }}>{question.questionText}</p>
                    )}
                  </div>
                ))
              ) : (
                <p>Нет вопросов.</p>
              )}
            </div>
            {quiz.authorName === username && (
              <div id="add-questions-button" className='add-questions-button' onClick={() => navigate(`/addQuestion?quizId=${quizId}`)}>Добавить вопросы</div>
            )}
            <button onClick={openTheory}>Теория</button>
            <button onClick={startQuiz}>Пройти тест</button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CurrentQuizDetailed;
