import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';

const App: FC = () => {
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
