
import React from 'react';
import { Question, Difficulty } from '../types';
import { ArrowLeft } from 'lucide-react';

interface Props {
  cards: Question[];
  onBack: () => void;
  onSelect: (card: Question) => void;
}

export const QuestionList: React.FC<Props> = ({ cards, onBack, onSelect }) => {
  const getDifficultyStyle = (d: Difficulty) => {
    switch (d) {
      case Difficulty.Easy: return 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400';
      case Difficulty.Medium: return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400';
      case Difficulty.Hard: return 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400';
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto h-full flex flex-col pb-2">
      {/* Header */}
      <div className="flex-none flex items-center gap-4 mb-4 lg:mb-6 px-2 relative z-30 pt-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-slate-800 dark:text-slate-100">
            All Questions
          </h2>
          <div className="text-slate-500 font-mono text-xs lg:text-sm mt-0.5">
             {cards.length} Total
          </div>
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar mask-gradient relative z-10 px-2">
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-4 lg:p-6 border border-white/50 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-black/20 min-h-min">
          {cards.map((card, index) => {
            return (
              <button 
                key={card.id}
                onClick={() => onSelect(card)}
                style={{ animationDelay: `${index * 10}ms` }}
                className={`
                  w-full text-left
                  animate-slide-up group relative flex items-center justify-between px-4 py-4 lg:px-6 lg:py-5 mb-3 transition-all duration-300 rounded-2xl border
                  bg-white/60 border-transparent hover:bg-white hover:border-slate-200 dark:bg-slate-800/40 dark:hover:bg-slate-800 dark:hover:border-slate-700 shadow-sm
                  active:scale-[0.99]
                `}
              >
                <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <span className="text-sm font-serif font-bold text-slate-400 opacity-60 w-8">#{card.id}</span>
                      <h3 className="text-lg lg:text-xl font-medium text-slate-700 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-sunrise-sun transition-colors">
                        {card.titleCn}
                      </h3>
                    </div>
                    <div className="flex gap-3 pl-11">
                       <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${getDifficultyStyle(card.difficulty)}`}>
                         {card.difficulty}
                       </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
