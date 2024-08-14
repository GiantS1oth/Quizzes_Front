import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const CreateNewQuiz = () => {
  const [formData, setFormData] = useState({ name: '', description: '', category: '', selectedCategory: null });
  const [currentStep, setCurrentStep] = useState(1);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleSearch = async (query) => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8192/quizzes/api/v1/quizzes/searchByCategories?category_name=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setFormData(prevState => ({
          ...prevState,
          selectedCategory: data.length > 0 ? data[0] : null
        }));
      } else {
        const errorData = await response.json();
        setMessage('Ошибка поиска категории: ' + (errorData.message || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка поиска категории', error);
      setMessage('Не удалось выполнить поиск категории');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(formData.category);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.category]);

  const handleSelectCategory = (categoryItem) => {
    setFormData(prevState => ({
      ...prevState,
      category: categoryItem.name,
      selectedCategory: categoryItem
    }));
    setResults([]);
    setShowResults(false);
  };

  const createCategory = async (categoryName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/createCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: categoryName })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Категория успешно создана');
        return data.id; // Возвращаем ID созданной категории
      } else {
        const errorData = await response.json();
        setMessage('Ошибка сохранения категории: ' + (errorData.message || 'Неизвестная ошибка'));
        return null;
      }
    } catch (error) {
      console.error('Ошибка создания категории', error);
      setMessage('Не удалось создать категорию');
      return null;
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Вы не авторизованы.');
      navigate('/login');
      return;
    }

    let categoryId = formData.selectedCategory?.id;

    if (!categoryId) {
      categoryId = await createCategory(formData.category);
      if (!categoryId) return; // Если не удалось создать категорию, завершить выполнение
    }

    createQuiz(categoryId);
  };

  const createQuiz = async (categoryId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8192/quizzes/api/v1/quizzes/createQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          categoryId
        })
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/addQuestion?quizId=${data.id}`);
      } else {
        const errorData = await response.json();
        alert('Ошибка создания теста: ' + (errorData.message || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка при создании теста:', error);
      alert('Не удалось создать тест.');
    }
  };

  const handleConfirm = (confirm) => {
    setShowConfirm(false);
    if (confirm) {
      handleSubmit();
    } else {
      setFormData(prevState => ({
        ...prevState,
        category: '',
        selectedCategory: null
      }));
      setResults([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate(`/`);
  };

  const returnToQuizzes = () => {
    navigate(`/quizzes`);
  };

  return (
    <div>
      <div className='header-wrapper-myquizzes'></div>
      <div className='profile-container'>
        <h1 id="username">Привет, {username}!</h1>
        <button onClick={handleLogout}>Выход</button>
      </div>
      <div className='createquiz-container'>
        <button className='return-button' onClick={returnToQuizzes}></button>
        <h1>Добавить новый тест</h1>
        {currentStep === 1 && (
          <div>
            <h2>Шаг 1: Имя теста</h2>
            <input
              type="text"
              id="quiz-name"
              placeholder="Имя теста"
              value={formData.name}
              onChange={(e) => setFormData(prevState => ({
                ...prevState,
                name: e.target.value
              }))}
              required
            />
            <button onClick={() => setCurrentStep(2)}>Далее</button>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h2>Шаг 2: Описание теста</h2>
            <input
              type="text"
              id="quiz-description"
              placeholder="Описание"
              value={formData.description}
              onChange={(e) => setFormData(prevState => ({
                ...prevState,
                description: e.target.value
              }))}
              required
            />
            <button onClick={() => setCurrentStep(1)}>Назад</button>
            <button onClick={() => setCurrentStep(3)}>Далее</button>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <h2>Шаг 3: Категория теста</h2>
            <input
              type="text"
              id="quiz-category"
              placeholder="Название категории"
              value={formData.category}
              onChange={(e) => {
                setFormData(prevState => ({
                  ...prevState,
                  category: e.target.value
                }));
                setShowResults(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowResults(false), 100);
              }}
              required
            />
            {showResults && results.length > 0 && (
              <div className="search-results">
                <ul>
                  {results.map((categoryItem) => (
                    <li key={categoryItem.id} onClick={() => handleSelectCategory(categoryItem)}>
                      {categoryItem.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
       
            <button onClick={() => setCurrentStep(2)}>Назад</button>
            <button onClick={() => setShowConfirm(true)}>Создать</button>
          </div>
        )}
        {showConfirm && (
          <div className="confirm-dialog">
            <p>Такая категория уже существует, хотите добавить ваш тест в эту категорию?</p>
            <button onClick={() => handleConfirm(true)}>Да</button>
            <button onClick={() => handleConfirm(false)}>Нет</button>
          </div>
        )}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default CreateNewQuiz;
