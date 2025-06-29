import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Settings, RefreshCw } from 'lucide-react';
import { ollamaService } from '../services/ollamaService';

export default function OllamaStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await ollamaService.checkConnection();
      setIsConnected(connected);
      
      if (connected) {
        const models = await ollamaService.getAvailableModels();
        setAvailableModels(models);
        setCurrentModel(ollamaService.getModel());
      }
    } catch (error) {
      setIsConnected(false);
    }
    setIsChecking(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleModelChange = (modelName: string) => {
    ollamaService.setModel(modelName);
    setCurrentModel(modelName);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center space-x-2">
        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg backdrop-blur-sm border ${
            isConnected === null
              ? 'bg-gray-100/80 border-gray-300 text-gray-600'
              : isConnected
              ? 'bg-green-100/80 border-green-300 text-green-700'
              : 'bg-red-100/80 border-red-300 text-red-700'
          }`}
        >
          {isChecking ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : isConnected ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {isConnected === null
              ? 'Checking...'
              : isConnected
              ? ''
              : ''
            }
          </span>
        </motion.div>

        {/* Settings Button */}
        {isConnected && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg hover:bg-white/90 transition-colors"
          >
            <Settings className="h-4 w-4 text-gray-600" />
          </motion.button>
        )}

        {/* Refresh Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={checkConnection}
          disabled={isChecking}
          className="p-2 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 text-gray-600 ${isChecking ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-4"
          >
            <h3 className="font-semibold text-gray-900 mb-3">Ollama Settings</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Model
                </label>
                <select
                  value={currentModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                >
                  {availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-gray-500">
                <p>Available models: {availableModels.length}</p>
                <p>Connection: localhost:11434</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Error Message */}
      <AnimatePresence>
        {isConnected === false && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4"
          >
            <h4 className="font-semibold text-red-900 mb-2">Ollama Not Connected</h4>
            <p className="text-sm text-red-700 mb-3">
              Make sure Ollama is running on your system. Install and start it with:
            </p>
            <div className="bg-red-100 rounded-lg p-2 font-mono text-xs text-red-800">
              <div>curl -fsSL https://ollama.ai/install.sh | sh</div>
              <div>ollama run llama3.2</div>
            </div>
            <p className="text-xs text-red-600 mt-2">
              The app will use fallback responses until Ollama is connected.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}