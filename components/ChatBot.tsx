
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { chatWithMaterial } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatBotProps {
  context: string;
  history: ChatMessage[];
  onUpdateHistory: (newMsg: ChatMessage) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ context, history, onUpdateHistory }) => {
  const { t, language } = useLanguage();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const toggleVoice = () => {
    if (isListening) return;
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;
    
    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    onUpdateHistory(userMsg);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await chatWithMaterial(textToSend, context, history, language);
      onUpdateHistory({ role: 'model', text: reply });
    } catch (error) {
      console.error(error);
      onUpdateHistory({ role: 'model', text: "Neural Link interrupted." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-[2.5rem] border-white/5 h-[650px] flex flex-col overflow-hidden shadow-2xl animate-fade-in max-w-4xl mx-auto">
      <div className={`bg-gradient-to-r from-violet-600 to-indigo-700 p-6 flex items-center justify-between text-white ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <h3 className={`font-black flex items-center gap-3 tracking-widest uppercase text-sm ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          {t('chat')}
        </h3>
        <div className="flex gap-2">
          {isListening && <span className="text-[10px] font-black animate-pulse text-cyan-400">{t('voiceActive')}</span>}
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-cyan-400 animate-ping' : 'bg-green-400'} animate-pulse`}></div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-transparent no-scrollbar">
        {history.length === 0 && (
          <div className="text-center text-violet-300/30 mt-20 space-y-4">
            <div className="w-20 h-20 bg-violet-900/20 rounded-full mx-auto flex items-center justify-center border border-white/5">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <p className="text-lg font-black tracking-tight">{t('chatPlaceholder')}</p>
          </div>
        )}
        {history.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? (language === 'ar' ? 'justify-start' : 'justify-end') : (language === 'ar' ? 'justify-end' : 'justify-start')}`}>
            <div className={`max-w-[85%] px-6 py-4 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-lg ${
              msg.role === 'user' 
                ? 'bg-violet-600 text-white rounded-br-none glow-violet' 
                : 'bg-white/5 text-violet-100 border border-white/10 rounded-bl-none'
            } ${language === 'ar' ? 'text-right' : ''}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className={`flex ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
            <div className="bg-white/5 px-6 py-4 rounded-[1.5rem] border border-white/10 flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className={`flex gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <button onClick={toggleVoice} className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-cyan-600 text-white shadow-cyan-900/40' : 'bg-white/5 text-violet-300 hover:bg-white/10'}`}>
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v10a3 3 0 006 0V7a3 3 0 00-3-3z" /></svg>
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chatPlaceholder')}
            className={`flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-medium ${language === 'ar' ? 'text-right' : ''}`}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading}
            className="bg-violet-600 text-white px-6 rounded-2xl hover:bg-violet-500 transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-violet-900/40"
          >
            <svg className={`w-6 h-6 ${language === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
