import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Play, Pause, Square, Settings, FileText } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export default function TextToSpeech() {
  const { studyContent } = useStudy();
  const [text, setText] = useState(studyContent);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState({
    rate: 1,
    pitch: 1,
    volume: 0.8,
    voice: 0
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = () => {
    if (!text.trim()) return;

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    
    if (availableVoices[settings.voice]) {
      utterance.voice = availableVoices[settings.voice];
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(0);
    };

    utterance.onboundary = (event) => {
      const progressPercent = (event.charIndex / text.length) * 100;
      setProgress(progressPercent);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const pause = () => {
    speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
  };

  const sampleTexts = [
    {
      title: "Welcome Message",
      content: "Welcome to EduFlex Plus, your personalized learning assistant. This text-to-speech feature helps you learn through auditory processing, making education more accessible and engaging."
    },
    {
      title: "Study Tips",
      content: "Active listening combined with reading improves comprehension by up to 40%. Try following along with the text as you listen to reinforce your learning pathways."
    },
    {
      title: "Science Example",
      content: "Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen. This fundamental biological process sustains most life on Earth."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Volume2 className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Text to Speech</h1>
        </div>
        <p className="text-lg text-gray-600">
          Listen to your study materials with natural voice synthesis
        </p>
      </motion.div>

      {/* Sample Texts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
      >
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Quick Start Examples</h2>
        </div>
        
        <div className="grid gap-3 md:grid-cols-3">
          {sampleTexts.map((sample, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setText(sample.content)}
              className="text-left p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-all border border-gray-200"
            >
              <h3 className="font-medium text-gray-900 mb-2">{sample.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{sample.content}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Text Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Text to Read</h2>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter or paste the text you want to hear spoken aloud..."
          className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white/80 backdrop-blur-sm"
        />
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            {text.length} characters • Estimated {Math.ceil(text.split(' ').length / 200)} minutes
          </p>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Playback Controls</h2>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">Voice Settings</span>
          </div>
        </div>

        {/* Progress Bar */}
        {(isPlaying || isPaused) && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center space-x-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isPlaying ? pause : speak}
            disabled={!text.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Play'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stop}
            disabled={!isPlaying && !isPaused}
            className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Square className="h-4 w-4" />
            <span>Stop</span>
          </motion.button>
        </div>

        {/* Voice Settings */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.rate}
              onChange={(e) => setSettings({...settings, rate: parseFloat(e.target.value)})}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{settings.rate}x</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pitch</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.pitch}
              onChange={(e) => setSettings({...settings, pitch: parseFloat(e.target.value)})}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{settings.pitch}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume}
              onChange={(e) => setSettings({...settings, volume: parseFloat(e.target.value)})}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{Math.round(settings.volume * 100)}%</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
            <select
              value={settings.voice}
              onChange={(e) => setSettings({...settings, voice: parseInt(e.target.value)})}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              {availableVoices.map((voice, index) => (
                <option key={index} value={index}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
}