import React, { useEffect, useState } from 'react';
import './styles.css';

function Token() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  return (
    <div className="container">
      <div className="logo">Логотип</div>
      <div id="tokenDisplay">
        Ваш токен: <span id="token">{token}</span>
      </div>
    </div>
  );
}

export default Token;
