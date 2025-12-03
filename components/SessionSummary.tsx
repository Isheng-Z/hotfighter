
import React, { useEffect } from 'react';
import { Language } from '../types';
import { Home, RefreshCw, Trophy, XCircle, CheckCircle } from 'lucide-react';
import { triggerFireworks } from '../utils/confetti';

interface Props {
  results: boolean[]; // true = known, false = unknown
  onHome: () => void;
  lang: Language;
}

export const SessionSummary: React.FC<Props> = ({ results, onHome, lang }) => {
  const total = results.length;
  const correct = results.filter(r => r).length;
  const percentage = Math.round((correct / total) * 100);

  useEffect(() => {
    // Trigger fireworks if score is decent (> 0)
    if (correct > 0) {
      triggerFireworks();
    }
  }, [correct]);

  const t = {
    en: {
      title: "Session Complete!",
      score: "Your Score",
      mastered: "Mastered",
      review: "Needs Review",
      home: "Back to Dashboard",
      msgGreat: "Outstanding work!",
      msgGood: "Good job!",
      msgKeepTrying: "Keep practicing!"
    },
    zh: {
      title: "练习完成！",
      score: "本次得分",
      mastered: "已掌握",
      review: "需复习",
      home: "返回主页",
      msgGreat: "太棒了，继续保持！",
      msgGood: "做得不错！",
      msgKeepTrying: "再接再厉，熟能生巧！"
    }
  };

  const text = lang === 'zh' ? t.zh : t.en;
  
  let message = text.msgKeepTrying;
  if (percentage >= 80) message = text.msgGreat;
  else if (percentage >= 50) message = text.msgGood;

  return (
    <div className="flex flex-col items-center justify-center h-full animate-slide-up px-4">
      <div className="glass rounded-3xl p-8 lg:p-12 w-full max-w-lg text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="mb-6 inline-flex p-4 bg-slate-50 dark:bg-slate-800 rounded-full shadow-lg">
          <Trophy className={`w-12 h-12 ${percentage >= 80 ? 'text-yellow-500' : 'text-slate-400'}`} />
        </div>

        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-2">
          {text.title}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-serif italic">{message}</p>

        <div className="flex items-center justify-center gap-2 mb-8">
           <span className="text-6xl font-bold font-mono text-slate-800 dark:text-slate-100">{percentage}</span>
           <span className="text-2xl text-slate-400 font-serif">%</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-4 rounded-2xl flex flex-col items-center">
            <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
            <span className="text-2xl font-bold text-slate-700 dark:text-emerald-100">{correct}</span>
            <span className="text-xs uppercase tracking-widest text-emerald-600/70 dark:text-emerald-400">{text.mastered}</span>
          </div>
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 p-4 rounded-2xl flex flex-col items-center">
            <XCircle className="w-6 h-6 text-rose-500 mb-2" />
            <span className="text-2xl font-bold text-slate-700 dark:text-rose-100">{total - correct}</span>
            <span className="text-xs uppercase tracking-widest text-rose-600/70 dark:text-rose-400">{text.review}</span>
          </div>
        </div>

        <button 
          onClick={onHome}
          className="w-full py-4 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-bold font-serif flex items-center justify-center gap-2 hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <Home className="w-5 h-5" />
          {text.home}
        </button>
      </div>
    </div>
  );
};
