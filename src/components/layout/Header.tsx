import React from 'react';
import { useApp } from '../../context/AppContext';
import { InstagramIcon } from '../ui/Icons';
import { Sparkles, Plus, Loader2, Bot } from 'lucide-react';

export const Header: React.FC = () => {
  const { instagramAccount, generateAutoContentPlan, setActiveTab, jobs } = useApp();

  const activeJobs = jobs.filter((j) => j.status === 'processing' || j.status === 'rendering');

  return (
    <header className="h-16 bg-slate-900/60 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-xs">
          <InstagramIcon className="w-4 h-4 text-pink-400" />
          <span className="text-slate-300">
            {instagramAccount.isConnected ? `@${instagramAccount.username}` : 'Instagram Desconectado'}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              instagramAccount.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
            }`}
          />
        </div>

        {activeJobs.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-300 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>IA Renderizando ({activeJobs.length} em fila)</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('consultant')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 transition-all"
        >
          <Bot className="w-4 h-4 text-purple-400" />
          <span>Consultor IA</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 transition-all"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add Produto</span>
        </button>

        <button
          onClick={() => generateAutoContentPlan()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>✨ CRIAR CONTEÚDO COM IA</span>
        </button>
      </div>
    </header>
  );
};
