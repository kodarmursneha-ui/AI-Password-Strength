import React from 'react';
import { AnalysisResult } from '../types';
import { Icons } from '../constants';

interface StrengthDisplayProps {
  analysis: AnalysisResult | null;
  loading: boolean;
  validation: {
    hasMinLength: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
  };
}

const getScoreColor = (score: number) => {
  if (score < 40) return 'bg-red-500 text-red-500';
  if (score < 70) return 'bg-yellow-500 text-yellow-500';
  if (score < 90) return 'bg-blue-500 text-blue-500';
  return 'bg-emerald-500 text-emerald-500';
};

const getScoreBorder = (score: number) => {
   if (score < 40) return 'border-red-500/30 bg-red-500/10';
   if (score < 70) return 'border-yellow-500/30 bg-yellow-500/10';
   if (score < 90) return 'border-blue-500/30 bg-blue-500/10';
   return 'border-emerald-500/30 bg-emerald-500/10';
}

export const StrengthDisplay: React.FC<StrengthDisplayProps> = ({ analysis, loading, validation }) => {
  if (loading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center text-slate-400 animate-pulse">
        <Icons.Sparkles />
        <p className="mt-3 text-sm font-medium">AI is analyzing entropy...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-slate-500">
         <div className={`p-2 rounded border ${validation.hasMinLength ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-slate-700 bg-slate-800'}`}>
            8+ Characters
         </div>
         <div className={`p-2 rounded border ${validation.hasUpperCase ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-slate-700 bg-slate-800'}`}>
            Uppercase
         </div>
         <div className={`p-2 rounded border ${validation.hasLowerCase ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-slate-700 bg-slate-800'}`}>
            Lowercase
         </div>
         <div className={`p-2 rounded border ${validation.hasNumber ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-slate-700 bg-slate-800'}`}>
            Number
         </div>
         <div className={`p-2 rounded border ${validation.hasSpecialChar ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-slate-700 bg-slate-800'}`}>
            Symbol
         </div>
      </div>
    );
  }

  const scoreColorClass = getScoreColor(analysis.score);
  const cardClass = getScoreBorder(analysis.score);

  return (
    <div className="space-y-6 mt-8 animate-fade-in">
      {/* Score Header */}
      <div className={`p-6 rounded-2xl border ${cardClass} flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500`}>
         <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-700/50" />
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent"
                          strokeDasharray={226}
                          strokeDashoffset={226 - (226 * analysis.score) / 100}
                          className={`${scoreColorClass.split(' ')[1]} transition-all duration-1000 ease-out`}
                  />
               </svg>
               <span className="absolute text-xl font-bold text-white">{analysis.score}</span>
            </div>
            <div>
               <h3 className="text-2xl font-bold text-white tracking-tight">{analysis.label}</h3>
               <p className="text-slate-400 text-sm mt-1">Estimated Crack Time: <span className="text-slate-200 font-mono">{analysis.crackTimeDisplay}</span></p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
           <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Strengths
           </h4>
           <ul className="space-y-2">
              {analysis.strengths.length > 0 ? (
                 analysis.strengths.map((item, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                       <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 shrink-0"></span>
                       {item}
                    </li>
                 ))
              ) : (
                 <li className="text-sm text-slate-500 italic">None identified</li>
              )}
           </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
           <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              Weaknesses
           </h4>
           <ul className="space-y-2">
              {analysis.weaknesses.length > 0 ? (
                 analysis.weaknesses.map((item, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                       <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 shrink-0"></span>
                       {item}
                    </li>
                 ))
              ) : (
                 <li className="text-sm text-slate-500 italic">None identified</li>
              )}
           </ul>
        </div>
      </div>

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
         <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-5">
            <h4 className="text-indigo-400 font-semibold mb-3 flex items-center gap-2">
               <Icons.Sparkles />
               AI Suggestions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {analysis.suggestions.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-indigo-950/30 p-3 rounded-lg border border-indigo-500/10">
                     <span className="text-indigo-400 font-bold text-xs mt-0.5">0{i + 1}</span>
                     <p className="text-sm text-indigo-100/80 leading-relaxed">{item}</p>
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );
};