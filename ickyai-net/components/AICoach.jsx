'use client';

import { useState, useRef, useEffect } from 'react';
import { FiSend, FiRefreshCw, FiTrendingUp } from 'react-icons/fi';

export default function AICoach({ accounts, activities }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Pre-populated coaching questions
  const quickQuestions = [
    '🎯 What should I do today?',
    '⚔️ How do I beat TASKI?',
    '📊 Help me with Sintal EKO',
    '🛡️ What if they say we\'re happy with our supplier?',
    '💡 Give me sales tips',
    '📞 How should I approach Celovite storitve?'
  ];

  const handleQuickQuestion = (question) => {
    setShowWelcome(false);
    handleSend(question);
  };

  const handleSend = async (messageText = null) => {
    const query = messageText || input;
    if (!query.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          accounts: accounts || []
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      // Add AI response
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: data.coaching.response,
        category: data.coaching.category,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
      setShowWelcome(false);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'error',
        text: 'Sorry, I couldn\'t get a response. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-900 via-blue-900 to-black rounded-lg border border-cyan-500/20 shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
              <FiTrendingUp className="text-cyan-400" />
              AI Sales Coach
            </h2>
            <p className="text-sm text-gray-400 mt-1">Your personal Kärcher sales strategy advisor</p>
          </div>
          <button
            onClick={() => {
              setMessages([]);
              setShowWelcome(true);
              setInput('');
            }}
            className="p-2 rounded-lg border border-cyan-500/30 hover:border-cyan-500 text-cyan-400 hover:text-cyan-300 transition"
            title="Clear conversation"
          >
            <FiRefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && showWelcome && (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="mb-8">
              <div className="inline-block p-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                <FiTrendingUp className="text-3xl text-cyan-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Welcome to AI Sales Coach!</h3>
            <p className="text-gray-400 mb-8 max-w-md">
              I know your 6 key Slovenian BSC accounts and can help you close €750k in opportunities. Ask me anything about sales strategy, competitive positioning, or specific accounts.
            </p>
            <div className="text-sm text-cyan-400 mb-4">💡 Try one of these:</div>
          </div>
        )}

        {/* Quick Questions Grid */}
        {messages.length === 0 && showWelcome && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-8 max-w-2xl mx-auto w-full">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q)}
                className="p-3 text-left rounded-lg border border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 transition text-sm font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xl px-4 py-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                  : msg.type === 'error'
                    ? 'bg-red-900/30 border border-red-500/30 text-red-200 rounded-bl-none'
                    : 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-cyan-500/20 text-gray-100 rounded-bl-none'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {msg.text}
              </div>
              {msg.type === 'ai' && msg.category && (
                <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-500/20">
                  {msg.category.replace(/_/g, ' ')}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-cyan-500/20 text-gray-100 rounded-lg rounded-bl-none px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-150"></div>
                </div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-cyan-500/20 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 backdrop-blur">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about sales strategy, competitive positioning, or specific accounts..."
            rows="2"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-800 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message (Enter)"
          >
            <FiSend size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}
