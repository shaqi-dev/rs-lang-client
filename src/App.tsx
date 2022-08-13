import { FC, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { setCredentials } from './store/auth/authSlice';
import { useAppDispatch } from './hooks/redux';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';

const App: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const authData = localStorage.getItem('auth');

    if (authData) {
      dispatch(setCredentials(JSON.parse(authData)));
    }
  });

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authorization" element={<Auth />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
