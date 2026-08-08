import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { PostStatus } from '../../types';
import { Calendar as CalendarIcon, Clock, Send, Trash2, Video, Layers, Image, Smartphone } from 'lucide-react';

export const EditorialCalendar: React.FC = () => {
  const { posts, publishPostNow, deletePost, autopilot, updateAutopilotSettings } = useApp();

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const selectedPost = posts.find((p) => p.id === selectedPostId);

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
            🟢 Publicado
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold">
            🔵 Agendado
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
            🟡 Rascunho
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
            🔴 Erro
          </span>
        );
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reel':
        return <Video className="w-3.5 h-3.5 text-indigo-400" />;
      case 'carousel':
        return <Layers className="w-3.5 h-3.5 text-purple-400" />;
      case 'post':
        return <Image className="w-3.5 h-3.5 text-emerald-400" />;
      case 'story':
        return <Smartphone className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Calendário Editorial Inteligente</h2>
            </div>
            <p className="text-xs text-slate-400">
              Visualize, aprove e gerencie todas as publicações agendadas pela IA para o Instagram.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            {(['month', 'week', 'day'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === m
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m === 'month' ? 'Mês' : m === 'week' ? 'Semana' : 'Dia'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-indigo-200 block">💡 Sugestão de Horário Inteligente Meta API</span>
              <span className="text-[11px] text-slate-400">
                Seu público apresenta maior pico de atividade entre 18:00h e 21:00h. Melhores postagens: <strong>11:30</strong> e <strong>19:30</strong>.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-200 block">Modo de Publicação</span>
              <span className="text-[10px] text-slate-400">
                {autopilot.requireApproval ? 'Modo Aprovação (IA cria e aguarda você aprovar)' : 'Modo Automático Direto'}
              </span>
            </div>
            <button
              onClick={() => updateAutopilotSettings({ requireApproval: !autopilot.requireApproval })}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                autopilot.requireApproval
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
            >
              {autopilot.requireApproval ? 'Alternar p/ Automático' : 'Alternar p/ Aprovação'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPostId(post.id)}
            className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 backdrop-blur-sm space-y-4 flex flex-col justify-between transition-all cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-800">{getTypeIcon(post.type)}</div>
                  <span className="text-xs font-bold text-slate-200 uppercase">{post.type}</span>
                </div>
                {getStatusBadge(post.status)}
              </div>

              {post.coverUrl && (
                <div className="relative h-36 rounded-2xl overflow-hidden border border-slate-800">
                  <img src={post.coverUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {new Date(post.scheduledFor).toLocaleDateString('pt-BR')} às {new Date(post.scheduledFor).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold text-white line-clamp-1">{post.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{post.caption}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
              {post.status === 'scheduled' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    publishPostNow(post.id);
                  }}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Agora</span>
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePost(post.id);
                }}
                className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {getTypeIcon(selectedPost.type)}
                <h3 className="text-base font-bold text-white">{selectedPost.title}</h3>
              </div>
              {getStatusBadge(selectedPost.status)}
            </div>

            {selectedPost.mediaUrls && selectedPost.mediaUrls.length > 0 && (
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block text-xs">Mídias Renderizadas ({selectedPost.mediaUrls.length}):</span>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedPost.mediaUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Mídia ${idx + 1}`}
                      className="h-32 w-auto object-cover rounded-xl border border-slate-800 shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                <strong>Horário Agendado:</strong> {new Date(selectedPost.scheduledFor).toLocaleString('pt-BR')}
              </p>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-bold block mb-1">Legenda:</span>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedPost.caption}</p>
              </div>

              {selectedPost.cta && (
                <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300">
                  <strong>CTA:</strong> {selectedPost.cta}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedPostId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Fechar
              </button>
              {selectedPost.status === 'scheduled' && (
                <button
                  onClick={() => {
                    publishPostNow(selectedPost.id);
                    setSelectedPostId(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar no Instagram Agora</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
