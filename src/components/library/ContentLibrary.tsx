import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FolderKanban, Search, Filter, Eye, Download, X } from 'lucide-react';
import type { ContentPost } from '../../types';

export const ContentLibrary: React.FC = () => {
  const { posts } = useApp();

  const [search, setSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('todos');
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const filtered = posts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.caption.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'todos' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'reel':
        return <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold">REEL 9:16</span>;
      case 'carousel':
        return <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold">CARROSSEL 1:1</span>;
      case 'post':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">POST</span>;
      case 'story':
        return <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 text-[10px] font-bold">STORY 9:16</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">{type.toUpperCase()}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-6 h-6 text-indigo-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Galeria de Artes & Conteúdos Gerados</h2>
            <p className="text-xs text-slate-400">Visualize em alta resolução, expanda e baixe todas as mídias e artes renderizadas pela IA</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título ou produto..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="todos">Todos os Formatos</option>
              <option value="reel">Reels (9:16)</option>
              <option value="carousel">Carrosséis (1:1)</option>
              <option value="post">Posts Estáticos</option>
              <option value="story">Stories (9:16)</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800/60 text-center space-y-3">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">Nenhuma Arte Encontrada</h4>
          <p className="text-xs text-slate-400">Gere um Reel ou Carrossel no estúdio para visualizá-lo na galeria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => {
            const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
            const coverImage = hasMedia ? post.mediaUrls[0] : post.coverUrl;

            return (
              <div
                key={post.id}
                onClick={() => {
                  setSelectedPost(post);
                  setActiveImageIndex(0);
                }}
                className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 backdrop-blur-sm space-y-4 cursor-pointer group transition-all"
              >
                {coverImage && (
                  <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-800">
                    <img src={coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {getTypeBadge(post.type)}
                    </div>
                    {hasMedia && post.mediaUrls.length > 1 && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/80 text-[10px] font-bold text-white backdrop-blur-md">
                        📸 {post.mediaUrls.length} Artes Renderizadas
                      </span>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">{post.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{post.caption}</p>
                </div>

                <button
                  type="button"
                  className="w-full py-2 rounded-xl bg-indigo-600/20 group-hover:bg-indigo-600 text-indigo-300 group-hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visualizar Artes em HD</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Visualização & Download de Artes */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              {getTypeBadge(selectedPost.type)}
              <h3 className="text-lg font-black text-white">{selectedPost.title}</h3>
            </div>

            {/* Carrossel / Galeria de Imagens Renderizadas */}
            {selectedPost.mediaUrls && selectedPost.mediaUrls.length > 0 ? (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-indigo-500/30 bg-slate-950 flex items-center justify-center min-h-[300px] max-h-[450px]">
                  <img
                    src={selectedPost.mediaUrls[activeImageIndex] || selectedPost.coverUrl}
                    alt={`Arte ${activeImageIndex + 1}`}
                    className="max-h-[420px] w-auto object-contain shadow-2xl rounded-xl"
                  />
                  <button
                    onClick={() =>
                      handleDownload(
                        selectedPost.mediaUrls[activeImageIndex] || selectedPost.coverUrl || '',
                        `arte-${selectedPost.type}-${activeImageIndex + 1}.png`
                      )
                    }
                    className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Arte (PNG HD)</span>
                  </button>
                </div>

                {selectedPost.mediaUrls.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedPost.mediaUrls.map((url, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                          activeImageIndex === idx ? 'border-indigo-500 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Thumb ${idx + 1}`} className="w-16 h-16 object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400">Nenhuma imagem renderizada anexada a este post.</p>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="text-slate-400 font-bold block">Legenda da Publicação:</span>
              <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedPost.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
