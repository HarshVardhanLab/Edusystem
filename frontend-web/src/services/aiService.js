import api from './api';

const aiService = {
  // Send chat message
  chat: async (message) => {
    const response = await api.post('/api/v1/ai/chat/', { message });
    return response.data;
  },

  // Get performance analysis
  analyzePerformance: async () => {
    const response = await api.get('/api/v1/ai/analyze-performance/');
    return response.data;
  },

  // Generate study plan
  generateStudyPlan: async (planData) => {
    const response = await api.post('/api/v1/ai/study-plan/', planData);
    return response.data;
  },

  // Summarize notes
  summarizeNotes: async (noteData) => {
    const response = await api.post('/api/v1/ai/summarize-notes/', noteData);
    return response.data;
  },

  // Analyze image
  analyzeImage: async (imageFile, prompt = 'Analyze this image') => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('prompt', prompt);
    
    const response = await api.post('/api/v1/ai/analyze-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get business insights (for library owners)
  getBusinessInsights: async () => {
    const response = await api.get('/api/v1/ai/business-insights/');
    return response.data;
  },

  // Get chat history
  getChatHistory: async (limit = 20) => {
    const response = await api.get(`/api/v1/ai/chat-history/?limit=${limit}`);
    return response.data;
  }
};

export default aiService;
