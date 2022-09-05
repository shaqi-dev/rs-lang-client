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
          <Route path="/rs-lang-client" element={<Home />} />
          <Route path="/rs-lang-client/authorization" element={<Auth />} />
          <Route path="/rs-lang-client/textbook" element={<Textbook />} />
          {userId && (
            <Route path="/rs-lang-client/statistics" element={<Statistics userId={userId} />} />
          )}
          <Route path="/rs-lang-client/games/audiocall" element={<Audiocall />} />
          <Route path="/rs-lang-client/games/sprint" element={<SprintGame />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
