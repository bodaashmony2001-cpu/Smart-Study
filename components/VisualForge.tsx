
import React, { useState, useEffect } from 'react';
import { VisualForgeData } from '../types';
import { useLanguage } from './LanguageContext';

interface VisualForgeProps {
  data?: VisualForgeData;
  onGenerate: () => void;
  isGenerating?: boolean;
}

const VisualForge: React.FC<VisualForgeProps> = ({ data, onGenerate, isGenerating }) => {
  const { t, language } = useLanguage();
  const [hovered, setHovered] = useState<number | null>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (data) setIsRendered(true);
  }, [data]);

  if (!data) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center text-center p-12 space-y-10 animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/10 to-transparent pointer-events-none"></div>
        <div className="w-40 h-40 bg-violet-600/5 rounded-full flex items-center justify-center relative shadow-[0_0_50px_rgba(109,40,217,0.1)] border border-white/5">
          <div className={`absolute inset-0 border-2 border-violet-500/30 rounded-full ${isGenerating ? 'animate-ping' : ''}`}></div>
          <svg className={`w-20 h-20 text-violet-400 ${isGenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.724 2.17a2 2 0 001.022 2.443l2.387.477a2 2 0 001.96-1.414l.724-2.17a2 2 0 00-1.022-2.443z" />
          </svg>
        </div>
        <div className="relative z-10">
          <h3 className="text-4xl font-black text-white mb-3 tracking-tighter glow-cyan">{t('visualForge')}</h3>
          <p className="text-violet-300/40 max-w-sm text-lg font-medium leading-relaxed">
            Construct a multidimensional neural landscape representing core concept weights.
          </p>
        </div>
        <button 
          onClick={onGenerate} 
          disabled={isGenerating}
          className="bg-violet-600 text-white px-12 py-5 rounded-[2.5rem] font-black text-xl hover:bg-violet-500 transition-all shadow-[0_15px_30px_rgba(109,40,217,0.4)] hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-50"
        >
          {isGenerating ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : '⚡'} {t('forgeBtn')}
        </button>
      </div>
    );
  }

  const renderShape = (concept: any, x: number, y: number) => {
    const size = 60 + concept.importance * 12;
    const color = concept.color || '#6d28d9';
    const isHovered = hovered === concept.id;

    const commonProps = {
      fill: color,
      className: `transition-all duration-700 ${isHovered ? 'filter brightness-125 scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'opacity-70 animate-neural'}`,
      style: { transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
    };

    switch (concept.shape) {
      case 'star':
        return (
          <polygon
            points="50,5 20,99 95,39 5,39 80,99"
            transform={`translate(${x - 50}, ${y - 50}) scale(${size / 100})`}
            {...commonProps}
          />
        );
      case 'hexagon':
        return (
          <polygon
            points="50,1 95,25 95,75 50,99 5,75 5,25"
            transform={`translate(${x - 50}, ${y - 50}) scale(${size / 100})`}
            {...commonProps}
          />
        );
      case 'rect':
        return (
          <rect
            x={x - size / 2}
            y={y - size / 2}
            width={size}
            height={size}
            rx={size / 4}
            {...commonProps}
          />
        );
      default:
        return (
          <circle
            cx={x}
            cy={y}
            r={size / 2}
            {...commonProps}
          />
        );
    }
  };

  return (
    <div className="relative glass rounded-[4rem] border-white/5 h-[750px] overflow-hidden animate-fade-in shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
      <div className="absolute top-10 left-10 z-20 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
        <h3 className="text-sm font-black text-violet-100 uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/5 backdrop-blur-md">
          Neural Constellation - Step 6
        </h3>
      </div>
      
      <svg width="100%" height="100%" viewBox="0 0 1000 750" className="drop-shadow-2xl">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Connections */}
        {data.connections.map((conn, idx) => {
          const from = data.concepts.find(c => c.id === conn.from);
          const to = data.concepts.find(c => c.id === conn.to);
          if (!from || !to) return null;
          const fx = 200 + (from.id % 3) * 300;
          const fy = 150 + Math.floor(from.id / 3) * 250;
          const tx = 200 + (to.id % 3) * 300;
          const ty = 150 + Math.floor(to.id / 3) * 250;
          return (
            <line 
              key={idx} 
              x1={fx} y1={fy} x2={tx} y2={ty} 
              stroke="rgba(255,255,255,0.08)" 
              strokeWidth="1" 
              className="animate-pulse"
            />
          );
        })}

        {/* Dynamic Concept Nodes */}
        {data.concepts.map((concept) => {
          const x = 200 + (concept.id % 3) * 300;
          const y = 150 + Math.floor(concept.id / 3) * 250;
          return (
            <g key={concept.id} onMouseEnter={() => setHovered(concept.id)} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              <circle cx={x} cy={y} r={100} fill="url(#nodeGlow)" className="opacity-50" />
              {renderShape(concept, x, y)}
              <text x={x} y={y + (80 + concept.importance * 3)} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="900" className="pointer-events-none uppercase tracking-[0.2em] font-sans">
                {concept.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Concept Deep Dive Tooltip */}
      <div className={`absolute bottom-10 right-10 left-10 glass p-10 rounded-[3rem] border-violet-500/20 transition-all duration-700 ${hovered !== null ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
        {hovered !== null && (
          <div className={`flex items-start gap-10 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
             <div className="w-24 h-24 rounded-[2rem] bg-violet-600/10 flex items-center justify-center text-5xl shrink-0 border border-white/5 animate-neural">
               {data.concepts.find(c => c.id === hovered)?.importance}
             </div>
             <div className="flex-1 space-y-3">
               <h4 className="text-3xl font-black text-white uppercase tracking-tight glow-cyan">{data.concepts.find(c => c.id === hovered)?.label}</h4>
               <p className="text-violet-200/60 text-lg leading-relaxed font-medium">{data.concepts.find(c => c.id === hovered)?.description}</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualForge;
