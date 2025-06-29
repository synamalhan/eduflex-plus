import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StudyContextType {
  studyContent: string;
  setStudyContent: (content: string) => void;
  currentEmotion: string;
  setCurrentEmotion: (emotion: string) => void;
  quizResults: { score: number; total: number } | null;
  setQuizResults: (results: { score: number; total: number }) => void;
  conceptNodes: Array<{ id: string; label: string; connections: string[] }>;
  setConceptNodes: (nodes: Array<{ id: string; label: string; connections: string[] }>) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [studyContent, setStudyContent] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [quizResults, setQuizResults] = useState<{ score: number; total: number } | null>(null);
  const [conceptNodes, setConceptNodes] = useState<Array<{ id: string; label: string; connections: string[] }>>([]);

  return (
    <StudyContext.Provider
      value={{
        studyContent,
        setStudyContent,
        currentEmotion,
        setCurrentEmotion,
        quizResults,
        setQuizResults,
        conceptNodes,
        setConceptNodes,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}