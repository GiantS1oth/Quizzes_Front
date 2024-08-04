import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

import GetTop20Categories from '../../components/GetTop20Categories/GetTop20Categories';






function Quizzes() {
  const navigate = useNavigate();

  const showFavorites = () => {
    navigate('/favorites');
  };

  const showMyQuizzes = () => {
    navigate('/myQuizzes');
  };

  const addNewQuiz = () => {
    navigate('/createQuiz');
  };

   
  
  if (!localStorage.getItem('username')) {
    navigate('/login')
  }

  return (
    
    <div>
      <header id="header">
        <h1 id="username">Привет, {localStorage.getItem('username') || 'Гость'}!</h1>
        <div id="buttons-container">
          <button onClick={showFavorites}>Избранное</button>
          <button onClick={showMyQuizzes}>Мои</button>
          <button onClick={addNewQuiz}>Добавить новый тест</button>
        </div>
      </header>
      <main id="content">
       
          <GetTop20Categories/>
        
      </main>
    </div>
  );
}

export default Quizzes;
