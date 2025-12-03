import React from 'react';
import { Flashcard, Language } from '../types';
import { Play, Sparkles, BookOpen, CheckCircle, ChevronRight } from 'lucide-react';

interface Props {
  cards: Flashcard[];
  onStartStudy: () => void;
  lang: Language;
  onViewCategory: (category: 'new' | 'learning' | 'mastered') => void;
}

export const Dashboard: React.FC<Props> = ({ cards, onStartStudy, lang, onViewCategory }) => {
  const now = Date.now();
  const dueCards = cards.filter(c => c.srs.dueDate <= now || c.isNew);
  const mastered = cards.filter(c => c.srs.interval > 21);
  const learning = cards.filter(c => !c.isNew && c.srs.interval <= 21);
  const newCards = cards.filter(c => c.isNew);
  const totalCards = cards.length;

  const t = {
    en: {
      title: "Overview",
      new: "New",
      learning: "Learning",
      mastered: "Mastered",
      dist: "Progress",
      start: "Start Review",
      caughtUp: "All caught up",
      ready: (n: number) => `${n} cards due today`
    },
    zh: {
      title: "概览",
      new: "未学习",
      learning: "学习中",
      mastered: "已掌握",
      dist: "进度分布",
      start: "开始复习",
      caughtUp: "任务已完成",
      ready: (n: number) => `今天有 ${n} 张卡片待复习`
    }
  };
  const text = lang === 'zh' ? t.zh : t.en;

  // Configuration for the progress bars
  const categories = [
    { 
      id: 'new',
      label: text.new, 
      count: newCards.length, 
      // Neutral Gray
      barBg: 'bg-slate-100 dark:bg-white/5',
      fillColor: 'bg-slate-300 dark:bg-slate-500', 
      textColor: 'text-slate-500 dark:text-slate-400'
    },
    { 
      id: 'learning',
      label: text.learning, 
      count: learning.length, 
      // LeetCode Yellow
      barBg: 'bg-yellow-50 dark:bg-yellow-900/10',
      fillColor: 'bg-[#FFC01E]', 
      textColor: 'text-[#FFC01E]'
    },
    { 
      id: 'mastered',
      label: text.mastered, 
      count: mastered.length, 
      // LeetCode Green
      barBg: 'bg-green-50 dark:bg-green-900/10',
      fillColor: 'bg-[#00B8A3]', 
      textColor: 'text-[#00B8A3]'
    },
  ] as const;

  const StatCard = ({ 
    title, 
    count, 
    icon: Icon, 
    colorClass, 
    bgClass,
    onClick 
  }: { 
    title: string, 
    count: number, 
    icon: any, 
    colorClass: string, 
    bgClass: string,
    onClick: () => void
  }) => (
    <button 
      onClick={onClick}
      className="bg-white dark:bg-[#303134] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-transparent flex flex-col justify-between h-32 hover:shadow-md transition-all text-left group w-full outline-none focus:outline-none focus:ring-0"
    >
      <div className="flex items-center justify-between w-full text-slate-600 dark:text-slate-300">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${bgClass} ${colorClass}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="font-medium group-hover:text-google-blue transition-colors">{title}</span>
         </div>
         <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-google-blue transition-colors" />
      </div>
      <span className="text-4xl font-display text-slate-900 dark:text-white">{count}</span>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 font-sans">
      <h1 className="text-3xl font-display font-normal text-slate-800 dark:text-slate-100">{text.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat Cards */}
        <StatCard 
          title={text.new} 
          count={newCards.length} 
          icon={Sparkles} 
          colorClass="text-slate-500" 
          bgClass="bg-slate-100 dark:bg-white/10"
          onClick={() => onViewCategory('new')}
        />
        <StatCard 
          title={text.learning} 
          count={learning.length} 
          icon={BookOpen} 
          colorClass="text-google-yellow" 
          bgClass="bg-yellow-50 dark:bg-yellow-900/20"
          onClick={() => onViewCategory('learning')}
        />
        <StatCard 
          title={text.mastered} 
          count={mastered.length} 
          icon={CheckCircle} 
          colorClass="text-google-green" 
          bgClass="bg-green-50 dark:bg-green-900/20"
          onClick={() => onViewCategory('mastered')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Progress Distribution Chart (Custom Implementation) */}
        <div className="md:col-span-2 bg-white dark:bg-[#303134] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-transparent min-h-[300px] flex flex-col justify-center">
           <h3 className="font-medium text-slate-600 dark:text-slate-300 mb-8">{text.dist}</h3>
           
           <div className="space-y-6">
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => onViewCategory(cat.id as any)}
                  className="w-full flex items-center gap-6 group outline-none focus:outline-none focus:ring-0"
                >
                  {/* Label - Centered Vertically */}
                  <span className={`w-16 text-right text-sm font-medium ${cat.textColor} group-hover:opacity-80 transition-opacity`}>
                    {cat.label}
                  </span>
                  
                  {/* Progress Bar */}
                  <div className={`flex-1 h-3 ${cat.barBg} rounded-full overflow-hidden relative`}>
                    <div 
                      className={`h-full rounded-full ${cat.fillColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${totalCards > 0 ? Math.max((cat.count / totalCards) * 100, 0) : 0}%` }}
                    />
                  </div>
                  
                  {/* Count */}
                  <span className="w-8 text-left text-sm font-mono text-slate-400 dark:text-slate-500">
                    {cat.count}
                  </span>
                </button>
              ))}
           </div>
        </div>

        {/* Start Button Area */}
        <div className="bg-google-blue dark:bg-blue-700 text-white p-8 rounded-3xl shadow-md flex flex-col justify-center items-center text-center">
           <h2 className="text-2xl font-display font-medium mb-2">LeetCode Flash</h2>
           <p className="text-blue-100 mb-8">{text.ready(dueCards.length)}</p>
           
           <button 
             onClick={onStartStudy}
             disabled={dueCards.length === 0}
             className={`
               w-full py-3.5 rounded-full font-bold text-google-blue bg-white hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-sm
               ${dueCards.length === 0 ? 'opacity-70 cursor-not-allowed' : ''}
             `}
           >
             <Play className="w-5 h-5 fill-current" />
             {dueCards.length > 0 ? text.start : text.caughtUp}
           </button>
        </div>
      </div>
    </div>
  );
};