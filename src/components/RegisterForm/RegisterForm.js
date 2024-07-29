import React, { useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      const response = await fetch('http://localhost:8192/quizzes/api/v1/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        navigate('/login');
      } else {
        setError(`Ошибка регистрации: ${data.message}`);
      }
    } catch (err) {
      setError(`Ошибка сети: ${err.message}`);
    }
  };

  return (
    <div className="container">
      <h1>Регистрация</h1>
      {error && <p className="error">{error}</p>}
      <form id="registerForm" onSubmit={handleSubmit}>
        <input
          type="text"
          id="username"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}

export default RegisterForm;
