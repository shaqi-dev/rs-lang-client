import { FC } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

const App: FC = () => {
  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link>
        <Link to="login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
