import React from 'react';

const FavoriteButton = ({ quizId, isFavorite, onToggleFavorite }) => {

  const handleClick = (event) => {
    event.stopPropagation();
    onToggleFavorite(quizId, isFavorite);
  };

  return (
    <button
      className={`add-favorites-button ${isFavorite ? 'active' : ''}`}
      onClick={handleClick}
    >
    </button>
  );
};

export default FavoriteButton;
