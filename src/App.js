import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import PuzzleDetailPage from './pages/PuzzleDetailPage';
import GlossaryPage from './pages/GlossaryPage';
import AboutPage from './pages/AboutPage';
import VariantsPage from './pages/VariantsPage';
import './App.css';

function App() {
  return (
    <Router basename="/puzzle-collection">
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/puzzle/:slug" element={<PuzzleDetailPage />} />
            <Route path="/variants" element={<VariantsPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
