import './App.css';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Home from './components/Home/Home';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import NotFound from './components/NotFound/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import UserComponent from './components/UserComponent/UserComponent';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Logout from './components/Logout/Logout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/todo' element={<PrivateRoute><UserComponent /></PrivateRoute>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
