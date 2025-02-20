
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage/HomePage';
import Register from './Pages/Register/Register';
import Login from './Pages/Login/Login';
import Quizzes from './Pages/Quizzes/Quizzes';
import CreateNewQuiz from './Pages/CreateNewQuiz/CreateNewQuiz';
import QuizCreated from './Pages/QuizCreated/QuizCreated';
import QuizCategoryForm from './Pages/CreateNewQuiz/QuizCategoryForm'
import QuizDescriptionForm from './Pages/CreateNewQuiz/QuizDescriptionForm';

import AddQuestion from './Pages/AddQuestion/AddQuestion';
import MyQuizzes from './Pages/MyQuizzes/MyQuizzes';
import QuizDetails from './components/QuizDetails/QuizDetails';
import CurrentQuizDetail from './components/CurrentQuizDetailed/CurrentQuizDetailed';
import TestPage from './Pages/TestPage/TestPage';
import TheoryPage from './Pages/TheoryPage/TheoryPage';
import CreateCategories from './Pages/CreateCategory/CreateCategory';
import SearchCategory from './Pages/SearchCategory/SearchCategory';
import MyFavorites from './Pages/MyFavorites/MyFavorites';
import GetTop20Categories from './components/GetTop20Categories/GetTop20Categories';
import QuizNameForm from './Pages/CreateNewQuiz/QuizNameForm';
import { FavoritesProvider } from './components/FavoriteContext/FavoriteContex';




function App() {
  return (
    <FavoritesProvider>
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/quizzes' element={<Quizzes />} />
          <Route path="/createQuiz/*" element={< CreateNewQuiz />} />
          <Route path='/quizCreated' element={<QuizCreated />} />
          <Route path="/current-quiz-detail" element={<CurrentQuizDetail/>} />
          <Route path='/addQuestion' element={<AddQuestion />} />
          <Route path='/myQuizzes' element={<MyQuizzes />} />
          <Route path='/quiz-detail' element={<QuizDetails />} />
          <Route path='/test' element={<TestPage />} />
          <Route path='/theory' element={<TheoryPage />} />
          <Route path='/createCategory' element={<CreateCategories />} />
          <Route path='/searchCategory' element={<SearchCategory />} />
          <Route path='/favorites' element={<MyFavorites />} />
          <Route path='/getTop20' element={<GetTop20Categories />} />
          <Route path="/create-description" element={<QuizDescriptionForm />} />
          <Route path="/create-category" element={<QuizCategoryForm />} />
          <Route path="/createQuizName" element={<QuizNameForm />} />

        </Routes>
        
      </div>
    </Router>
    </FavoritesProvider>
  );
}

export default App;

