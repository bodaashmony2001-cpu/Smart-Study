
import React from 'react';
import { SpacedRepetitionTask } from '../types';

interface SpacedRepetitionProps {
  schedule: SpacedRepetitionTask[];
}

const SpacedRepetition: React.FC<SpacedRepetitionProps> = ({ schedule }) => {
  if (!schedule) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {schedule.map((task, i) => (
          <div key={i} className="glass p-8 rounded-[2.5rem] border-white/5 shadow-2xl relative overflow-hidden group hover:border-violet-500/50 transition-all">
            <div className="absolute top-0 right-0 p-5 bg-gradient-to-bl from-violet-600 to-indigo-700 text-white rounded-bl-[2rem] font-black text-xs uppercase tracking-widest shadow-xl">
              Day +{task.day_offset}
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-600/20 text-violet-400 rounded-2xl border border-violet-500/20 shadow-inner">
                  {task.activity_type?.includes('MCQ') ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.724 2.17a2 2 0 001.022 2.443l2.387.477a2 2 0 001.96-1.414l.724-2.17a2 2 0 00-1.022-2.443z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.428 19.428a2 2 0 01-.547 1.022l-.477 2.387a2 2 0 01-1.414 1.96l-2.17.724a2 2 0 01-2.443-1.022l-.477-2.387a2 2 0 011.414-1.96l2.17-.724a2 2 0 012.443 1.022z" /></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  )}
                </div>
                <h4 className="font-black text-white text-lg tracking-tight">{task.notification_title}</h4>
              </div>

              <div className="bg-white/5 p-6 rounded-[1.5rem] border border-white/5 group-hover:border-violet-500/20 transition-all">
                <p className="text-sm text-violet-100 font-semibold leading-relaxed">
                  {task.question}
                </p>
              </div>

              {task.quiz_data && (
                <div className="pt-2">
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-[0.2em] opacity-80 mb-3 block">Neural Assessment</span>
                  <div className="grid grid-cols-2 gap-3">
                    {(task.quiz_data.options || []).slice(0, 4).map((o, j) => (
                      <div key={j} className="text-[10px] font-bold text-violet-300 bg-white/5 border border-white/5 px-4 py-3 rounded-xl hover:bg-violet-600/20 transition-all truncate">
                        {o}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpacedRepetition;
