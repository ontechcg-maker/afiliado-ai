import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FolderKanban, Search, Filter } from 'lucide-react';

export const ContentLibrary: React.FC = () => {
  const { posts } = useApp();

  const [search, setSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('todos');

  const filtered = posts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.caption.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'todos' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-6 h-6 text-indigo-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Biblioteca de Conteúdos</h2>
            <p className="text-xs text-slate-400">Repositório de todas as artes, vídeos, carrosséis e roteiros criados</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar em todo o histórico de conteúdos..."
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
              <option value="reel">Reels</option>
              <option value="carousel">Carrosséis</option>
              <option value="post">Posts Estáticos</option>
              <option value="story">Stories</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <div key={post.id} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            {post.coverUrl && (
              <img src={post.coverUrl} alt="" className="w-full h-40 object-cover rounded-2xl border border-slate-800" />
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-400 uppercase text-[10px]">{post.type}</span>
              <span className="text-[10px] text-slate-400">{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <h3 className="text-xs font-bold text-white line-clamp-1">{post.title}</h3>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{post.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
