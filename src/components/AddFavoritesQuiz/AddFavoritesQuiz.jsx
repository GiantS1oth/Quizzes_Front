import React, { useEffect } from 'react';

function AddFavoritesQuiz() {
  const quizId = new URLSearchParams(window.location.search).get('quizId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (quizId) {
      fetch(`http://localhost:8192/quizzes/api/v1/quizzes/addToFavorites?quiz_id=${quizId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка сети');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Ошибка:', error);
      });
    }
  }, [quizId, token]);

  return null;
}

export default AddFavoritesQuiz;

