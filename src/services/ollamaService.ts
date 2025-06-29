import { Ollama } from 'ollama';

class OllamaService {
  private ollama: Ollama;
  private defaultModel: string = 'llama3.2';

  constructor() {
    this.ollama = new Ollama({
      host: 'http://localhost:11434'
    });
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.ollama.list();
      return true;
    } catch (error) {
      console.error('Ollama connection failed:', error);
      return false;
    }
  }

  async generateStudyGuide(content: string): Promise<string> {
    const prompt = `You are an expert study assistant. Convert the following content into a comprehensive, well-structured study guide. Use markdown formatting with:

1. Clear headers and subheaders
2. Bullet points for key concepts
3. Important definitions highlighted
4. Summary sections
5. Study tips and recommendations

Make it engaging and easy to understand for students.

Content to analyze:
${content}

Generate a complete study guide:`;

    try {
      const response = await this.ollama.generate({
        model: this.defaultModel,
        prompt: prompt,
        stream: false
      });

      return response.response;
    } catch (error) {
      console.error('Error generating study guide:', error);
      throw new Error('Failed to generate study guide. Please check your Ollama connection.');
    }
  }

  async analyzeEmotion(text: string): Promise<{
    emotion: string;
    confidence: number;
    suggestions: string[];
    affirmation: string;
    learningAdjustments: string[];
    copingStrategies: string[];
  }> {
    const prompt = `You are an empathetic AI assistant specializing in emotional analysis and educational psychology. Analyze the following student's text for emotional tone and provide comprehensive support.

Student's message: "${text}"

Analyze their emotional state and provide supportive, actionable guidance. Consider their learning context and provide specific educational recommendations.

Respond in this exact JSON format:
{
  "emotion": "one of: happy, sad, frustrated, anxious, excited, neutral, overwhelmed, confident, stressed, motivated",
  "confidence": number between 75-95,
  "suggestions": [
    "immediate actionable suggestion 1",
    "immediate actionable suggestion 2",
    "immediate actionable suggestion 3"
  ],
  "affirmation": "a warm, encouraging, and personalized message that validates their feelings",
  "learningAdjustments": [
    "specific study technique adjustment 1",
    "specific study technique adjustment 2"
  ],
  "copingStrategies": [
    "emotional coping strategy 1",
    "emotional coping strategy 2"
  ]
}

Guidelines:
- Be empathetic and understanding
- Provide practical, actionable advice
- Consider their academic context
- If emotion is negative, focus on constructive coping
- If emotion is positive, help maintain momentum
- Make suggestions specific to their situation`;

    try {
      const response = await this.ollama.generate({
        model: this.defaultModel,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9
        }
      });

      // Parse the JSON response
      const jsonMatch = response.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          emotion: parsed.emotion || 'neutral',
          confidence: parsed.confidence || 80,
          suggestions: parsed.suggestions || [],
          affirmation: parsed.affirmation || '',
          learningAdjustments: parsed.learningAdjustments || [],
          copingStrategies: parsed.copingStrategies || []
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      
      // Enhanced fallback response based on basic keyword analysis
      const lowerText = text.toLowerCase();
      let detectedEmotion = 'neutral';
      let fallbackAffirmation = 'You\'re doing great! Learning is a journey, and every step forward counts. 🌟';
      let fallbackSuggestions = [
        'Take a short break and try some deep breathing exercises',
        'Break down your study material into smaller, manageable chunks',
        'Consider discussing your feelings with a friend or mentor'
      ];

      // Basic emotion detection fallback
      if (lowerText.includes('frustrated') || lowerText.includes('angry') || lowerText.includes('annoyed')) {
        detectedEmotion = 'frustrated';
        fallbackAffirmation = 'It\'s completely normal to feel frustrated while learning. These feelings show you care about your progress! 💪';
        fallbackSuggestions = [
          'Take a 10-minute break to reset your mindset',
          'Try a different study approach or environment',
          'Focus on one small concept at a time'
        ];
      } else if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('nervous')) {
        detectedEmotion = 'anxious';
        fallbackAffirmation = 'Your anxiety shows how much you care about succeeding. Let\'s channel that energy positively! 🌱';
        fallbackSuggestions = [
          'Practice deep breathing: 4 counts in, 4 counts hold, 4 counts out',
          'Create a structured study plan to reduce uncertainty',
          'Start with easier topics to build confidence'
        ];
      } else if (lowerText.includes('overwhelmed') || lowerText.includes('too much') || lowerText.includes('stressed')) {
        detectedEmotion = 'overwhelmed';
        fallbackAffirmation = 'Feeling overwhelmed is a sign you\'re taking on challenges - that\'s growth! Let\'s break it down together. 🧩';
        fallbackSuggestions = [
          'List all tasks and prioritize the most important ones',
          'Use the Pomodoro technique: 25 minutes study, 5 minutes break',
          'Focus on progress, not perfection'
        ];
      } else if (lowerText.includes('excited') || lowerText.includes('motivated') || lowerText.includes('enthusiastic')) {
        detectedEmotion = 'excited';
        fallbackAffirmation = 'Your enthusiasm is wonderful! This positive energy will fuel your learning journey. ✨';
        fallbackSuggestions = [
          'Channel this energy into creating a detailed study plan',
          'Set specific, achievable goals to maintain momentum',
          'Share your excitement with study partners or friends'
        ];
      }

      return {
        emotion: detectedEmotion,
        confidence: 75,
        suggestions: fallbackSuggestions,
        affirmation: fallbackAffirmation,
        learningAdjustments: [
          'Adjust study pace based on your current emotional state',
          'Use active learning techniques like summarizing or teaching others'
        ],
        copingStrategies: [
          'Practice mindfulness or meditation for 5-10 minutes',
          'Maintain a regular sleep schedule and healthy habits'
        ]
      };
    }
  }

  async generateConceptMap(content: string): Promise<Array<{
    id: string;
    label: string;
    x: number;
    y: number;
    connections: string[];
    color: string;
  }>> {
    const prompt = `You are an expert at creating concept maps for educational content. Analyze the following text and extract 6-10 key concepts with their relationships.

Content: ${content}

Respond in this exact JSON format:
{
  "concepts": [
    {
      "id": "concept-1",
      "label": "Main Concept Name",
      "connections": ["concept-2", "concept-3"]
    }
  ]
}

Focus on the most important concepts and their meaningful relationships. Keep concept labels concise (1-3 words).`;

    try {
      const response = await this.ollama.generate({
        model: this.defaultModel,
        prompt: prompt,
        stream: false
      });

      const jsonMatch = response.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        
        // Transform the response into the expected format with positioning
        return data.concepts.map((concept: any, index: number) => ({
          id: concept.id,
          label: concept.label,
          x: 200 + Math.cos(index * 2 * Math.PI / data.concepts.length) * 150,
          y: 200 + Math.sin(index * 2 * Math.PI / data.concepts.length) * 150,
          connections: concept.connections,
          color: `hsl(${index * 360 / data.concepts.length}, 70%, 60%)`
        }));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating concept map:', error);
      // Fallback to simple concept extraction
      const words = content.split(' ').filter(word => word.length > 4);
      const concepts = words.slice(0, 6).map((word, index) => ({
        id: `concept-${index}`,
        label: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        x: 200 + Math.cos(index * 2 * Math.PI / 6) * 150,
        y: 200 + Math.sin(index * 2 * Math.PI / 6) * 150,
        connections: words.slice(0, 6)
          .map((_, i) => `concept-${i}`)
          .filter((id, i) => i !== index && Math.random() > 0.6),
        color: `hsl(${index * 60}, 70%, 60%)`
      }));
      return concepts;
    }
  }

  async generateQuiz(content: string): Promise<Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>> {
    const prompt = `You are an expert quiz creator for educational content. Create 4-5 multiple choice questions based on the following content. Make questions that test understanding, not just memorization.

Content: ${content}

Respond in this exact JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this answer is correct"
    }
  ]
}

Make questions challenging but fair, with plausible distractors.`;

    try {
      const response = await this.ollama.generate({
        model: this.defaultModel,
        prompt: prompt,
        stream: false
      });

      const jsonMatch = response.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return data.questions;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Fallback quiz
      return [
        {
          id: '1',
          question: 'Based on the study material, what is the primary concept being discussed?',
          options: [
            'Theoretical framework development',
            'Practical application methods',
            'Historical context analysis',
            'Future predictions and trends'
          ],
          correctAnswer: 1,
          explanation: 'The material focuses primarily on practical application methods, as evidenced by the examples and case studies presented.'
        }
      ];
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const models = await this.ollama.list();
      return models.models.map(model => model.name);
    } catch (error) {
      console.error('Error fetching models:', error);
      return [this.defaultModel];
    }
  }

  setModel(modelName: string): void {
    this.defaultModel = modelName;
  }

  getModel(): string {
    return this.defaultModel;
  }
}

export const ollamaService = new OllamaService();