import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';

const CurrentQuizDetailed = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentAuthorId, setCurrentAuthorId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const quizId = query.get('quizId');
  const token = localStorage.getItem('token');

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
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка получения данных теста');
        }

        const quizData = await response.json();
        setQuiz(quizData);

        
        const authorIdFromData = quizData.authorId; 
        setCurrentAuthorId(authorIdFromData);
        
      } catch (error) {
        console.error('Ошибка при загрузке деталей теста:', error);
        alert('Не удалось загрузить детали теста.');
      }
    };

    fetchQuizDetails();
  }, [quizId, token]);

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
  }
 
  return (
    <div>
      <div className='header-wrapper-myquizzes'></div>
      <div className='profile-container'>
          <h1 id="username">Привет, {localStorage.getItem('username') || 'Гость'}!</h1>
          <button onClick={handleLogout}>Выход</button>
        </div>
      <div className='quiz-detailed-container'>
      <button className='return-button' onClick={returnToQuizzes}></button>
      {quiz ? (
        <div className='quiz-inside-detailed'>
          <h1 id="quiz-name" className='quiz-name-detailed-quiz'>{quiz.name}</h1>
          <p id="quiz-description" className='quiz-description-detailed-quiz'>{quiz.description}</p>
          {quiz.authorId === currentAuthorId && (
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
