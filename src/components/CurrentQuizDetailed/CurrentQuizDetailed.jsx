import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';
import ProfileContainer from '../../components/ProfileContainer/ProfileContainer';

const CurrentQuizDetailed = () => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

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
        setQuiz(quizData);

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setIsFavorite(favorites.includes(quizId));
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

  const toggleFavorite = async () => {
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

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Ошибка:', error);
      alert(`Ошибка изменения статуса теста: ${error.message}`);
    }
  };

  return (
    <div>
      <div className='header-wrapper-myquizzes'></div>
      <ProfileContainer /> 
      <div className='quiz-detailed-container'>
        <button className='return-button' onClick={returnToQuizzes}></button>
        {quiz ? (
          <div className='quiz-inside-detailed'>
            <h1 id="quiz-name" className='quiz-name-detailed-quiz'>{quiz.name}</h1>
            <div className='favorites-button-qd'>
              <button
                className={`add-favorites-button ${isFavorite ? 'active' : ''}`}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleFavorite();
                }}
              >
              </button>
            </div>
            <div className='div-category-for-currentquiz'>{quiz.categoryName}</div>
            
            <div className='displayed-questions-wrapper'>
              <div className='displayed-questions'>
                {questions.length > 0 ? (
                  questions.map((question, index) => (
                    <div
                      key={question.id}
                      className={`question-item ${expandedQuestionIndex === index ? 'expanded' : ''}`}
                      onClick={() => toggleQuestion(index)}
                    >
                      <p style={{ margin: 0 }}>Вопрос {index + 1}</p>
                      {expandedQuestionIndex === index && (
                        <div className='question-details'>
                          <p style={{ marginTop: '5px' }}>{question.questionText}</p>
                         
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>
            {quiz.authorName === username && (
              <div id="add-questions-button" className='add-questions-button' onClick={() => navigate(`/addQuestion?quizId=${quizId}`)}>Добавить вопросы</div>
            )}
            <div className='moving-right'>
            <button onClick={openTheory}>Теория</button>
              <button onClick={startQuiz}>Пройти тест</button>
              </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CurrentQuizDetailed;
