import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Bookmark,
  MousePointerClick,
  Video,
  Sparkles,
  Zap,
  ArrowUpRight,
  Flame,
  Layers,
  Calendar,
  Share2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const DashboardOverview: React.FC = () => {
  const { instagramAccount, posts, generateAutoContentPlan, setActiveTab, autopilot, userStrategy } = useApp();

  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Dados mockados de crescimento de seguidores para os períodos
  const chartDataMap = {
    '7d': [
      { date: 'Seg', seguidores: 14610, alcance: 3200 },
      { date: 'Ter', seguidores: 14640, alcance: 4100 },
      { date: 'Qua', seguidores: 14690, alcance: 5200 },
      { date: 'Qui', seguidores: 14720, alcance: 4800 },
      { date: 'Sex', seguidores: 14760, alcance: 6900 },
      { date: 'Sáb', seguidores: 14790, alcance: 8100 },
      { date: 'Dom', seguidores: 14820, alcance: 9400 },
    ],
    '30d': [
      { date: 'Semana 1', seguidores: 13200, alcance: 14000 },
      { date: 'Semana 2', seguidores: 13750, alcance: 21000 },
      { date: 'Semana 3', seguidores: 14200, alcance: 28000 },
      { date: 'Semana 4', seguidores: 14820, alcance: 36500 },
    ],
    '90d': [
      { date: 'Mês 1', seguidores: 10400, alcance: 45000 },
      { date: 'Mês 2', seguidores: 12600, alcance: 78000 },
      { date: 'Mês 3', seguidores: 14820, alcance: 112000 },
    ],
    '1y': [
      { date: 'Q1', seguidores: 4200, alcance: 90000 },
      { date: 'Q2', seguidores: 7800, alcance: 160000 },
      { date: 'Q3', seguidores: 11500, alcance: 240000 },
      { date: 'Q4', seguidores: 14820, alcance: 380000 },
    ],
  };

  const currentChartData = chartDataMap[period];

  // Cálculo acumulado das métricas reais de posts publicados
  const publishedPosts = posts.filter((p) => p.status === 'published');
  const totalLikes = publishedPosts.reduce((acc, p) => acc + (p.analytics?.likes || 0), 0);
  const totalComments = publishedPosts.reduce((acc, p) => acc + (p.analytics?.comments || 0), 0);
  const totalSaves = publishedPosts.reduce((acc, p) => acc + (p.analytics?.saves || 0), 0);
  const totalShares = publishedPosts.reduce((acc, p) => acc + (p.analytics?.shares || 0), 0);
  const totalClicks = publishedPosts.reduce((acc, p) => acc + (p.analytics?.clicks || 0), 0);
  const totalReach = publishedPosts.reduce((acc, p) => acc + (p.analytics?.reach || 0), 0);
  const totalImpressions = publishedPosts.reduce((acc, p) => acc + (p.analytics?.impressions || 0), 0);

  const reelsCount = posts.filter((p) => p.type === 'reel').length;
  const carouselsCount = posts.filter((p) => p.type === 'carousel').length;
  const postsCount = posts.filter((p) => p.type === 'post').length;

  const formatK = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Banner de Boas-vindas SaaS & Action Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/50 border border-indigo-500/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-wider uppercase border border-indigo-500/30">
                Funcionário Digital com IA
              </span>
              {autopilot.enabled && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-emerald-400" /> Piloto Automático Ativo
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Olá, {userStrategy.profileName}! ✨
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              Sua IA está gerenciando o perfil no nicho <strong className="text-indigo-300">{userStrategy.niche}</strong> com foco em aumentar seguidores e cliques de afiliados.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('trends')}
              className="px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/60 flex items-center gap-2 transition-all"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Produtos Virais</span>
            </button>

            <button
              onClick={() => generateAutoContentPlan()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Criar Plano com IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de 12 Métricas Principais (Visão Geral) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Seguidores */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Seguidores</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl font-bold text-white">{instagramAccount.followersCount.toLocaleString('pt-BR')}</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +620 este mês
          </span>
        </div>

        {/* Alcance */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Alcance Total</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-white">{formatK(totalReach)}</p>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">Contas alcançadas</span>
        </div>

        {/* Impressões */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Impressões</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-white">{formatK(totalImpressions)}</p>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">Visualizações totais</span>
        </div>

        {/* Cliques em Links */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Cliques Afiliado</span>
            <MousePointerClick className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white">{totalClicks}</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> 5.8% CTR
          </span>
        </div>

        {/* Curtidas */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Curtidas</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-xl font-bold text-white">{totalLikes.toLocaleString('pt-BR')}</p>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">Interações diretas</span>
        </div>

        {/* Comentários */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Comentários</span>
            <MessageSquare className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-xl font-bold text-white">{totalComments}</p>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">Perguntas de links</span>
        </div>
      </div>

      {/* Segundas 6 Métricas de Salvamentos, Shares e Formatos */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Salvamentos</span>
            <span className="text-sm font-bold text-white">{totalSaves}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Compartilhamentos</span>
            <span className="text-sm font-bold text-white">{totalShares}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Reels Criados</span>
            <span className="text-sm font-bold text-white">{reelsCount}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Carrosséis</span>
            <span className="text-sm font-bold text-white">{carouselsCount}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Posts Estáticos</span>
            <span className="text-sm font-bold text-white">{postsCount}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Agendados</span>
            <span className="text-sm font-bold text-emerald-400">{posts.filter((p) => p.status === 'scheduled').length}</span>
          </div>
        </div>
      </div>

      {/* Gráfico principal: Crescimento de Seguidores & Distribuição de Estratégia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Recharts */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Crescimento de Seguidores</h3>
              <p className="text-xs text-slate-400">Evolução do perfil impulsionada pela IA</p>
            </div>
            {/* Seletor de Períodos: 7d, 30d, 90d, 1y */}
            <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['7d', '30d', '90d', '1y'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    period === p
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : p === '90d' ? '90 dias' : '1 ano'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSeguidores" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="seguidores" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorSeguidores)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição da Estratégia de Crescimento (40/25/20/15) */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Estratégia de Crescimento</h3>
            <p className="text-xs text-slate-400 mb-4">
              Distribuição inteligente aplicada pela IA para evitar transformar o perfil em um simples catálogo.
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-indigo-400">Atração de Seguidores (40%)</span>
                  <span className="text-slate-300">Reels & Carrosséis</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '40%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-pink-400">Entretenimento / Viral (25%)</span>
                  <span className="text-slate-300">Vídeos de Tendência</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-400">Autoridade / Utilidade (20%)</span>
                  <span className="text-slate-300">Dicas & Guias</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '20%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-400">Comercial / Ofertas (15%)</span>
                  <span className="text-slate-300">Links Direct & Bio</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
            💡 <strong>Objetivo da IA:</strong> Criar um perfil que as pessoas gostem de seguir mesmo quando não estão comprando!
          </div>
        </div>
      </div>
    </div>
  );
};
