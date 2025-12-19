
import React, { useState } from 'react';
import { Flashcard } from '../types';
import { useLanguage } from './LanguageContext';

interface FlashcardsProps {
  cards: Flashcard[];
  onExplain?: (card: Flashcard) => void;
}

const Flashcards: React.FC<FlashcardsProps> = ({ cards, onExplain }) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = cards[currentIndex];

  if (!card) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-16 py-12 animate-fade-in">
      <div className="relative w-full h-[550px] cursor-pointer perspective-2000" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-transform duration-[800ms] preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`} style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          {/* Front */}
          <div className="absolute inset-0 backface-hidden glass border-white/10 rounded-[5rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-16 text-center group overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 shadow-[0_0_20px_rgba(109,40,217,0.5)]"></div>
            <span className="text-sm font-black text-violet-400 uppercase tracking-[0.5em] mb-10 opacity-60">Discovery Node</span>
            <p className="text-5xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">{card.front_text}</p>
            <div className="mt-16 px-10 py-4 rounded-full bg-white/5 border border-white/5 text-xs font-black text-white/30 uppercase tracking-[0.3em] hover:bg-white/10 transition-all">Tap to reveal truth</div>
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-violet-800 to-indigo-950 border-2 border-white/10 rounded-[5rem] shadow-2xl flex flex-col items-center justify-center p-16 text-center text-white relative">
            <span className="text-sm font-black text-violet-200/40 uppercase tracking-[0.5em] mb-10">The Synthesis</span>
            <p className="text-3xl font-bold leading-[1.4] mb-14 tracking-tight">{card.back_text}</p>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onExplain?.(card); }}
              className="bg-white/10 hover:bg-violet-600 px-10 py-5 rounded-[2rem] border border-white/10 text-sm font-black uppercase tracking-widest transition-all hover:scale-110 active:scale-90 flex items-center gap-4 shadow-2xl ring-2 ring-white/5"
            >
              <span className="text-2xl">✨</span> {t('explainBtn')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-10">
        <button 
          disabled={currentIndex === 0}
          onClick={() => { setCurrentIndex(i => i - 1); setIsFlipped(false); }}
          className="p-7 glass rounded-[2rem] border-white/10 text-violet-100 disabled:opacity-20 transition-all hover:bg-violet-600 hover:scale-110 active:scale-95 shadow-2xl group"
        >
          <svg className="w-10 h-10 rotate-180 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
        </button>
        <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-white tracking-tighter">{currentIndex + 1} <span className="text-violet-500/50 text-xl mx-2">/</span> {cards.length}</span>
            <div className="w-48 h-2 bg-white/5 rounded-full mt-4 overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-700" style={{width: `${((currentIndex + 1)/cards.length)*100}%`}}></div>
            </div>
        </div>
        <button 
          disabled={currentIndex === cards.length - 1}
          onClick={() => { setCurrentIndex(i => i + 1); setIsFlipped(false); }}
          className="p-7 glass rounded-[2rem] border-white/10 text-violet-100 disabled:opacity-20 transition-all hover:bg-violet-600 hover:scale-110 active:scale-95 shadow-2xl group"
        >
          <svg className="w-10 h-10 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <style>{`
        .perspective-2000 { perspective: 2500px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default Flashcards;
