import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Wand2, CheckCircle, XCircle, Trophy, RefreshCw, AlertCircle } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { ollamaService } from '../services/ollamaService';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer?: number;
}

export default function QuizGenerator() {
  const { studyContent, setQuizResults } = useStudy();
  const [inputText, setInputText] = useState(studyContent);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const quizQuestions = await ollamaService.generateQuiz(inputText);
      setQuestions(quizQuestions);
      setCurrentQuestion(0);
      setShowResults(false);
      setQuizStarted(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
      console.error('Quiz generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
  };

  const selectAnswer = (answerIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].userAnswer = answerIndex;
    setQuestions(updatedQuestions);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const score = questions.reduce((acc, q) => 
      q.userAnswer === q.correctAnswer ? acc + 1 : acc, 0
    );
    
    setQuizResults({ score, total: questions.length });
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setShowResults(false);
    setQuizStarted(false);
    setError(null);
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <HelpCircle className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI Quiz Generator</h1>
        </div>
        <p className="text-lg text-gray-600">
          Test your knowledge with AI-generated questions from your study material
        </p>
      </motion.div>

      {/* Input Section */}
      {!quizStarted && !showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Study Material for AI Quiz</h2>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your study material to generate personalized quiz questions using AI analysis..."
            className="w-full h-32 p-4 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          />
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              {inputText.length} characters • AI will generate ~{Math.ceil(inputText.split(' ').length / 100)} questions
            </p>
            <div className="flex space-x-3">
              {questions.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetQuiz}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset</span>
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateQuiz}
                disabled={!inputText.trim() || isGenerating}
                className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Wand2 className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'AI Generating...' : 'Generate Quiz'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 p-4"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700 font-medium">Error generating quiz</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </motion.div>
      )}

      {/* Quiz Preview */}
      {questions.length > 0 && !quizStarted && !showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">AI Quiz Ready!</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <HelpCircle className="h-4 w-4" />
              <span>{questions.length} AI-generated questions</span>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-50 border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Quiz Details</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {questions.length} AI-generated multiple choice questions</li>
                <li>• Estimated time: {questions.length * 2} minutes</li>
                <li>• AI-powered explanations for each answer</li>
                <li>• Instant feedback and scoring</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Read each AI-generated question carefully</li>
                <li>• Select the best answer from options</li>
                <li>• Review AI explanations after completion</li>
                <li>• Take your time to think through each question</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startQuiz}
              className="px-8 py-4 bg-orange-600 text-white font-semibold text-lg hover:bg-orange-700 transition-all shadow-sm"
            >
              Start AI Quiz
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Quiz Questions */}
      <AnimatePresence mode="wait">
        {quizStarted && !showResults && questions.length > 0 && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <div className="w-48 bg-gray-200 h-2">
                <div 
                  className="bg-orange-500 h-2 transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                {questions[currentQuestion].question}
              </h3>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => selectAnswer(index)}
                    className={`w-full p-4 text-left border-2 transition-all ${
                      questions[currentQuestion].userAnswer === index
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-25'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 border-2 flex items-center justify-center ${
                        questions[currentQuestion].userAnswer === index
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-gray-300'
                      }`}>
                        {questions[currentQuestion].userAnswer === index && (
                          <div className="w-2 h-2 bg-white"></div>
                        )}
                      </div>
                      <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextQuestion}
                disabled={questions[currentQuestion].userAnswer === undefined}
                className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span>{currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Results */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Score Summary */}
          <div className={`${getScoreBg(questions.filter(q => q.userAnswer === q.correctAnswer).length, questions.length)} border p-6 shadow-sm`}>
            <div className="text-center mb-6">
              <Trophy className={`h-12 w-12 mx-auto mb-4 ${getScoreColor(questions.filter(q => q.userAnswer === q.correctAnswer).length, questions.length)}`} />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Quiz Complete!</h2>
              <div className="text-4xl font-bold mb-2">
                <span className={getScoreColor(questions.filter(q => q.userAnswer === q.correctAnswer).length, questions.length)}>
                  {questions.filter(q => q.userAnswer === q.correctAnswer).length}/{questions.length}
                </span>
              </div>
              <p className="text-lg text-gray-600">
                {Math.round((questions.filter(q => q.userAnswer === q.correctAnswer).length / questions.length) * 100)}% Correct
              </p>
            </div>
          </div>

          {/* Question Review */}
          <div className="bg-white border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Review Your Answers</h3>
            
            <div className="space-y-6">
              {questions.map((question, index) => {
                const isCorrect = question.userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="border border-gray-200 p-4 bg-gray-50">
                    <div className="flex items-start space-x-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Question {index + 1}: {question.question}
                        </h4>
                        
                        <div className="space-y-2 mb-3">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-2 text-sm ${
                                optionIndex === question.correctAnswer
                                  ? 'bg-green-100 text-green-800 font-medium'
                                  : optionIndex === question.userAnswer && !isCorrect
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-white text-gray-700'
                              }`}
                            >
                              <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                              {optionIndex === question.correctAnswer && ' ✓'}
                              {optionIndex === question.userAnswer && !isCorrect && ' ✗'}
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 p-3">
                          <p className="text-sm text-blue-800">
                            <strong>AI Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="text-center space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetQuiz}
              className="px-8 py-3 bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all"
            >
              Generate Another AI Quiz
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Processing indicator */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center space-x-3">
            <div className="animate-spin h-8 w-8 border-b-2 border-orange-600"></div>
            <p className="text-lg text-gray-600">AI is analyzing content and generating personalized quiz questions...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}