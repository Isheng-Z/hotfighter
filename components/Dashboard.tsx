import React from 'react';
import { Flashcard, Language } from '../types';
import { Play, Sparkles, BookOpen, CheckCircle, ChevronRight, Minus, Plus, RefreshCw, LayoutDashboard } from 'lucide-react';

interface Props {
  cards: Flashcard[];
  onStartStudy: () => void;
  lang: Language;
  onViewCategory: (category: 'new' | 'learning' | 'mastered') => void;
  onResetAll: () => void;
  dailyNewLimit: number;
  onSetDailyNewLimit: (limit: number) => void;
}

export const Dashboard: React.FC<Props> = ({ 
  cards, 
  onStartStudy, 
  lang, 
  onViewCategory, 
  onResetAll,
  dailyNewLimit,
  onSetDailyNewLimit
}) => {
  const now = Date.now();
  const dueItems = cards.filter(c => !c.isNew && c.srs.dueDate <= now);
  const dueCount = dueItems.length;
  const newItemsAll = cards.filter(c => c.isNew);
  const newCountToReview = Math.min(newItemsAll.length, dailyNewLimit);
  const sessionCount = dueCount + newCountToReview;

  const mastered = cards.filter(c => c.srs.interval > 21);
  const learning = cards.filter(c => !c.isNew && c.srs.interval <= 21);
  const newCards = cards.filter(c => c.isNew);
  const totalCards = cards.length;

  const t = {
    en: {
      title: "LeetCode Flash",
      subtitle: "Master algorithms with spaced repetition.",
      new: "Unstudied",
      learning: "Learning",
      mastered: "Mastered",
      progress: "Progress Overview",
      start: "Start Review",
      caughtUp: "All Caught Up",
      dueCount: "Due for Review",
      newCount: "New Today",
      settings: "Daily New Cards",
      resetAll: "Reset All Data",
      resetConfirm: "Are you sure you want to reset all progress? This cannot be undone."
    },
    zh: {
      title: "LeetCode Flash",
      subtitle: "基于遗忘曲线的算法记忆助手",
      new: "未学习",
      learning: "学习中",
      mastered: "已掌握",
      progress: "整体进度",
      start: "开始复习",
      caughtUp: "今日任务已完成",
      dueCount: "待复习",
      newCount: "今日新词",
      settings: "每日新词上限",
      resetAll: "重置所有数据",
      resetConfirm: "确定要清空所有学习进度并恢复初始状态吗？此操作无法撤销。"
    }
  };
  const text = lang === 'zh' ? t.zh : t.en;

  const handleReset = () => {
    if (window.confirm(text.resetConfirm)) {
      onResetAll();
    }
  };

  const adjustLimit = (delta: number) => {
    const newVal = Math.max(0, Math.min(50, dailyNewLimit + delta));
    onSetDailyNewLimit(newVal);
  };

  // Theme-aware categories
  // Day: Parasol colors (Blue, Green, Cream)
  // Night: Sunrise colors (Teal, Orange, Grey)
  const categories = [
    { 
      id: 'new',
      label: text.new, 
      count: newCards.length, 
      // Day: Sky Blue | Night: Foggy Teal
      bg: 'bg-sky-50 dark:bg-slate-800/40',
      border: 'border-sky-100 dark:border-slate-700',
      text: 'text-sky-700 dark:text-sky-300',
      icon: Sparkles,
      iconBg: 'bg-sky-100 dark:bg-sky-900/30'
    },
    { 
      id: 'learning',
      label: text.learning, 
      count: learning.length, 
      // Day: Grass Green | Night: Sunrise Orange
      bg: 'bg-emerald-50 dark:bg-orange-900/20',
      border: 'border-emerald-100 dark:border-orange-900/40',
      text: 'text-emerald-700 dark:text-orange-300',
      icon: BookOpen,
      iconBg: 'bg-emerald-100 dark:bg-orange-900/30'
    },
    { 
      id: 'mastered',
      label: text.mastered, 
      count: mastered.length, 
      // Day: Stone/Cream | Night: Slate
      bg: 'bg-stone-50 dark:bg-slate-800/40',
      border: 'border-stone-100 dark:border-slate-700',
      text: 'text-stone-600 dark:text-slate-400',
      icon: CheckCircle,
      iconBg: 'bg-stone-100 dark:bg-slate-800'
    },
  ] as const;

  return (
    <div className="space-y-10 animate-slide-up max-w-5xl mx-auto pt-4 pb-20">
      <header className="text-center pb-6">
        <h1 className="text-6xl font-serif font-medium text-slate-800 dark:text-slate-200 mb-4 tracking-tight drop-shadow-sm">
          {text.title}
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-light font-serif italic">
          {text.subtitle}
        </p>
      </header>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <button 
            key={cat.id}
            onClick={() => onViewCategory(cat.id as any)}
            className={`
              group relative rounded-2xl p-8 text-left transition-all duration-500 hover:-translate-y-2
              border ${cat.border} ${cat.bg}
              shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30
              backdrop-blur-sm
            `}
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="flex justify-between items-start mb-6">
               <div className={`p-4 rounded-full ${cat.iconBg} ${cat.text} transition-transform duration-500 group-hover:scale-110`}>
                 <cat.icon className="w-6 h-6" />
               </div>
               <ChevronRight className={`w-5 h-5 ${cat.text} opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0`} />
            </div>
            <div className={`text-5xl font-serif font-medium ${cat.text} mb-2 tracking-tight`}>
              {cat.count}
            </div>
            <div className={`text-sm font-bold uppercase tracking-widest ${cat.text} opacity-70`}>
              {cat.label}
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Action - Takes up 2/3 */}
        <div className="lg:col-span-2 glass rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group">
           {/* Decorative background blob */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-parasol-sky/20 to-parasol-grass/20 dark:from-sunrise-sun/10 dark:to-sunrise-water/20 rounded-full blur-3xl -z-10 transition-colors duration-1000"></div>

           <div className="relative z-10">
             <h2 className="text-3xl font-serif font-medium text-slate-800 dark:text-slate-100 mb-8">
               {sessionCount > 0 ? text.start : text.caughtUp}
             </h2>
             
             <div className="flex gap-12 mb-10">
               <div>
                 <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{text.dueCount}</div>
                 <div className="text-6xl font-serif font-medium text-slate-700 dark:text-slate-200">{dueCount}</div>
               </div>
               <div className="w-px bg-slate-200 dark:bg-slate-700/50 h-20 self-center transform rotate-12"></div>
               <div>
                 <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{text.newCount}</div>
                 <div className="text-6xl font-serif font-medium text-slate-700 dark:text-slate-200">{newCountToReview}</div>
               </div>
             </div>
           </div>
           
           <div className="space-y-6 relative z-10">
             <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/30 p-2 pr-4 rounded-full w-fit border border-white/60 dark:border-slate-700 backdrop-blur-sm">
               <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-3 uppercase tracking-wider">{text.settings}:</span>
               <div className="flex items-center gap-3">
                 <button onClick={() => adjustLimit(-5)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"><Minus className="w-3 h-3" /></button>
                 <span className="text-sm font-mono w-6 text-center text-slate-700 dark:text-slate-200">{dailyNewLimit}</span>
                 <button onClick={() => adjustLimit(5)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"><Plus className="w-3 h-3" /></button>
               </div>
             </div>

             <button 
               onClick={onStartStudy}
               disabled={sessionCount === 0}
               className={`
                 w-full py-5 rounded-2xl font-serif font-medium text-xl transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden
                 ${sessionCount === 0 
                   ? 'bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-600 cursor-not-allowed' 
                   : 'text-white shadow-xl hover:shadow-2xl hover:-translate-y-1'
                 }
               `}
             >
               {sessionCount > 0 && (
                 <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-900 dark:from-sunrise-sun dark:to-orange-700 opacity-90 transition-opacity"></div>
               )}
               <span className="relative z-10 flex items-center gap-3">
                  {sessionCount > 0 ? <Play className="w-5 h-5 fill-current" /> : <CheckCircle className="w-5 h-5" />}
                  <span>{sessionCount > 0 ? text.start : text.caughtUp}</span>
               </span>
             </button>
           </div>
        </div>

        {/* Visual Progress - Takes up 1/3 */}
        <div className="glass rounded-3xl p-8 flex flex-col justify-center relative">
           <div className="flex items-center gap-3 mb-8">
             <LayoutDashboard className="w-5 h-5 text-slate-400" />
             <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 tracking-wide">
               {text.progress}
             </h3>
           </div>
           
           <div className="space-y-8">
              {categories.map((cat) => (
                <div key={cat.id} className="relative">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-600 dark:text-slate-400">{cat.label}</span>
                    <span className="font-mono text-slate-500">{Math.round((cat.count / Math.max(totalCards, 1)) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${cat.text.replace('text-', 'bg-')} transition-all duration-1000 ease-out`}
                      style={{ width: `${totalCards > 0 ? (cat.count / totalCards) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
           </div>
           <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-700/50 text-center">
               <span className="text-4xl font-serif font-bold text-slate-800 dark:text-slate-100">{totalCards}</span>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Total Cards</p>
           </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-all rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {text.resetAll}
        </button>
      </div>
    </div>
  );
};