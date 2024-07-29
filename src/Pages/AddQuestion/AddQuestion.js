import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles.css';

const AddQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const quizId = query.get('quizId');

  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState({ text1: '', text2: '', text3: '', text4: '' });
  const [rightAnswer, setRightAnswer] = useState('');
  const [image, setImage] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);

  useEffect(() => {
    // Загружаем количество вопросов из localStorage, если это необходимо
    // В данном случае мы обошли localStorage
  }, [quizId]);

  // Функция для отправки вопроса на сервер
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
        console.log('Question successfully saved');
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

  // Функция для обработки кнопки "Далее"
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (questionText.trim() === '' || rightAnswer === '') {
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
      // Переход на следующий вопрос
      setQuestionText('');
      setAnswers({ text1: '', text2: '', text3: '', text4: '' });
      setRightAnswer('');
      setImage('');
      setQuestionNumber(questionNumber + 1);
    }
  };

  // Функция для обработки кнопки "Сохранить и вернуться"
  const handleSaveAndReturn = async (e) => {
    e.preventDefault();

    if (questionText.trim() === '' || rightAnswer === '') {
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
      // Переход на страницу с деталями квиза
      navigate(`/current-quiz-detail?quizId=${quizId}`);
    }
  };

  return (
    <div className="container">
      <h1 id="question-header">Вопрос {questionNumber}</h1>
      <form id="addQuestionForm" onSubmit={handleSubmit}>
        <input 
          type="text" 
          id="questionText" 
          placeholder="Текст вопроса" 
          value={questionText} 
          onChange={(e) => setQuestionText(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          id="answer1" 
          placeholder="Ответ 1" 
          value={answers.text1} 
          onChange={(e) => setAnswers({ ...answers, text1: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          id="answer2" 
          placeholder="Ответ 2" 
          value={answers.text2} 
          onChange={(e) => setAnswers({ ...answers, text2: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          id="answer3" 
          placeholder="Ответ 3" 
          value={answers.text3} 
          onChange={(e) => setAnswers({ ...answers, text3: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          id="answer4" 
          placeholder="Ответ 4" 
          value={answers.text4} 
          onChange={(e) => setAnswers({ ...answers, text4: e.target.value })} 
          required 
        />
        <div>
          <label>
            <input 
              type="radio" 
              name="rightAnswer" 
              value="1" 
              checked={rightAnswer === '1'} 
              onChange={(e) => setRightAnswer(e.target.value)} 
            /> 
            Правильный
          </label>
          <label>
            <input 
              type="radio" 
              name="rightAnswer" 
              value="2" 
              checked={rightAnswer === '2'} 
              onChange={(e) => setRightAnswer(e.target.value)} 
            /> 
            Правильный
          </label>
          <label>
            <input 
              type="radio" 
              name="rightAnswer" 
              value="3" 
              checked={rightAnswer === '3'} 
              onChange={(e) => setRightAnswer(e.target.value)} 
            /> 
            Правильный
          </label>
          <label>
            <input 
              type="radio" 
              name="rightAnswer" 
              value="4" 
              checked={rightAnswer === '4'} 
              onChange={(e) => setRightAnswer(e.target.value)} 
            /> 
            Правильный
          </label>
        </div>
        <input 
          type="text" 
          id="image" 
          placeholder="URL картинки" 
          value={image} 
          onChange={(e) => setImage(e.target.value)} 
        />
        <button type="submit">Далее</button>
        <button id="save-button" onClick={handleSaveAndReturn}>Сохранить и вернуться</button>
      </form>
    </div>
  );
};

export default AddQuestion;
