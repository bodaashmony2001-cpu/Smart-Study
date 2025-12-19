
import React from 'react';
import { AcademicAsset } from '../types';

interface MindMapProps {
  data: AcademicAsset['mind_map_data'];
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const centerX = 400;
  const centerY = 300;
  const radius = 220;

  if (!data || !data.branches) return null;

  return (
    <div className="w-full glass rounded-[3.5rem] shadow-2xl p-8 border-white/5 flex items-center justify-center overflow-auto animate-fade-in no-scrollbar">
      <svg width="800" height="600" viewBox="0 0 800 600" className="max-w-full h-auto drop-shadow-2xl">
        <defs>
          <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Glow for center */}
        <circle cx={centerX} cy={centerY} r="120" fill="url(#centralGlow)" />

        {/* Connection Lines */}
        {data.branches.map((_, i) => {
          const angle = (i * 2 * Math.PI) / data.branches.length;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <line
              key={`line-${i}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke={data.branches[i]?.color_code || "#6366f1"}
              strokeWidth="4"
              strokeDasharray="10,5"
              className="opacity-30"
            />
          );
        })}

        {/* Central Topic */}
        <g className="cursor-pointer">
          <circle cx={centerX} cy={centerY} r="75" fill="#6d28d9" stroke="#a78bfa" strokeWidth="3" className="glow-violet" />
          <foreignObject x={centerX - 65} y={centerY - 45} width="130" height="90">
            <div className="h-full w-full flex items-center justify-center text-center text-white text-sm font-black leading-tight p-3 uppercase tracking-tighter">
              {data.root_node}
            </div>
          </foreignObject>
        </g>

        {/* Outer Branches */}
        {data.branches.map((branch, i) => {
          const angle = (i * 2 * Math.PI) / data.branches.length;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <g key={`branch-${i}`} className="transition-transform duration-500 hover:scale-110">
              <rect 
                x={x - 90} y={y - 60} 
                width="180" height="120" 
                rx="30" fill="#1e1b4b" 
                stroke={branch.color_code || "#22d3ee"} 
                strokeWidth="3" 
                className="shadow-xl"
              />
              <text x={x} y={y - 30} textAnchor="middle" fontSize="24">
                {branch.icon || '🛸'}
              </text>
              <foreignObject x={x - 80} y={y - 20} width="160" height="70">
                <div className="h-full w-full flex flex-col items-center justify-center text-center p-2">
                  <span className="text-[11px] font-black text-white uppercase line-clamp-1 mb-2 tracking-tight">{branch.title}</span>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {(branch.key_points || []).slice(0, 2).map((kp, j) => (
                      <span key={j} className="text-[9px] bg-white/10 text-violet-200 px-2 py-0.5 rounded-full font-bold line-clamp-1 border border-white/5">{kp}</span>
                    ))}
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default MindMap;
