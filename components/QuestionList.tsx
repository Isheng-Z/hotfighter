import React, { useState, useEffect } from 'react';
import { Flashcard, Difficulty } from '../types';
import { CheckSquare } from 'lucide-react';

interface Props {
  category: 'new' | 'learning' | 'mastered';
  cards: Flashcard[];
  onBack: () => void;
  onResetBatch: (ids: number[]) => void;
}

export const QuestionList: React.FC<Props> = ({ category, cards, onBack, onResetBatch }) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    setSelectedIds(new Set());
  }, [category]);

  const titles = {
    new: { en: 'Unstudied', zh: '未学习' },
    learning: { en: 'Learning', zh: '学习中' },
    mastered: { en: 'Mastered', zh: '已掌握' }
  };

  const isSelectionEnabled = category !== 'new';

  const toggleSelect = (id: number) => {
    if (!isSelectionEnabled) return;
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (!isSelectionEnabled) return;
    if (selectedIds.size === cards.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cards.map(c => c.id)));
    }
  };

  const handleBatchReset = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`确定要将选中的 ${selectedIds.size} 个题目重置为【未学习】状态吗？进度将丢失。`)) {
      onResetBatch(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const getDifficultyStyle = (d: Difficulty) => {
    switch (d) {
      case Difficulty.Easy: return 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400';
      case Difficulty.Medium: return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400';
      case Difficulty.Hard: return 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400';
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto h-full flex flex-col pb-2">
      {/* Header - Increased z-index significantly to prevent clicks from being blocked */}
      <div className="flex-none flex items-end justify-between mb-4 lg:mb-6 px-2 relative z-30">
        <div>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-slate-800 dark:text-slate-100">
            {titles[category].zh}
          </h2>
          <div className="text-slate-500 mt-2 font-medium font-serif italic text-sm lg:text-base">
             {cards.length} Cards
          </div>
        </div>

        {cards.length > 0 && isSelectionEnabled && (
          <div className="flex items-center gap-3 lg:gap-4 pointer-events-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleSelectAll(); }}
              className="text-xs lg:text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              {selectedIds.size === cards.length ? "取消全选" : "全选"}
            </button>
            
            {selectedIds.size > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleBatchReset(); }}
                className="flex items-center gap-2 px-4 py-1.5 lg:px-5 lg:py-2 text-xs lg:text-sm font-bold uppercase tracking-wider text-white bg-slate-800 dark:bg-sunrise-sun rounded-lg hover:bg-slate-700 dark:hover:bg-orange-600 transition-colors shadow-lg active:scale-95"
              >
                重置 ({selectedIds.size})
              </button>
            )}
          </div>
        )}
      </div>

      {/* List Container */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar mask-gradient relative z-10">
        {cards.length === 0 ? (
          <div className="text-center py-32 opacity-40 glass rounded-3xl h-full flex items-center justify-center">
            <p className="font-serif italic text-2xl text-slate-500">暂无内容</p>
          </div>
        ) : (
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-4 lg:p-6 border border-white/50 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-black/20 min-h-min">
            {cards.map((card, index) => {
              const isSelected = selectedIds.has(card.id);
              return (
                <div 
                  key={card.id}
                  onClick={() => toggleSelect(card.id)}
                  style={{ animationDelay: `${index * 30}ms` }}
                  className={`
                    animate-slide-up group relative flex items-center justify-between px-4 py-4 lg:px-6 lg:py-5 mb-3 transition-all duration-300 rounded-2xl border
                    ${isSelected 
                      ? 'bg-sky-50 border-sky-200 dark:bg-slate-700 dark:border-slate-600 shadow-md translate-x-2' 
                      : 'bg-white/60 border-transparent hover:bg-white hover:border-slate-200 dark:bg-slate-800/40 dark:hover:bg-slate-800 dark:hover:border-slate-700 shadow-sm'
                    }
                    ${isSelectionEnabled ? 'cursor-pointer' : ''}
                  `}
                >
                  <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
                    {isSelectionEnabled && (
                      <div className={`
                        w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0
                        ${isSelected 
                          ? 'bg-sky-600 border-sky-600 dark:bg-sunrise-sun dark:border-sunrise-sun' 
                          : 'border-slate-300 dark:border-slate-600 group-hover:border-sky-400 dark:group-hover:border-sunrise-sun'
                        }
                      `}>
                        {isSelected && <CheckSquare className="w-4 h-4 text-white" />}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-1.5">
                        <span className="text-sm font-serif font-bold text-slate-400 opacity-60 hidden sm:inline">#{card.id}</span>
                        <h3 className={`text-lg lg:text-xl font-medium ${isSelected ? 'text-sky-900 dark:text-sky-100' : 'text-slate-700 dark:text-slate-200'} truncate`}>
                          {card.titleCn}
                        </h3>
                      </div>
                      <div className="flex gap-3">
                         <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${getDifficultyStyle(card.difficulty)}`}>
                           {card.difficulty}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 pl-4">
                    {category !== 'new' && (
                       <div className="text-xs lg:text-sm font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex items-center gap-1.5 text-right sm:text-left">
                         {new Date(card.srs.dueDate).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                       </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};