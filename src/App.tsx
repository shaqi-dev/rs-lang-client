import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import { selectCurrentUserId } from './store/auth/authSlice';
import { useAppSelector } from './hooks/redux';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Textbook from './pages/Textbook';
import Statistics from './pages/Statistics';
import Audiocall from './pages/Audiocall';
import SprintGame from './pages/SprintGame';

const App: FC = () => {
  const userId = useAppSelector(selectCurrentUserId);

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
          <Route path="/games/sprint" element={<SprintGame />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
