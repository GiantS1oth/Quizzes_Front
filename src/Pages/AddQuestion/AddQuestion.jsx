import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileContainer from '../../components/ProfileContainer/ProfileContainer';
import '../styles.css'; // Убедитесь, что путь к стилям правильный

function AddQuestion() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const quizId = query.get('quizId');
  const [isTokenValid, setIsTokenValid] = useState(true);

  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState({ text1: '', text2: '', text3: '', text4: '' });
  const [rightAnswer, setRightAnswer] = useState('');
  const [image, setImage] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);

  useEffect(() => {}, [quizId]);

  const handleSendQuestion = async (newQuestion) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/createQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newQuestion)
      });

      if (response.ok) {
        console.log('Вопрос успешно сохранён');
        return true;
      } else {
        const errorData = await response.json();
        alert('Ошибка сохранения вопроса: ' + (errorData.message || 'Неизвестная ошибка'));
        return false;
      }
    } catch (error) {
      console.error('Ошибка при сохранении вопроса:', error);
      alert('Не удалось сохранить вопрос.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      questionText.trim() === '' ||
      rightAnswer === '' ||
      answers.text1.trim() === '' ||
      answers.text2.trim() === '' ||
      answers.text3.trim() === '' ||
      answers.text4.trim() === ''
    ) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    const newQuestion = {
      quizId: parseInt(quizId, 10),
      questionText,
      text1: answers.text1,
      text2: answers.text2,
      text3: answers.text3,
      text4: answers.text4,
      image,
      rightAnswer: parseInt(rightAnswer, 10)
    };

    const success = await handleSendQuestion(newQuestion);
    
    if (success) {
      setQuestionText('');
      setAnswers({ text1: '', text2: '', text3: '', text4: '' });
      setRightAnswer('');
      setImage('');
      setQuestionNumber(questionNumber + 1);
    }
  };

  const handleSaveAndReturn = async (e) => {
    e.preventDefault();

    if (
      questionText.trim() === '' ||
      rightAnswer === '' ||
      answers.text1.trim() === '' ||
      answers.text2.trim() === '' ||
      answers.text3.trim() === '' ||
      answers.text4.trim() === ''
    ) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    const newQuestion = {
      quizId: parseInt(quizId, 10),
      questionText,
      text1: answers.text1,
      text2: answers.text2,
      text3: answers.text3,
      text4: answers.text4,
      image,
      rightAnswer: parseInt(rightAnswer, 10)
    };

    const success = await handleSendQuestion(newQuestion);

    if (success) {
      navigate(`/current-quiz-detail?quizId=${quizId}`);
    }
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
      <div className='add-question-container'>
        <button className='return-button' onClick={returnBack}></button>
        <h1 id="question-header">Новый вопрос</h1>
        <form id="addQuestionForm" onSubmit={handleSubmit}>
          <input 
            type="text" 
            id="questionText" 
            className="input-field question-text" 
            placeholder="Текст вопроса" 
            value={questionText} 
            onChange={(e) => setQuestionText(e.target.value)} 
            required 
          />
          <div className="answer-grid">
            <div className="answer-item">
              <input 
                type="text" 
                id="answer1" 
                className="input-field answer-input" 
                placeholder="Ответ 1" 
                value={answers.text1} 
                onChange={(e) => setAnswers({ ...answers, text1: e.target.value })} 
                required 
              />
              <input 
                type="radio" 
                id="radioAnswer1" 
                name="rightAnswer" 
                value="1" 
                checked={rightAnswer === '1'} 
                onChange={(e) => setRightAnswer(e.target.value)} 
                className="custom-radio-button"
              />
              <label className="custom-radio-label-new" htmlFor="radioAnswer1">
                <span></span>
              </label>
            </div>
            <div className="answer-item">
              <input 
                type="text" 
                id="answer2" 
                className="input-field answer-input" 
                placeholder="Ответ 2" 
                value={answers.text2} 
                onChange={(e) => setAnswers({ ...answers, text2: e.target.value })} 
                required 
              />
              <input 
                type="radio" 
                id="radioAnswer2" 
                name="rightAnswer" 
                value="2" 
                checked={rightAnswer === '2'} 
                onChange={(e) => setRightAnswer(e.target.value)} 
                className="custom-radio-button"
              />
              <label className="custom-radio-label-new" htmlFor="radioAnswer2">
                <span></span>
              </label>
            </div>
            <div className="answer-item">
              <input 
                type="text" 
                id="answer3" 
                className="input-field answer-input" 
                placeholder="Ответ 3" 
                value={answers.text3} 
                onChange={(e) => setAnswers({ ...answers, text3: e.target.value })} 
                required 
              />
              <input 
                type="radio" 
                id="radioAnswer3" 
                name="rightAnswer" 
                value="3" 
                checked={rightAnswer === '3'} 
                onChange={(e) => setRightAnswer(e.target.value)} 
                className="custom-radio-button"
              />
              <label className="custom-radio-label-new" htmlFor="radioAnswer3">
                <span></span>
              </label>
            </div>
            <div className="answer-item">
              <input 
                type="text" 
                id="answer4" 
                className="input-field answer-input" 
                placeholder="Ответ 4" 
                value={answers.text4} 
                onChange={(e) => setAnswers({ ...answers, text4: e.target.value })} 
                required 
              />
              <input 
                type="radio" 
                id="radioAnswer4" 
                name="rightAnswer" 
                value="4" 
                checked={rightAnswer === '4'} 
                onChange={(e) => setRightAnswer(e.target.value)} 
                className="custom-radio-button"
              />
              <label className="custom-radio-label-new" htmlFor="radioAnswer4">
                <span></span>
              </label>
            </div>
          </div>
          <div className='functional-buttons'>
          <button type="submit" className="submit-button">Далее</button>
            <button type="button" id="save-button" onClick={handleSaveAndReturn} className="save-and-return-button">Сохранить и вернуться</button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default AddQuestion;
