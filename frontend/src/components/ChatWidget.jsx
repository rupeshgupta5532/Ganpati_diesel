import React, { useState, useRef, useEffect } from 'react';
import { chatbotApi } from '../api/services';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Namaste! 🙏 I am your Ganpati Diesel AI assistant. How can I help you today? You can ask me about our services, parts, contact details, or your bookings.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatbotApi.ask(query);
      const replyText = res.data?.reply || 'Sorry, I could not process that request.';
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Sorry, I am having trouble connecting to the server. Please try again or call our workshop directly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-20 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-brand-accent text-brand-primary w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-all group"
          title="Chat with Ganpati AI Assistant"
        >
          <span>💬</span>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-brand-primary p-4 flex items-center justify-between text-white border-b border-brand-border">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-brand-accent text-brand-primary font-extrabold rounded-full flex items-center justify-center text-sm shadow">
                G
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide text-white">Ganpati AI Assistant</h3>
                <p className="text-[11px] text-green-400 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 inline-block"></span>
                  Online • Smart Support
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-lg p-1 transition-colors"
              title="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50 dark:bg-slate-900/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-brand-accent text-brand-primary font-medium rounded-tr-none'
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-gray-100 dark:border-slate-600 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 dark:text-slate-400 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-gray-400 dark:text-slate-400 text-xs py-2 px-1">
                <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce [animation-delay:0.4s]"></div>
                <span className="ml-1 text-[11px]">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-gray-100/70 dark:bg-slate-800/80 border-t border-gray-100 dark:border-slate-700 flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
            <button
              onClick={() => setInput('What services do you offer?')}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 whitespace-nowrap hover:bg-brand-accent/20 transition-colors"
            >
              🔧 Services
            </button>
            <button
              onClick={() => setInput('What are your workshop contact details?')}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 whitespace-nowrap hover:bg-brand-accent/20 transition-colors"
            >
              📞 Contact
            </button>
            <button
              onClick={() => setInput('Do you supply genuine CRDI fuel pumps and parts?')}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 whitespace-nowrap hover:bg-brand-accent/20 transition-colors"
            >
              ⚙️ Parts
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Ganpati Diesel..."
              className="flex-1 px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-brand-accent text-slate-900 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-brand-accent text-brand-primary p-2.5 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-accent-hover transition-colors"
              title="Send message"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
