import React, { useState } from 'react';

function CreateCategory() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/createCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name }) 
      });

      if (response.ok) {
        setMessage('Категория успешно создана');
        setName(''); 
        console.log(response);
      } else {
        const errorData = await response.json();
        setMessage('Ошибка сохранения категории: ' + (errorData.message || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка создания категории', error);
      setMessage('Не удалось создать категорию');
    }
  };

  return (
    <div>
      <h2>Создать категорию</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Введите название категории"
      />
      <button onClick={handleCreateCategory}>Создать</button>
     
    </div>
  );
}

export default CreateCategory;
