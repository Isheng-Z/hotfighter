
import React from 'react';
import { Question, Language } from '../types';
import { Play, Book, Minus, Plus, RefreshCw, ArrowLeft } from 'lucide-react';

interface Props {
  totalCount: number;
  onStartPractice: (count: number) => void;
  onOpenLibrary: () => void;
  lang: Language;
}

export const Dashboard: React.FC<Props> = ({ 
  totalCount,
  onStartPractice, 
  onOpenLibrary,
  lang, 
}) => {
  const [practiceCount, setPracticeCount] = React.useState(10);

  const t = {
    en: {
      title: "LeetCode Flash",
      subtitle: "Randomized practice. No pressure.",
      start: "Start Practice",
      library: "Question Bank",
      practiceConfig: "Practice Session Size",
      questions: "Questions",
      total: "Total Available"
    },
    zh: {
      title: "LeetCode Flash",
      subtitle: "随机抽题，无压练习。",
      start: "开始练习",
      library: "完整题库",
      practiceConfig: "本次练习题量",
      questions: "道题目",
      total: "题库总数"
    }
  };
  const text = lang === 'zh' ? t.zh : t.en;

  const adjustCount = (delta: number) => {
    setPracticeCount(prev => Math.max(5, Math.min(totalCount, prev + delta)));
  };

  return (
    <div className="flex flex-col h-full animate-slide-up relative px-1 lg:px-0 justify-center">
      
      <header className="text-center pb-12 flex-none relative">
        <h1 className="text-4xl lg:text-6xl font-serif font-medium text-slate-800 dark:text-slate-200 mb-3 lg:mb-4 tracking-tight drop-shadow-sm">
          {text.title}
        </h1>
        <p className="text-sm lg:text-lg text-slate-500 dark:text-slate-400 font-light font-serif italic">
          {text.subtitle}
        </p>
      </header>

      <div className="max-w-md mx-auto w-full space-y-8 relative z-10">
        
        {/* Practice Config Card */}
        <div className="glass rounded-3xl p-8 flex flex-col items-center gap-6 relative overflow-hidden">
           {/* Decorative Blob */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-parasol-sky/20 to-parasol-grass/20 dark:from-sunrise-sun/10 dark:to-sunrise-water/20 rounded-full blur-3xl -z-10"></div>
           
           <div className="text-center">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{text.practiceConfig}</label>
             <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={() => adjustCount(-5)}
                  className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <div className="text-5xl font-serif font-bold text-slate-700 dark:text-slate-200 w-24 text-center tabular-nums">
                  {practiceCount}
                </div>
                <button 
                  onClick={() => adjustCount(5)}
                  className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500"
                >
                  <Plus className="w-6 h-6" />
                </button>
             </div>
             <div className="text-sm text-slate-400 mt-2 font-mono">{text.questions}</div>
           </div>

           <button 
             onClick={() => onStartPractice(practiceCount)}
             className="w-full py-4 rounded-2xl font-serif font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl text-white"
           >
             <div className="absolute inset-0 bg-slate-800 dark:bg-sunrise-sun opacity-100 transition-opacity"></div>
             <Play className="w-5 h-5 fill-current relative z-10" />
             <span className="relative z-10">{text.start}</span>
           </button>
        </div>

        {/* Library Button */}
        <button 
          onClick={onOpenLibrary}
          className="w-full glass rounded-2xl p-5 flex items-center justify-between group hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
               <Book className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-serif font-bold text-lg text-slate-700 dark:text-slate-200">{text.library}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{totalCount} {text.total}</div>
            </div>
          </div>
          <div className="text-slate-300 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </div>
        </button>

      </div>
    </div>
  );
};
