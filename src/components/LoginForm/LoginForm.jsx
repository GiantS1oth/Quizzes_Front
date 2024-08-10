import React, { useState } from 'react';
import styles from "./LoginForm.module.css"; 
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
    <div className={styles.logincontainer}>
      <div className={styles.relogLinks}>
        <a className={styles.loginLink} href="/login">Вход</a>
        <a className={styles.registerLink} href="/register">Регистрация</a>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <form id="loginForm" onSubmit={handleSubmit}>
        <p className={styles.paragraph}>Логин</p>
        <input
          type="text"
          id="loginUsername"
          className={styles.regInput}
          name="username"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <p className={styles.paragraph}>Пароль</p>
        <input
          type="password"
          id="loginPassword"
          className={styles.regInput}
          name="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.regButton}>Войти</button>
      </form>
    </div>
  );
}

export default LoginForm;
