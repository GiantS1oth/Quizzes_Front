import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles.css';

const TestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const quizId = query.get('quizId');
  const startTest = query.get('startTest') === 'true'; 

  const [folderName, setFolderName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [roundId, setRoundId] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0); 
  const timerRef = useRef(null); 

  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8192/quizzes/api/v1/quizzes/run?quiz_id=${quizId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка получения вопросов');
        }

        const data = await response.json();
        setFolderName(data.folderName);
        setQuestions(data.questions);
        setRoundId(data.roundId);
        setLoading(false);
        
        if (startTest) {
          timerRef.current = setInterval(() => {
            setElapsedTime(prevTime => prevTime + 1);
          }, 1000);
        }
      } catch (error) {
        console.error('Ошибка при загрузке вопросов:', error);
        alert('Не удалось загрузить вопросы.');
        setLoading(false);
      }
    };

    fetchQuizData();
    return () => clearInterval(timerRef.current);
  }, [quizId, startTest]);

  const handleAnswerSelect = (answerNumber) => {
    setSelectedAnswer(answerNumber);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      alert('Пожалуйста, выберите ответ.');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    setAnswers(prevAnswers => [
      ...prevAnswers,
      {
        questionId: currentQuestion.id,
        userChoice: selectedAnswer
      }
    ]);

    setSelectedAnswer(null); 

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    try {
      clearInterval(timerRef.current); 
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/finish', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roundId: roundId,
          roundDetailDTOList: answers
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ошибка завершения теста: ${errorData.message}`);
      }

      const result = await response.json();
      setFeedback(`Тест завершен!  Продолжительность: ${formatDuration(elapsedTime)}. Счет: ${result.score}`);
      setIsTestFinished(true);
    } catch (error) {
      console.error('Ошибка при завершении теста:', error);
      alert('Не удалось завершить тест.');
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishTest = () => {
    navigate(`/current-quiz-detail?quizId=${quizId}`);
  };

  if (loading) {
    return <></>
  }

  if (isTestFinished) {
    return (
      <div>
        <h1>{folderName}</h1>
        <p>{feedback}</p>
        <button onClick={handleFinishTest}>Вернуться к деталям теста</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p>Нет вопросов для отображения</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const returnBack = () => {
    navigate(`/current-quiz-detail?quizId=${quizId}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate(`/`);
  }

  return (
    <div >
      <div className='header-wrapper-myquizzes'></div>
      <div className='profile-container'>
          <h1 id="username">Привет, {localStorage.getItem('username')}!</h1>
          <button onClick={handleLogout}>Выход</button>
      </div>
      
      <div className='test-page-container'>
      <button className='return-button' onClick={returnBack}></button>
        <h1>{folderName}</h1>
        <p>{currentQuestion.questionText}</p>
        <div className="radio-columns">
          <div className="column">
            <div>
              <input 
                className="choose-button"
                type="radio" 
                id="answer1"
                value="1" 
                checked={selectedAnswer === '1'} 
                onChange={() => handleAnswerSelect('1')} 
              />
              <label className="custom-radio-label" htmlFor="answer1">
                {currentQuestion.text1}
              </label>
            </div>
            <div>
              <input 
                className="choose-button"
                type="radio" 
                id="answer2"
                value="2" 
                checked={selectedAnswer === '2'} 
                onChange={() => handleAnswerSelect('2')} 
              />
              <label className="custom-radio-label" htmlFor="answer2">
                {currentQuestion.text2}
              </label>
            </div>
          </div>
          <div className="column">
            <div>
              <input 
                className="choose-button"
                type="radio" 
                id="answer3"
                value="3" 
                checked={selectedAnswer === '3'} 
                onChange={() => handleAnswerSelect('3')} 
              />
              <label className="custom-radio-label" htmlFor="answer3">
                {currentQuestion.text3}
              </label>
            </div>
            <div>
              <input 
                className="choose-button"
                type="radio" 
                id="answer4"
                value="4" 
                checked={selectedAnswer === '4'} 
                onChange={() => handleAnswerSelect('4')}
              />
              <label className="custom-radio-label" htmlFor="answer4">
                {currentQuestion.text4}
              </label>
            </div>
          </div>
        </div>
        {currentQuestion.image && <img src={currentQuestion.image} alt="Question" />}
        <button onClick={handleSubmitAnswer}>Ответить</button>
      </div>
    </div>
  );
};

export default TestPage;
