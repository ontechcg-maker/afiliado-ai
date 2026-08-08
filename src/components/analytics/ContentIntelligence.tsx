import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Sparkles, Award, Eye, Heart, Bookmark, MousePointerClick } from 'lucide-react';

export const ContentIntelligence: React.FC = () => {
  const { posts } = useApp();

  const publishedPosts = posts.filter((p) => p.status === 'published');
  const sortedPosts = [...publishedPosts].sort((a, b) => (b.analytics.reach || 0) - (a.analytics.reach || 0));

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>CONTENT INTELLIGENCE & ANALYTICS</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            IA Que Aprende Com o Seu Perfil
          </h2>
          <p className="text-xs text-slate-300">
            O algoritmo do AFILIADO.AI analisa continuadamente a retenção, os salvamentos e as vendas para otimizar os próximos posts.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3>Insights Inteligentes Gerados Pela IA</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
              +42% Retenção
            </span>
            <p className="text-slate-200 font-semibold">Reels com Demonstração Prática do Produto</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Vídeos no formato "Problema / Solução" apresentaram taxa de retenção até os 15 segundos significativamente maior do que posts estáticos.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold text-[10px]">
              520 Salvamentos
            </span>
            <p className="text-slate-200 font-semibold">Carrosséis de Lista por Menos de R$50</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Postagens com compilados de achadinhos geram alto volume de salvamentos, sinalizando autoridade para o algoritmo do Instagram.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">
              Pico às 19:30h
            </span>
            <p className="text-slate-200 font-semibold">Maior Taxa de Clique nos Links</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Os Stories publicados no horário noturno geram 3.2x mais mensagens no Direct com pedidos de link.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Ranking dos Seus Melhores Conteúdos</h3>
        </div>

        {sortedPosts.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">Nenhum conteúdo publicado para ranquear no momento.</p>
        ) : (
          <div className="space-y-3">
            {sortedPosts.map((post, index) => (
              <div
                key={post.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-indigo-600/20 text-indigo-400 font-black text-xs flex items-center justify-center border border-indigo-500/30">
                    #{index + 1}
                  </span>
                  {post.coverUrl && (
                    <img src={post.coverUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-800" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{post.title}</h4>
                    <span className="text-[10px] text-slate-400 uppercase">{post.type} • {post.strategyCategory}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{post.analytics.reach.toLocaleString('pt-BR')} Alcance</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>{post.analytics.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{post.analytics.saves}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-400 font-bold">{post.analytics.clicks} Clicks</span>
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
