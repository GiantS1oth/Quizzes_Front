import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles.css';
import ProfileContainer from '../../components/ProfileContainer/ProfileContainer';

function TestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const quizId = query.get('quizId');
  const startTest = query.get('startTest') === 'true';

  const [folderName, setFolderName] = useState('');
  const [categoryName, setCategoryName] = useState(''); 
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

        
        const quizResponse = await fetch(`http://localhost:8192/quizzes/api/v1/quizzes/run?quiz_id=${quizId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!quizResponse.ok) {
          throw new Error('Ошибка получения вопросов');
        }

        const quizData = await quizResponse.json();
        setFolderName(quizData.folderName || '');
        setQuestions(quizData.questions || []);
        setRoundId(quizData.roundId || null);
        
        if (startTest) {
          timerRef.current = setInterval(() => {
            setElapsedTime(prevTime => prevTime + 1);
          }, 1000);
        }

        
        const categoryResponse = await fetch(`http://localhost:8192/quizzes/api/v1/quizzes/getQuizById?quiz_id=${quizId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!categoryResponse.ok) {
          throw new Error('Ошибка получения информации о категории');
        }

        const categoryData = await categoryResponse.json();
        setCategoryName(categoryData.categoryName || ''); 

        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        alert('Не удалось загрузить данные.');
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
      setFeedback(
        <>
          Поздравляем вы прошли тест!<br />
          Продолжительность: {formatDuration(elapsedTime)}<br />
          Счет: {result.score}
        </>
      );
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

  if (isTestFinished) {
    return (
      <div className='finish-page'>
        <div className='header-wrapper-myquizzes'>
        
        </div>
      <div className='test-finished'>
        <h1>{folderName}</h1>
        <p>{feedback}</p>
        <button onClick={handleFinishTest}>Вернуться к деталям теста</button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <></>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const returnBack = () => {
    navigate(`/current-quiz-detail?quizId=${quizId}`);
  };

 

  return (
    <div>
      <div className='header-wrapper-myquizzes'>
        <h1>{folderName}</h1>
      </div>
      <ProfileContainer /> 
      
      <div className='test-page-container'>
        <button className='return-button' onClick={returnBack}></button>
        <div className='question-text-container'>
          <h1 className='question-number-text'>Вопрос: {currentQuestionIndex + 1}</h1>
          <div className='div-category-for'>{categoryName}</div>
          <p className='questin-text-inside'>{currentQuestion.questionText}</p>
        </div>
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
                <span>{currentQuestion.text1}</span>
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
                <span>{currentQuestion.text2}</span>
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
                <span>{currentQuestion.text3}</span>
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
                <span>{currentQuestion.text4}</span>
              </label>
            </div>
          </div>
        </div>
        {currentQuestion.image && <img src={currentQuestion.image} alt="Question" />}
        <button className='test-answer-button' onClick={handleSubmitAnswer}>
          {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Ответить'}
        </button>
      </div>
    </div>
  );
};

export default TestPage;
