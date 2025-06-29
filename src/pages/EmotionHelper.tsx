import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Lightbulb, RefreshCw, Smile, Frown, Meh, AlertCircle, Brain, Target } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { ollamaService } from '../services/ollamaService';

const emotionData = {
  happy: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: Smile },
  sad: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Frown },
  frustrated: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: Frown },
  anxious: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Meh },
  excited: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: Smile },
  neutral: { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: Meh },
  overwhelmed: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: Frown },
  confident: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: Smile },
  stressed: { color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', icon: Frown },
  motivated: { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: Smile }
};

export default function EmotionHelper() {
  const { currentEmotion, setCurrentEmotion } = useStudy();
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<{
    emotion: string;
    confidence: number;
    suggestions: string[];
    affirmation: string;
    learningAdjustments: string[];
    copingStrategies: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeEmotion = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await ollamaService.analyzeEmotion(inputText);
      setAnalysis(result);
      setCurrentEmotion(result.emotion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze emotion');
      console.error('Emotion analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setInputText('');
    setCurrentEmotion('neutral');
    setError(null);
  };

  const quickEmotionButtons = [
    { emotion: 'frustrated', label: 'Frustrated', emoji: '😤' },
    { emotion: 'anxious', label: 'Anxious', emoji: '😰' },
    { emotion: 'overwhelmed', label: 'Overwhelmed', emoji: '😵' },
    { emotion: 'excited', label: 'Excited', emoji: '🤩' },
    { emotion: 'confident', label: 'Confident', emoji: '😎' },
    { emotion: 'motivated', label: 'Motivated', emoji: '💪' }
  ];

  const handleQuickEmotion = async (emotion: string) => {
    const quickTexts = {
      frustrated: "I'm feeling really frustrated with my studies right now. Nothing seems to be clicking and I'm getting annoyed.",
      anxious: "I'm feeling anxious about my upcoming exams and whether I'm studying the right way. I'm worried I won't be prepared.",
      overwhelmed: "There's so much material to cover and I don't know where to start. I feel completely overwhelmed by everything.",
      excited: "I'm really excited about learning this new topic! I feel motivated and ready to dive deep into the material.",
      confident: "I'm feeling confident about my progress. Things are starting to make sense and I feel good about my studies.",
      motivated: "I'm feeling really motivated to study and improve. I want to make the most of my learning time."
    };
    
    setInputText(quickTexts[emotion as keyof typeof quickTexts] || '');
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
          <Heart className="h-8 w-8 text-pink-500" />
          <h1 className="text-3xl font-bold text-gray-900">AI Emotion Helper</h1>
        </div>
        <p className="text-lg text-gray-600">
          Share how you're feeling and get AI-powered emotional support for your learning journey
        </p>
      </motion.div>

      {/* Quick Emotion Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-gray-200 p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Emotion Check</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickEmotionButtons.map((item) => (
            <motion.button
              key={item.emotion}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickEmotion(item.emotion)}
              className="flex items-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-gray-200 p-6 shadow-sm"
      >
        <div className="flex items-center space-x-3 mb-4">
          <MessageSquare className="h-5 w-5 text-pink-500" />
          <h2 className="text-xl font-semibold text-gray-900">How are you feeling about your studies?</h2>
        </div>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Share your thoughts, feelings, or concerns about your learning experience. Are you excited, frustrated, anxious, or feeling confident? The more you share, the better the AI can understand and help you..."
          className="w-full h-32 p-4 border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
        />
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            {inputText.length} characters • AI will analyze emotional tone and provide personalized support
          </p>
          <div className="flex space-x-3">
            {analysis && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetAnalysis}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset</span>
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeEmotion}
              disabled={!inputText.trim() || isAnalyzing}
              className="flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white font-medium hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Heart className={`h-4 w-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
              <span>{isAnalyzing ? 'AI Analyzing...' : 'Analyze Emotion'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 p-4"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700 font-medium">Error analyzing emotion</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${emotionData[analysis.emotion as keyof typeof emotionData]?.bg || emotionData.neutral.bg} border ${emotionData[analysis.emotion as keyof typeof emotionData]?.border || emotionData.neutral.border} p-6 shadow-sm`}
        >
          <div className="flex items-center space-x-3 mb-6">
            {React.createElement(emotionData[analysis.emotion as keyof typeof emotionData]?.icon || emotionData.neutral.icon, {
              className: `h-6 w-6 ${emotionData[analysis.emotion as keyof typeof emotionData]?.color || emotionData.neutral.color}`
            })}
            <h2 className="text-xl font-semibold text-gray-900">AI Emotion Analysis</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Detected Emotion */}
            <div className="bg-white border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Detected Emotion</h3>
              <div className="flex items-center space-x-3">
                <span className={`text-2xl font-bold capitalize ${emotionData[analysis.emotion as keyof typeof emotionData]?.color || emotionData.neutral.color}`}>
                  {analysis.emotion}
                </span>
                <span className="text-sm text-gray-600">
                  {analysis.confidence}% confidence
                </span>
              </div>
            </div>

            {/* Affirmation */}
            <div className="bg-white border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">AI Affirmation</h3>
              <p className="text-gray-700">{analysis.affirmation}</p>
            </div>
          </div>

          {/* Enhanced Suggestions Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Immediate Suggestions */}
            <div className="bg-white border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold text-gray-900">Immediate Actions</h3>
              </div>
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-gray-700 text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Adjustments */}
            <div className="bg-white border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-gray-900">Study Adjustments</h3>
              </div>
              <ul className="space-y-2">
                {analysis.learningAdjustments.map((adjustment, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700 text-sm">{adjustment}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coping Strategies */}
            <div className="bg-white border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Target className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold text-gray-900">Coping Strategies</h3>
              </div>
              <ul className="space-y-2">
                {analysis.copingStrategies.map((strategy, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-700 text-sm">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Insights */}
          <div className="mt-6 bg-blue-50 border border-blue-200 p-4">
            <h3 className="font-semibold text-blue-900 mb-2">🤖 AI Insights</h3>
            <p className="text-blue-800 text-sm">
              Based on your emotional state, the AI has personalized these recommendations to help optimize your learning experience. 
              Your emotional awareness is a strength that will help you become a more effective learner.
            </p>
          </div>
        </motion.div>
      )}

      {/* Processing indicator */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center space-x-3">
            <div className="animate-spin h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="text-lg text-gray-600">AI is analyzing your emotional state and preparing personalized support...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}