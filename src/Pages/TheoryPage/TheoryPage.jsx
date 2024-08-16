import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles.css';
import ProfileContainer from '../../components/ProfileContainer/ProfileContainer';

function TheoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const quizId = query.get('quizId');
  const [isTokenValid, setIsTokenValid] = useState(true); 

  const [questions, setQuestions] = useState([]);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8192/quizzes/api/v1/quizzes/getCardsByQuizId?quiz_id=${quizId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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

  const returnBack = () => {
    navigate(`/current-quiz-detail?quizId=${quizId}`);
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
      <ProfileContainer /> 

      
      <div className='card-container'>
      <button className='return-button' onClick={returnBack}></button>
        {loading ? (
          <></>
        ) : error ? (
          <p>Ошибка: {error}</p>
          ) : questions.length > 0 ? (
              <div className='question-theory-card-wrapper'>
          <div className='question-theory-card-container'>
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`question-theory-card ${expandedQuestionIndex === index ? 'expanded' : ''}`}
                onClick={() => toggleQuestion(index)}
              >
                <p style={{ margin: 0 }}>Вопрос {index + 1}</p>
                {expandedQuestionIndex === index && (
                  <div>
                    <p style={{ marginTop: '5px' }}>{question.questionText}</p>
                    <p style={{ marginTop: '5px' }}>Правильный ответ: {question.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          </div>
        ) : (
          <p>Вопросы не найдены.</p>
        )}
      </div>
      <button className='finish-button' onClick={returnBack}>Завершить</button>
    </div>
  );
}

export default TheoryPage;
