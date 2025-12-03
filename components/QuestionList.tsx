
import React from 'react';
import { Flashcard, Difficulty } from '../types';
import { ArrowLeft, RefreshCcw, Circle, Calendar } from 'lucide-react';

interface Props {
  category: 'new' | 'learning' | 'mastered';
  cards: Flashcard[];
  onBack: () => void;
  onReset: (id: number) => void;
}

export const QuestionList: React.FC<Props> = ({ category, cards, onBack, onReset }) => {
  const titles = {
    new: { en: 'New Questions', zh: '未学习' },
    learning: { en: 'Learning', zh: '学习中' },
    mastered: { en: 'Mastered', zh: '已掌握' }
  };

  // LeetCode specific colors
  const getDifficultyStyle = (d: Difficulty) => {
    switch (d) {
      case Difficulty.Easy: return 'text-[#00B8A3] bg-[#00B8A3]/10 dark:bg-[#00B8A3]/20';
      case Difficulty.Medium: return 'text-[#FFC01E] bg-[#FFC01E]/10 dark:bg-[#FFC01E]/20';
      case Difficulty.Hard: return 'text-[#FF375F] bg-[#FF375F]/10 dark:bg-[#FF375F]/20';
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-300 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-2">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-medium text-slate-800 dark:text-slate-200">
            {titles[category].zh}
          </h2>
          <span className="text-lg text-slate-400 font-normal">
            {cards.length} 题
          </span>
        </div>
      </div>

      {/* List Container */}
      <div className="space-y-0.5">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Circle className="w-8 h-8 text-slate-300" />
            </div>
            <p>暂无相关题目</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#282828] rounded-lg shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden">
            {cards.map((card, index) => (
              <div 
                key={card.id}
                className={`
                  group relative flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-default
                  ${index !== cards.length - 1 ? 'border-b border-slate-100 dark:border-white/5' : ''}
                `}
              >
                {/* Left Content */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Status Dot */}
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    category === 'mastered' ? 'bg-[#00B8A3]' : 
                    category === 'learning' ? 'bg-[#FFC01E]' : 'bg-slate-300'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-sm w-8">{card.id}.</span>
                      <h3 className="text-[16px] font-medium text-slate-700 dark:text-slate-200 truncate">
                        {card.titleCn}
                      </h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getDifficultyStyle(card.difficulty)}`}>
                        {card.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Meta Info & Actions */}
                <div className="flex items-center gap-8 pl-4">
                  <div className="hidden sm:flex items-center gap-6 text-xs text-slate-400">
                     <span className="truncate max-w-[150px] text-right">{card.title}</span>
                     
                     {category !== 'new' && (
                       <div className="flex items-center gap-1.5 min-w-[90px]" title="下次复习时间">
                         <Calendar className="w-3.5 h-3.5" />
                         <span>{new Date(card.srs.dueDate).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}</span>
                       </div>
                     )}
                  </div>

                  {/* Action Button (Reset) */}
                  <div className="w-8 flex justify-end">
                    {category !== 'new' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReset(card.id);
                        }}
                        title="重置进度"
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="p-1.5">
                        <Circle className="w-4 h-4 text-slate-200 dark:text-slate-700" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
