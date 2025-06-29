# EduFlex+ Educational Learning Platform

A modern, AI-powered educational platform that adapts to your emotional state and learning style. Built with React, TypeScript, and integrated with Ollama for local AI processing.

![EduFlex+ Dashboard](https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 🤖 AI-Powered Learning Tools
- **Study Guide Generator**: Transform any text into structured, comprehensive study materials
- **Emotion Helper**: AI analyzes your emotional state and provides personalized support
- **Concept Map Visualizer**: Generate interactive concept maps showing relationships between ideas
- **Quiz Generator**: Create custom quizzes with AI-generated questions and explanations
- **Text-to-Speech**: Listen to your study materials with natural voice synthesis

### 🎯 Key Capabilities
- **Local AI Processing**: Uses Ollama for privacy-focused, offline AI capabilities
- **Emotional Intelligence**: Adapts learning experience based on detected emotional state
- **Multi-Modal Learning**: Visual, auditory, and interactive learning approaches
- **Real-Time Feedback**: Instant AI analysis and personalized recommendations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- [Ollama](https://ollama.ai/) installed and running locally

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eduflex-plus.git
   cd eduflex-plus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Ollama**
   ```bash
   # Install Ollama (if not already installed)
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull a model (recommended: llama3.2)
   ollama pull llama3.2
   
   # Start Ollama service
   ollama serve
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Lucide React** - Beautiful, consistent icons

### AI Integration
- **Ollama** - Local AI model hosting
- **Ollama JavaScript Client** - API integration
- **Local Processing** - Privacy-focused, no data sent to external servers

### Additional Libraries
- **Recharts** - Data visualization for analytics
- **Web Speech API** - Text-to-speech functionality

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main app layout with navigation
│   └── OllamaStatus.tsx # AI connection status indicator
├── pages/              # Main application pages
│   ├── Dashboard.tsx   # Overview and stats
│   ├── StudyGuide.tsx  # AI study guide generator
│   ├── EmotionHelper.tsx # Emotional support assistant
│   ├── ConceptMap.tsx  # Visual concept mapping
│   ├── QuizGenerator.tsx # AI quiz creation
│   └── TextToSpeech.tsx # Audio learning tools
├── services/           # External service integrations
│   └── ollamaService.ts # Ollama AI service wrapper
├── context/            # React context for state management
│   └── StudyContext.tsx # Global study session state
└── types/              # TypeScript type definitions
```

## 🎮 Usage Guide

### 1. Study Guide Generation
1. Navigate to **Study Guide** page
2. Paste your study material in the text area
3. Click **Generate Study Guide** 
4. AI will create a structured guide with:
   - Key concepts and definitions
   - Organized sections and bullet points
   - Study tips and recommendations

### 2. Emotional Support
1. Go to **Emotion Helper** page
2. Share how you're feeling about your studies
3. AI analyzes your emotional state and provides:
   - Emotion detection with confidence level
   - Personalized affirmations
   - Coping strategies and study suggestions

### 3. Concept Mapping
1. Visit **Concept Map** page
2. Input your study text
3. AI generates an interactive visual map showing:
   - Key concepts as nodes
   - Relationships between ideas
   - Color-coded concept groups

### 4. Quiz Creation
1. Open **Quiz Generator** page
2. Provide study material
3. AI creates multiple-choice questions with:
   - Challenging but fair questions
   - Detailed explanations for answers
   - Instant scoring and feedback

### 5. Audio Learning
1. Access **Text to Speech** page
2. Enter or paste text to be read aloud
3. Customize voice settings:
   - Speed, pitch, and volume controls
   - Multiple voice options
   - Progress tracking

## ⚙️ Configuration

### Ollama Setup
The application connects to Ollama running on `localhost:11434` by default. You can modify the connection settings in `src/services/ollamaService.ts`:

```typescript
constructor() {
  this.ollama = new Ollama({
    host: 'http://localhost:11434'  // Change if needed
  });
}
```

### Supported Models
- **llama3.2** (recommended) - Balanced performance and quality
- **llama3.1** - Larger model for complex tasks
- **mistral** - Alternative model option
- **codellama** - Specialized for technical content

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Setup
No environment variables required - the app works entirely with local services.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain component modularity
- Add proper error handling
- Test with different Ollama models

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) for local AI capabilities
- [React](https://reactjs.org/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for animations

## 📞 Support

If you encounter any issues:

1. **Check Ollama Connection**: Ensure Ollama is running (`ollama serve`)
2. **Verify Model**: Make sure you have a model pulled (`ollama pull llama3.2`)
3. **Browser Console**: Check for any JavaScript errors
4. **GitHub Issues**: Report bugs or request features

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
The built files in `dist/` can be deployed to any static hosting service. Note that Ollama must be running locally for AI features to work.

---

**Made with ❤️ for learners everywhere**

*EduFlex+ - Adapting education to your emotional and learning needs*