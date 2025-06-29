import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Wand2, FileText, Copy, Check, AlertCircle } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { ollamaService } from '../services/ollamaService';

export default function StudyGuide() {
  const { studyContent, setStudyContent } = useStudy();
  const [inputText, setInputText] = useState(studyContent);
  const [generatedGuide, setGeneratedGuide] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateStudyGuide = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setStudyContent(inputText);
    
    try {
      const guide = await ollamaService.generateStudyGuide(inputText);
      setGeneratedGuide(guide);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate study guide');
      console.error('Study guide generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedGuide);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI Study Guide Generator</h1>
        </div>
        <p className="text-lg text-gray-600">
          Transform your study material into structured, AI-powered guides using Ollama
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-gray-200 p-6 shadow-sm"
      >
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Input Your Study Material</h2>
        </div>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your study text, notes, or educational content here. The AI will analyze and structure it into a comprehensive study guide with key concepts, definitions, and study tips..."
          className="w-full h-48 p-4 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            {inputText.length} characters • {inputText.split(' ').filter(word => word.length > 0).length} words
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateStudyGuide}
            disabled={!inputText.trim() || isGenerating}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Wand2 className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating with AI...' : 'Generate Study Guide'}</span>
          </motion.button>
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
            <p className="text-red-700 font-medium">Error generating study guide</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </motion.div>
      )}

      {/* Generated Guide */}
      {generatedGuide && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your AI-Generated Study Guide</h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
            </motion.button>
          </div>
          
          <div className="prose prose-blue max-w-none">
            <div className="bg-gray-50 border border-gray-200 p-6 whitespace-pre-wrap leading-relaxed">
              {generatedGuide}
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              🤖 AI Generated
            </span>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              📚 Study Guide
            </span>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
              🎯 Structured Learning
            </span>
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
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-lg text-gray-600">AI is analyzing your content and generating a comprehensive study guide...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}