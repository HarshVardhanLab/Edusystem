import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, TrendingUp, Calendar, FileText, Lightbulb, BarChart3, Image as ImageIcon, Plus, MessageSquare, Trash2, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import aiService from '../services/aiService';
import { getUserRole } from '../utils/auth';
import './AIChat.css';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState('english'); // english, hindi, hinglish
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const userRole = getUserRole();
  const isStudent = userRole === 'STUDENT';

  const studentSuggestions = [
    { icon: <Lightbulb size={20} />, text: 'Give me 5 study tips', color: '#4CAF50' },
    { icon: <TrendingUp size={20} />, text: 'Analyze my performance', color: '#2196F3' },
    { icon: <Calendar size={20} />, text: 'Create a study plan', color: '#FF9800' },
    { icon: <FileText size={20} />, text: 'How to stay motivated?', color: '#9C27B0' }
  ];

  const libraryOwnerSuggestions = [
    { icon: <BarChart3 size={20} />, text: 'Analyze my business metrics', color: '#2196F3' },
    { icon: <TrendingUp size={20} />, text: 'How to increase student retention?', color: '#4CAF50' },
    { icon: <Lightbulb size={20} />, text: 'Marketing strategies for libraries', color: '#FF9800' },
    { icon: <FileText size={20} />, text: 'How to improve student satisfaction?', color: '#9C27B0' }
  ];

  const suggestions = isStudent ? studentSuggestions : libraryOwnerSuggestions;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const data = await aiService.getChatHistory(50);
      if (data.history && data.history.length > 0) {
        const chats = [];
        let currentChat = null;
        
        data.history.forEach((msg, index) => {
          if (index % 2 === 0) {
            currentChat = {
              id: `chat-${index}`,
              title: msg.message.substring(0, 50) + (msg.message.length > 50 ? '...' : ''),
              timestamp: msg.created_at,
              messages: []
            };
            chats.push(currentChat);
          }
          if (currentChat) {
            currentChat.messages.push({
              role: index % 2 === 0 ? 'user' : 'assistant',
              content: index % 2 === 0 ? msg.message : msg.response,
              timestamp: msg.created_at
            });
          }
        });
        
        setChatHistory(chats.reverse());
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setShowSuggestions(true);
    setCurrentChatId(null);
    setSelectedImage(null);
  };

  const loadChat = (chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setShowSuggestions(false);
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      startNewChat();
    }
  };

  const handleSend = async (messageText = input) => {
    if ((!messageText.trim() && !selectedImage) || loading) return;

    // Add language instruction to the message
    let finalMessage = messageText.trim() || 'Analyze this image';
    if (language === 'hindi') {
      finalMessage = `[Respond in Hindi] ${finalMessage}`;
    } else if (language === 'hinglish') {
      finalMessage = `[Respond in Hinglish (mix of Hindi and English)] ${finalMessage}`;
    }

    const userMessage = { 
      role: 'user', 
      content: messageText.trim() || 'Analyze this image', 
      timestamp: new Date().toISOString(),
      image: selectedImage ? URL.createObjectURL(selectedImage) : null
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowSuggestions(false);
    setLoading(true);

    try {
      let data;
      if (selectedImage) {
        data = await aiService.analyzeImage(selectedImage, finalMessage);
        setSelectedImage(null);
      } else {
        data = await aiService.chat(finalMessage);
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: data.response || data.analysis,
        timestamp: data.timestamp,
        responseTime: data.response_time
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Reload chat history after new message
      loadChatHistory();
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: error.response?.data?.error || error.response?.data?.detail || error.message || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestionClick = (text) => {
    handleSend(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzePerformance = async () => {
    setShowSuggestions(false);
    
    let message = isStudent ? 'Analyze my performance' : 'Analyze my business metrics';
    if (language === 'hindi') {
      message = `[Respond in Hindi] ${message}`;
    } else if (language === 'hinglish') {
      message = `[Respond in Hinglish (mix of Hindi and English)] ${message}`;
    }
    
    const userMessage = { 
      role: 'user', 
      content: isStudent ? 'Analyze my performance' : 'Analyze my business metrics', 
      timestamp: new Date().toISOString() 
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const data = isStudent 
        ? await aiService.analyzePerformance()
        : await aiService.getBusinessInsights();
      
      const assistantMessage = {
        role: 'assistant',
        content: isStudent ? data.analysis : data.insights,
        timestamp: data.timestamp,
        responseTime: data.response_time,
        metrics: data.metrics
      };
      setMessages(prev => [...prev, assistantMessage]);
      loadChatHistory();
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: error.response?.data?.error || `Failed to analyze ${isStudent ? 'performance' : 'business metrics'}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-container">
      {/* Sidebar */}
      <div className={`ai-chat-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={startNewChat} title="Start new chat">
            <Plus size={20} />
            {sidebarOpen && <span>New Chat</span>}
          </button>
          <button 
            className="sidebar-collapse-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        
        <div className="sidebar-content">
          <div className="chat-history-section">
            {sidebarOpen && <h3>Recent Chats</h3>}
            {chatHistory.length === 0 ? (
              sidebarOpen && <p className="no-history">No chat history yet</p>
            ) : (
              <div className="chat-history-list">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`chat-history-item ${currentChatId === chat.id ? 'active' : ''}`}
                    onClick={() => loadChat(chat)}
                    title={sidebarOpen ? '' : chat.title}
                  >
                    <MessageSquare size={18} />
                    {sidebarOpen && (
                      <>
                        <div className="chat-info">
                          <span className="chat-title">{chat.title}</span>
                          <span className="chat-time">
                            {new Date(chat.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          className="delete-chat-btn"
                          onClick={(e) => deleteChat(chat.id, e)}
                          title="Delete chat"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="ai-chat-main">
        <div className="ai-chat-header">
          <div className="header-content">
            {!sidebarOpen && (
              <button 
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(true)}
                title="Open sidebar"
              >
                <Menu size={24} />
              </button>
            )}
            <div className="header-icon">
              <Sparkles size={24} />
            </div>
            <div className="header-title">
              <h1>Nova AI</h1>
              <p>Your intelligent study & business assistant</p>
            </div>
            <div className="language-selector">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="language-dropdown"
              >
                <option value="english">🇬🇧 English</option>
                <option value="hindi">🇮🇳 हिंदी</option>
                <option value="hinglish">🇮🇳 Hinglish</option>
              </select>
            </div>
          </div>
        </div>

        <div className="ai-chat-messages">
          {messages.length === 0 && showSuggestions && (
            <div className="welcome-screen">
              <div className="welcome-icon">
                <Sparkles size={48} />
              </div>
              <h2>
                {language === 'hindi' 
                  ? 'नमस्ते! मैं Nova AI हूं' 
                  : language === 'hinglish'
                  ? 'Hello! Main Nova AI hoon'
                  : 'Hello! I\'m Nova AI'}
              </h2>
              <p>
                {language === 'hindi' 
                  ? (isStudent 
                    ? 'मुझसे पढ़ाई, समय प्रबंधन या परीक्षा की तैयारी के बारे में कुछ भी पूछें'
                    : 'अपने पुस्तकालय व्यवसाय, छात्र प्रतिधारण और विकास रणनीतियों के बारे में जानकारी प्राप्त करें')
                  : language === 'hinglish'
                  ? (isStudent
                    ? 'Mujhse padhai, time management ya exam preparation ke baare mein kuch bhi poocho'
                    : 'Apne library business, student retention aur growth strategies ke baare mein insights paayein')
                  : (isStudent 
                    ? 'Ask me anything about studying, time management, or exam preparation'
                    : 'Get insights about your library business, student retention, and growth strategies')
                }
              </p>
              
              <div className="suggestions-grid">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-card"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    style={{ borderColor: suggestion.color }}
                  >
                    <div className="suggestion-icon" style={{ color: suggestion.color }}>
                      {suggestion.icon}
                    </div>
                    <span>{suggestion.text}</span>
                  </button>
                ))}
              </div>

              <button className="analyze-btn" onClick={handleAnalyzePerformance}>
                {isStudent ? (
                  <>
                    <TrendingUp size={20} />
                    Analyze My Performance
                  </>
                ) : (
                  <>
                    <BarChart3 size={20} />
                    Get Business Insights
                  </>
                )}
              </button>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="message-content">
                <div className="message-text">
                  {message.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        // Custom rendering for better formatting
                        p: ({node, ...props}) => <p style={{marginBottom: '0.75rem'}} {...props} />,
                        strong: ({node, ...props}) => <strong style={{fontWeight: '600', color: message.role === 'user' ? 'white' : '#333'}} {...props} />,
                        ul: ({node, ...props}) => <ul style={{marginLeft: '1.5rem', marginBottom: '0.75rem'}} {...props} />,
                        ol: ({node, ...props}) => <ol style={{marginLeft: '1.5rem', marginBottom: '0.75rem'}} {...props} />,
                        li: ({node, ...props}) => <li style={{marginBottom: '0.25rem'}} {...props} />,
                        h1: ({node, ...props}) => <h1 style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem'}} {...props} />,
                        h2: ({node, ...props}) => <h2 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem'}} {...props} />,
                        h3: ({node, ...props}) => <h3 style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem'}} {...props} />,
                        code: ({node, inline, ...props}) => 
                          inline ? 
                            <code style={{background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.9em'}} {...props} /> :
                            <code style={{display: 'block', background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '0.75rem', overflowX: 'auto'}} {...props} />
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                  {message.image && (
                    <div className="message-image">
                      <img src={message.image} alt="Uploaded" />
                    </div>
                  )}
                </div>
                {message.metrics && (
                  <div className="metrics-card">
                    <h4>📊 {isStudent ? 'Your Metrics' : 'Business Metrics'}</h4>
                    <div className="metrics-grid">
                      {isStudent ? (
                        <>
                          <div className="metric">
                            <span className="metric-label">Attendance</span>
                            <span className="metric-value">{message.metrics.attendance_rate}%</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Study Sessions</span>
                            <span className="metric-value">{message.metrics.total_sessions}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Task Completion</span>
                            <span className="metric-value">{message.metrics.task_completion}%</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Active Days</span>
                            <span className="metric-value">{message.metrics.active_days}/30</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="metric">
                            <span className="metric-label">Students</span>
                            <span className="metric-value">{message.metrics.total_students}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Revenue</span>
                            <span className="metric-value">₹{message.metrics.monthly_revenue}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Occupancy</span>
                            <span className="metric-value">{message.metrics.occupancy_rate}%</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Retention</span>
                            <span className="metric-value">{message.metrics.retention_rate}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {message.responseTime && (
                  <div className="message-meta">
                    ⚡ {message.responseTime.toFixed(2)}s
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <div className="message-avatar">
                <Bot size={20} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <Loader2 className="spinner" size={20} />
                  <span>Nova is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-input-container">
          <div className="ai-chat-input">
            {selectedImage && (
              <div className="image-preview">
                <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                <button onClick={handleRemoveImage} className="remove-image">×</button>
              </div>
            )}
            <div className="input-row">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="attach-button"
                disabled={loading}
                title="Upload image"
              >
                <ImageIcon size={20} />
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === 'hindi' 
                    ? 'Nova से कुछ भी पूछें...'
                    : language === 'hinglish'
                    ? 'Nova se kuch bhi poocho...'
                    : 'Ask Nova anything...'
                }
                rows={1}
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={(!input.trim() && !selectedImage) || loading}
                className="send-button"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <p className="input-hint">
            Press Enter to send, Shift+Enter for new line • Upload images for analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
