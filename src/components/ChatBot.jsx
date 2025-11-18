import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { documentKnowledge, greetings, fallbackResponses } from '../data/chatbotKnowledge';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: greetings[0] }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (query) => {
    const lowerQuery = query.toLowerCase();

    // Greetings
    if (lowerQuery.match(/hello|hi|hey|namaste|नमस्ते/)) {
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Search knowledge base
    for (const [key, value] of Object.entries(documentKnowledge)) {
      if (lowerQuery.includes(key)) {
        return formatKnowledgeResponse(key, value);
      }
    }

    // Fallback
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  };

  const formatKnowledgeResponse = (serviceName, data) => {
    let response = `📋 **${serviceName.toUpperCase()}**\n\n`;

    response += `📄 **Required Documents:**\n`;
    data.documents.forEach((doc, idx) => {
      response += `${idx + 1}. ${doc}\n`;
    });

    response += `\n🔄 **Process:**\n${data.process}\n`;
    response += `\n💰 **Fees:** ${data.fees}`;

    return response;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = { type: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);

    // Generate bot response
    setTimeout(() => {
      const botResponse = generateAIResponse(inputText);
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 500);

    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transform transition-all duration-300 z-50 group"
        >
          <MessageCircle size={32} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Municipal AI Assistant</h3>
                <p className="text-xs opacity-90">नागरिक सहायक</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] p-3 rounded-2xl whitespace-pre-wrap
                    ${message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                    }
                  `}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about documents, processes..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full p-3 hover:scale-110 transform transition-all duration-200 shadow-lg"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
