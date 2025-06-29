import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Heart, 
  Volume2, 
  Network, 
  HelpCircle,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

const features = [
  {
    name: 'Study Guide',
    description: 'Transform your texts into structured, easy-to-digest study materials',
    icon: BookOpen,
    href: '/study-guide',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    name: 'Emotion Helper',
    description: 'Get emotional support and personalized learning adjustments',
    icon: Heart,
    href: '/emotion-helper',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  },
  {
    name: 'Text to Speech',
    description: 'Listen to your study materials with natural voice synthesis',
    icon: Volume2,
    href: '/text-to-speech',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    name: 'Concept Map',
    description: 'Visualize relationships between concepts and ideas',
    icon: Network,
    href: '/concept-map',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    name: 'Quiz Generator',
    description: 'Test your knowledge with AI-generated quizzes',
    icon: HelpCircle,
    href: '/quiz',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
];

const stats = [
  { name: 'Study Sessions', value: '12', icon: Clock, change: '+2 this week' },
  { name: 'Concepts Learned', value: '47', icon: TrendingUp, change: '+8 this week' },
  { name: 'Quiz Score', value: '85%', icon: Award, change: '+5% improvement' },
];

export default function Dashboard() {
  const { quizResults, currentEmotion } = useStudy();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Welcome to EduFlex+
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Your personalized AI-powered learning assistant that adapts to your emotional state and learning style
        </motion.p>
      </div>

      {/* Stats
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div> */}

      {/* Current emotion indicator */}
      {currentEmotion !== 'neutral' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 border border-blue-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <Heart className="h-6 w-6 text-pink-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Current Mood: {currentEmotion}</h3>
              <p className="text-gray-600">Your learning experience is being personalized based on your emotional state.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Features grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={feature.href}
                className="block group"
              >
                <div className={`bg-white border ${feature.borderColor} p-6 shadow-sm hover:shadow-md transition-all group-hover:border-gray-300`}>
                  <div className={`inline-flex p-3 ${feature.bgColor} mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    Get started
                    <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent quiz results */}
      {quizResults && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Award className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Latest Quiz Results</h3>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{quizResults.score}</p>
              <p className="text-sm text-gray-500">Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{quizResults.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {Math.round((quizResults.score / quizResults.total) * 100)}%
              </p>
              <p className="text-sm text-gray-500">Accuracy</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}