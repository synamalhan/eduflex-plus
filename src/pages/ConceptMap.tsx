import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, Wand2, Eye, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { ollamaService } from '../services/ollamaService';

interface ConceptNode {
  id: string;
  label: string;
  x: number;
  y: number;
  connections: string[];
  color: string;
}

export default function ConceptMap() {
  const { studyContent, conceptNodes, setConceptNodes } = useStudy();
  const [inputText, setInputText] = useState(studyContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'interactive' | 'static'>('interactive');
  const [error, setError] = useState<string | null>(null);

  const generateConceptMap = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const concepts = await ollamaService.generateConceptMap(inputText);
      setConceptNodes(concepts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate concept map');
      console.error('Concept map generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportMap = () => {
    alert('Export functionality would be implemented here');
  };

  const resetMap = () => {
    setConceptNodes([]);
    setSelectedNode(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Network className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI Concept Map Generator</h1>
        </div>
        <p className="text-lg text-gray-600">
          Visualize relationships between concepts using AI-powered analysis
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-gray-200 p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Input Study Material</h2>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your study text to generate a visual concept map showing AI-analyzed relationships between key ideas..."
          className="w-full h-32 p-4 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
        />
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            {inputText.split(' ').filter(word => word.length > 4).length} potential concepts detected
          </p>
          <div className="flex space-x-3">
            {conceptNodes.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetMap}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset</span>
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateConceptMap}
              disabled={!inputText.trim() || isGenerating}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Wand2 className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'AI Analyzing...' : 'Generate Map'}</span>
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
            <p className="text-red-700 font-medium">Error generating concept map</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </motion.div>
      )}

      {/* Concept Map Visualization */}
      {conceptNodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">AI-Generated Concept Map</h2>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-gray-500" />
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as 'interactive' | 'static')}
                  className="text-sm border border-gray-300 px-3 py-1 bg-white"
                >
                  <option value="interactive">Interactive</option>
                  <option value="static">Static</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportMap}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </motion.button>
            </div>
          </div>

          {/* SVG Concept Map */}
          <div className="bg-gray-50 border border-gray-200 overflow-hidden">
            <svg width="100%" height="400" viewBox="0 0 400 400" className="bg-white">
              {/* Connections */}
              {conceptNodes.map(node => 
                node.connections.map(connectionId => {
                  const connectedNode = conceptNodes.find(n => n.id === connectionId);
                  if (!connectedNode) return null;
                  
                  return (
                    <line
                      key={`${node.id}-${connectionId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={connectedNode.x}
                      y2={connectedNode.y}
                      stroke="#d1d5db"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  );
                })
              )}
              
              {/* Nodes */}
              {conceptNodes.map(node => (
                <g key={node.id}>
                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    cx={node.x}
                    cy={node.y}
                    r="30"
                    fill={selectedNode === node.id ? node.color : `${node.color}88`}
                    stroke={node.color}
                    strokeWidth="3"
                    className="cursor-pointer"
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="white"
                    className="pointer-events-none"
                  >
                    {node.label.length > 8 ? node.label.substring(0, 8) + '...' : node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Selected Node Info */}
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-purple-50 border border-purple-200"
            >
              {(() => {
                const node = conceptNodes.find(n => n.id === selectedNode);
                if (!node) return null;
                
                return (
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-2">{node.label}</h3>
                    <p className="text-sm text-purple-700 mb-2">
                      Connected to {node.connections.length} other concepts (AI-analyzed relationships)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {node.connections.map(connectionId => {
                        const connectedNode = conceptNodes.find(n => n.id === connectionId);
                        return connectedNode ? (
                          <span
                            key={connectionId}
                            className="px-2 py-1 bg-white text-xs font-medium text-purple-700 border border-purple-200"
                          >
                            {connectedNode.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* Legend */}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Concept Mapping</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Click on nodes to see AI-analyzed connections</li>
              <li>• Lines show relationships identified by AI</li>
              <li>• Colors help distinguish different concept groups</li>
              <li>• Use this map to understand how ideas interconnect</li>
            </ul>
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
            <div className="animate-spin h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="text-lg text-gray-600">AI is analyzing relationships and generating concept map...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}