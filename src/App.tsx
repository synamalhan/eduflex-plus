import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudyGuide from './pages/StudyGuide';
import EmotionHelper from './pages/EmotionHelper';
import TextToSpeech from './pages/TextToSpeech';
import ConceptMap from './pages/ConceptMap';
import QuizGenerator from './pages/QuizGenerator';
import { StudyProvider } from './context/StudyContext';

function App() {
  return (
    <StudyProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/study-guide" element={<StudyGuide />} />
            <Route path="/emotion-helper" element={<EmotionHelper />} />
            <Route path="/text-to-speech" element={<TextToSpeech />} />
            <Route path="/concept-map" element={<ConceptMap />} />
            <Route path="/quiz" element={<QuizGenerator />} />
          </Routes>
        </Layout>
      </Router>
    </StudyProvider>
  );
}

export default App;