import React, { useEffect } from 'react';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import styles from './RegisterPage.module.css'; 

function RegisterPage() {
  return (
    <div className={styles.customBackground}>
      <div className={styles.registerPageContainer}>
        <div className={styles.infoContainer}>
          <img src="/Assets/Регистрация.svg" alt="Description" className={styles.image} />
          <p className={styles.text}>Придумайте имя пользователя, используйте Ваш e-mail и пароль.</p>
        </div>
        <div className={styles.formContainer}>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;