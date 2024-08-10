import React, { useState } from 'react';
import styles from "./RegisterForm.module.css"; 
import { Link, useNavigate } from 'react-router-dom';

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
    <div className={styles.registercontainer}>
      <div className={styles.relogLinks}>
        <Link to={'/login'} className={styles.loginLink}>Вход</Link>
        <Link to={'/register'} className={styles.registerLink}>Регистрация</Link>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <form id="registerForm" onSubmit={handleSubmit}>
       <p className='paragraph'>Логин</p>
        <input
          type="text"
          id="username"
          className={styles.regInput}
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
       <p className='paragraph'>E-mail</p>
        <input
          type="email"
          id="email"
          className={styles.regInput}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <p className='paragraph'>Пароль</p>
        <input
          type="password"
          id="password"
          className={styles.regInput}
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.regButton}>Зарегистрироваться</button>
      </form>
    </div>
  );
}

export default RegisterForm;
