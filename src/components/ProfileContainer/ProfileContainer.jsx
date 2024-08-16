import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../Pages/styles.css';

function ProfileContainer() {
  const [profilePicture, setProfilePicture] = useState(localStorage.getItem('profilePicture') || null);
  const [city, setCity] = useState(''); 
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const data = await response.json();
        setCity(data.city);
      } catch (error) {
        console.error('Ошибка при получении города:', error);
        setCity('Не удалось определить город');
      }
    };

    fetchCity();
  }, []); 

  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        localStorage.setItem('profilePicture', base64Image);
        setProfilePicture(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('profilePicture');
    navigate('/');
  };

  return (
    <div className='profile-container'>
      <div className='profile-picture'>
        {profilePicture && <img src={profilePicture} alt="Profile" />}
        <input
          type="file"
          id="profile-picture-input"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div
          className='change-picture-button'
          onClick={() => document.getElementById('profile-picture-input').click()}
        ></div>
      </div>
      <h1 id="username">Привет, {localStorage.getItem('username')}!</h1>
      <p className='city'>{city}</p> 
      <button className='profile-exit' onClick={handleLogout}>Выход</button>
    </div>
  );
}

export default ProfileContainer;
