import React from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import styles from './LoginPage.module.css'; 

function LoginPage() {
  return (
    <div className={`${styles.loginPageContainer} ${styles.customBackground}`}>
      <div className={styles.logininfoContainer}>
        <img src="/Assets/Вход.svg" alt="Description" className={styles.image} />
        <p className={styles.text}>Введите ваше имя пользователя и пароль для входа.</p>
      </div>
      <div className={styles.loginformContainer}>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;