import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, Zap } from 'lucide-react';
import { api } from '../services/api';

export const AiAssistantView = ({ initialTargetAlumni, initialPromptType }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I am the CS Department AI Assistant. I can summarize alumni profiles, generate career roadmaps, or help you find alumni working at Google, Microsoft, Zoho, and more. What would you like to ask today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialTargetAlumni && initialPromptType) {
      triggerDirectQuery(initialPromptType, initialTargetAlumni);
    }
  }, [initialTargetAlumni, initialPromptType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const triggerDirectQuery = async (promptType, targetName) => {
    setLoading(true);
    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: `Generate ${promptType} for ${targetName}`
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await api.sendAiChat({ promptType, targetAlumniName: targetName });
      if (res.success) {
        setMessages(prev => [
          ...prev,
          { id: String(Date.now() + 1), sender: 'bot', text: res.reply }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const queryText = input.trim();
    setInput('');
    const userMsg = { id: String(Date.now()), sender: 'user', text: queryText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.sendAiChat({ query: queryText });
      if (res.success) {
        setMessages(prev => [
          ...prev,
          { id: String(Date.now() + 1), sender: 'bot', text: res.reply }
        ]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { id: String(Date.now() + 1), sender: 'bot', text: 'Sorry, I ran into an issue processing your query.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestionChips = [
    'Show alumni working at Google',
    'Who offers mentorship in Cloud & AI?',
    'Tell me about Hall of Fame pioneers',
    'What is the CS department history?'
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col glass-panel p-0 overflow-hidden animate-fade-in border border-violet-500/20">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">CS Department AI Assistant</h2>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active & Smart Indexed
            </span>
          </div>
        </div>

        <button
          onClick={() => setMessages([{ id: '1', sender: 'bot', text: 'Chat history reset. How can I help you?' }])}
          className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          title="Clear Chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 border border-slate-700 text-pink-400'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-violet-600 text-white rounded-tr-none shadow-lg shadow-violet-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-pink-400 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" /> Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="p-3 border-t border-white/5 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" /> Prompts:
        </span>
        {suggestionChips.map((chip, i) => (
          <button
            key={i}
            onClick={() => { setInput(chip); }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-violet-500/50 whitespace-nowrap shrink-0 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-slate-950/80 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI about alumni, companies, roadmaps..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
        />
        <button type="submit" disabled={loading} className="btn btn-primary text-xs font-bold px-4 py-2.5">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
