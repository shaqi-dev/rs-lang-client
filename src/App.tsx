import { FC, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { selectCurrentUserId, setCredentials } from './store/auth/authSlice';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Textbook from './pages/Textbook';
import Statistics from './pages/Statistics';
import Audiocall from './pages/Audiocall';

const App: FC = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectCurrentUserId);

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
          <Route path="/textbook" element={<Textbook />} />
          {userId && <Route path="/statistics" element={<Statistics userId={userId} />} />}
          <Route path="/games/audiocall" element={<Audiocall />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
