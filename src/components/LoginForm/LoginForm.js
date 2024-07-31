import React, { useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 



    try {
      const response = await fetch('http://localhost:8192/quizzes/api/v1/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        navigate('/quizzes');
      } else {
        setError(`Ошибка авторизации: ${data.message}`);
      }
    } catch (err) {
      setError(`Ошибка сети: ${err.message}`);
    }
  };

  return (
    <div className="container">
      <div className="logo">Логотип</div>
      {error && <p className="error">{error}</p>}
      <form id="loginForm" onSubmit={handleSubmit}>
        <input
          type="text"
          id="loginUsername"
          name="username"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          id="loginPassword"
          name="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default LoginForm;
