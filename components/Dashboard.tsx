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
      progress: "Progress",
      start: "Start Review",
      caughtUp: "All Caught Up",
      dueCount: "Due",
      newCount: "New Problems",
      settings: "Daily Limit",
      resetAll: "Reset Data",
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
      caughtUp: "已完成",
      dueCount: "待复习",
      newCount: "新题",
      settings: "每日上限",
      resetAll: "重置数据",
      resetConfirm: "确定要清空所有学习进度并恢复初始状态吗？此操作无法撤销。"
    }
  };
  const text = lang === 'zh' ? t.zh : t.en;

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling
    if (window.confirm(text.resetConfirm)) {
      onResetAll();
    }
  };

  const adjustLimit = (delta: number) => {
    const newVal = Math.max(0, Math.min(50, dailyNewLimit + delta));
    onSetDailyNewLimit(newVal);
  };

  const categories = [
    { 
      id: 'new',
      label: text.new, 
      count: newCards.length, 
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
      bg: 'bg-stone-50 dark:bg-slate-800/40',
      border: 'border-stone-100 dark:border-slate-700',
      text: 'text-stone-600 dark:text-slate-400',
      icon: CheckCircle,
      iconBg: 'bg-stone-100 dark:bg-slate-800'
    },
  ] as const;

  return (
    <div className="flex flex-col h-full animate-slide-up relative px-1 lg:px-0">
      
      <header className="text-center pb-4 flex-none relative">
        <h1 className="text-3xl lg:text-5xl font-serif font-medium text-slate-800 dark:text-slate-200 mb-1 lg:mb-2 tracking-tight drop-shadow-sm">
          {text.title}
        </h1>
        <p className="text-xs lg:text-base text-slate-500 dark:text-slate-400 font-light font-serif italic">
          {text.subtitle}
        </p>
      </header>
      
      {/* Stats Row - Medium Cards */}
      <div className="grid grid-cols-3 gap-3 lg:gap-6 flex-none mb-4 lg:mb-6">
        {categories.map((cat, idx) => (
          <button 
            key={cat.id}
            onClick={() => onViewCategory(cat.id as any)}
            className={`
              group relative rounded-3xl py-6 lg:py-0 transition-all duration-500 hover:-translate-y-2
              border ${cat.border} ${cat.bg}
              shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50
              backdrop-blur-sm flex flex-col items-center justify-center
              h-32 lg:h-40 w-full cursor-pointer
            `}
            style={{ animationDelay: `${idx * 150}ms` }}
          >
             {/* Absolutely positioned icon to prevent layout shift */}
            <div className={`absolute top-4 right-4 p-2.5 rounded-full ${cat.iconBg} ${cat.text} transition-transform duration-500 group-hover:scale-110 hidden lg:flex`}>
              <cat.icon className="w-5 h-5" />
            </div>

             {/* Centered Content */}
             <div className="flex flex-col items-center justify-center w-full relative">
                <div className={`text-4xl lg:text-6xl font-serif font-medium ${cat.text} mb-2 lg:mb-3 tracking-tight group-hover:scale-110 transition-transform duration-500`}>
                  {cat.count}
                </div>
                <div className={`text-[10px] lg:text-sm font-bold uppercase tracking-widest ${cat.text} opacity-80 flex items-center justify-center gap-1`}>
                  {cat.label}
                </div>
                {/* Chevron absolutely positioned to not affect center alignment */}
                <ChevronRight className={`w-3 h-3 lg:w-4 lg:h-4 absolute left-[65%] top-full mt-1 opacity-0 group-hover:opacity-100 transition-all ${cat.text}`} />
             </div>
          </button>
        ))}
      </div>

      {/* Main Content Area - Fill Remaining Height */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6 flex-1 min-h-0 pb-8 lg:pb-0">
        
        {/* Main Action - Left Side */}
        <div className="lg:col-span-2 glass rounded-3xl p-5 lg:p-10 flex flex-col justify-between relative overflow-hidden group h-full">
           {/* Decorative background blob */}
           <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-parasol-sky/20 to-parasol-grass/20 dark:from-sunrise-sun/10 dark:to-sunrise-water/20 rounded-full blur-3xl -z-10 transition-colors duration-1000"></div>

           <div className="relative z-10 flex-1 flex flex-col justify-center items-center">
             <h2 className="text-xl lg:text-3xl font-serif font-medium text-slate-800 dark:text-slate-100 mb-8 lg:mb-12 text-center">
               {sessionCount > 0 ? text.start : text.caughtUp}
             </h2>
             
             <div className="flex justify-center items-center gap-12 lg:gap-24 mb-8 lg:mb-12 w-full">
                 <div className="text-center w-32">
                   <div className="text-sm lg:text-base font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 lg:mb-4">{text.dueCount}</div>
                   <div className="text-5xl lg:text-7xl font-serif font-medium text-slate-700 dark:text-slate-200">{dueCount}</div>
                 </div>
                 
                 {/* Visible Divider - Clean Vertical Line */}
                 <div className="w-px bg-slate-300 dark:bg-slate-600 h-16 lg:h-24 mx-2 opacity-50"></div>
                 
                 <div className="text-center w-32">
                   <div className="text-sm lg:text-base font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 lg:mb-4">{text.newCount}</div>
                   <div className="text-5xl lg:text-7xl font-serif font-medium text-slate-700 dark:text-slate-200">{newCountToReview}</div>
                 </div>
             </div>
           </div>
           
           <div className="space-y-4 relative z-20 flex flex-col lg:flex-row items-center gap-4 mt-auto w-full">
             {/* Compact Controls Bar */}
             <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-900/60 p-1.5 rounded-full border border-white/60 dark:border-slate-700 backdrop-blur-sm shadow-sm pointer-events-auto">
               {/* Daily Limit Settings */}
               <div className="flex items-center gap-2 pl-3 pr-2 border-r border-slate-200 dark:border-slate-700/50">
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{text.settings}:</span>
                 <div className="flex items-center gap-2">
                   <button onClick={() => adjustLimit(-5)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"><Minus className="w-3 h-3" /></button>
                   <span className="text-sm font-mono w-5 text-center text-slate-700 dark:text-slate-200">{dailyNewLimit}</span>
                   <button onClick={() => adjustLimit(5)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"><Plus className="w-3 h-3" /></button>
                 </div>
               </div>

               {/* Reset Button */}
               <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-rose-500 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={text.resetAll}
               >
                 <RefreshCw className="w-3.5 h-3.5" />
                 <span className="hidden sm:inline">{text.resetAll}</span>
               </button>
             </div>

             <button 
               onClick={onStartStudy}
               disabled={sessionCount === 0}
               className={`
                 flex-1 w-full py-4 rounded-2xl font-serif font-bold text-lg transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden cursor-pointer
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

        {/* Visual Progress - Right Side */}
        <div className="hidden lg:flex glass rounded-3xl p-8 flex-col justify-between h-full relative">
           <div className="flex items-center gap-3 mb-4 justify-start flex-none">
             <LayoutDashboard className="w-5 h-5 text-slate-400" />
             <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 tracking-wide">
               {text.progress}
             </h3>
           </div>
           
           <div className="space-y-8 flex-1 flex flex-col justify-center">
              {categories.map((cat) => (
                <div key={cat.id} className="relative group">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-medium text-slate-600 dark:text-slate-400">{cat.label}</span>
                    <span className="font-mono text-slate-500">{Math.round((cat.count / Math.max(totalCards, 1)) * 100)}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${cat.text.replace('text-', 'bg-')} transition-all duration-1000 ease-out relative overflow-hidden`}
                      style={{ width: `${totalCards > 0 ? (cat.count / totalCards) * 100 : 0}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
           <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/50 text-center flex-none">
               <span className="text-4xl font-serif font-bold text-slate-800 dark:text-slate-100">{totalCards}</span>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Cards</p>
           </div>
        </div>
      </div>
    </div>
  );
};