import React, { useState, useEffect } from 'react';
import { Flashcard, Difficulty } from '../types';
import { ArrowLeft, RefreshCcw, Circle, Calendar, CheckSquare, Square, Trash2 } from 'lucide-react';

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
    if (window.confirm(`确定要重置选中的 ${selectedIds.size} 个题目吗？进度将丢失。`)) {
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
    <div className="animate-fade-in max-w-4xl mx-auto pb-20 pt-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 px-2">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-800 dark:text-slate-100">
            {titles[category].zh}
          </h2>
          <div className="text-slate-500 mt-2 font-medium font-serif italic">
             {cards.length} Cards
          </div>
        </div>

        {cards.length > 0 && isSelectionEnabled && (
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSelectAll}
              className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              {selectedIds.size === cards.length ? "取消全选" : "全选"}
            </button>
            
            {selectedIds.size > 0 && (
              <button 
                onClick={handleBatchReset}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold uppercase tracking-wider text-white bg-slate-800 dark:bg-sunrise-sun rounded-lg hover:bg-slate-700 dark:hover:bg-orange-600 transition-colors shadow-lg"
              >
                重置 ({selectedIds.size})
              </button>
            )}
          </div>
        )}
      </div>

      {/* List Container */}
      <div className="space-y-3">
        {cards.length === 0 ? (
          <div className="text-center py-32 opacity-40 glass rounded-3xl">
            <p className="font-serif italic text-2xl text-slate-500">暂无内容</p>
          </div>
        ) : (
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-6 min-h-[50vh] border border-white/50 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-black/20">
            {cards.map((card, index) => {
              const isSelected = selectedIds.has(card.id);
              return (
                <div 
                  key={card.id}
                  onClick={() => toggleSelect(card.id)}
                  style={{ animationDelay: `${index * 30}ms` }}
                  className={`
                    animate-slide-up group relative flex items-center justify-between px-6 py-4 mb-3 transition-all duration-300 rounded-2xl border
                    ${isSelected 
                      ? 'bg-sky-50 border-sky-200 dark:bg-slate-700 dark:border-slate-600 shadow-md translate-x-2' 
                      : 'bg-white/60 border-transparent hover:bg-white hover:border-slate-200 dark:bg-slate-800/40 dark:hover:bg-slate-800 dark:hover:border-slate-700 shadow-sm'
                    }
                    ${isSelectionEnabled ? 'cursor-pointer' : ''}
                  `}
                >
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    {isSelectionEnabled && (
                      <div className={`
                        w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                        ${isSelected 
                          ? 'bg-sky-600 border-sky-600 dark:bg-sunrise-sun dark:border-sunrise-sun' 
                          : 'border-slate-300 dark:border-slate-600 group-hover:border-sky-400 dark:group-hover:border-sunrise-sun'
                        }
                      `}>
                        {isSelected && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-1.5">
                        <span className="text-xs font-serif font-bold text-slate-400 opacity-60">#{card.id}</span>
                        <h3 className={`text-lg font-medium ${isSelected ? 'text-sky-900 dark:text-sky-100' : 'text-slate-700 dark:text-slate-200'} truncate`}>
                          {card.titleCn}
                        </h3>
                      </div>
                      <div className="flex gap-3">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getDifficultyStyle(card.difficulty)}`}>
                           {card.difficulty}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 pl-4">
                    {category !== 'new' && (
                       <div className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
                         <Calendar className="w-3.5 h-3.5" />
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