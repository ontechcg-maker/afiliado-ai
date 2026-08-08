import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIContentEngine } from '../../services/aiContentEngine';
import { Image, Sparkles, Wand2, Hash, MessageSquare } from 'lucide-react';

export const PostStudio: React.FC = () => {
  const { products, createPost, setActiveTab, addToast } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [postTypeCategory, setPostTypeCategory] = useState<string>('Produto');
  const [styleTone, setStyleTone] = useState<'Viral' | 'Conversão' | 'Engajamento'>('Conversão');
  const [generatedPost, setGeneratedPost] = useState<{ caption: string; hashtags: string[]; cta: string } | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const categories = [
    { name: 'Produto', desc: 'Mostrar produto + benefício + CTA' },
    { name: 'Lista', desc: '"7 produtos que facilitam sua vida"' },
    { name: 'Curiosidade', desc: '"Você sabia disso?"' },
    { name: 'Comparação', desc: '"Produto A vs Produto B"' },
    { name: 'Ranking', desc: '"5 produtos que estão bombando"' },
    { name: 'Problema/Solução', desc: '"Se você sofre com X, veja isso."' },
    { name: 'Conteúdo viral', desc: 'Pensado estritamente para compartilhamento' },
  ];

  const handleGeneratePost = () => {
    if (!selectedProduct) {
      addToast('Cadastre um produto primeiro!', 'warning');
      return;
    }

    const result = AIContentEngine.generateCaptionAndHashtags(selectedProduct, styleTone);
    setGeneratedPost(result);
    addToast('📸 Post estático e legendas gerados!', 'success');
  };

  const handleSchedulePost = () => {
    if (!generatedPost || !selectedProduct) return;

    createPost({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      title: `[Post ${postTypeCategory}] ${selectedProduct.name}`,
      type: 'post',
      strategyCategory: 'commercial',
      status: 'scheduled',
      scheduledFor: new Date(Date.now() + 3600000 * 6).toISOString(),
      mediaUrls: [selectedProduct.photoUrl],
      coverUrl: selectedProduct.photoUrl,
      caption: generatedPost.caption,
      hashtags: generatedPost.hashtags,
      cta: generatedPost.cta,
    });

    setActiveTab('calendar');
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto animate-fadeIn">
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Image className="w-4 h-4 text-emerald-400" />
            <span>GERADOR DE POSTS ESTÁTICOS</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Criador de Publicações de Alta Conversão
          </h2>
          <p className="text-xs text-slate-300">
            Gere legendas magnéticas, conjuntos de hashtags inteligentes e CTAs persuasivos em segundos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <h3 className="text-base font-bold text-white mb-2">Configurar Post</h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Produto Alvo</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (R${p.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Estilo da Legenda</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Viral', 'Conversão', 'Engajamento'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyleTone(s)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    styleTone === s
                      ? 'bg-emerald-600 text-white border border-emerald-500 shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Formato do Conteúdo</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {categories.map((c) => (
                <div
                  key={c.name}
                  onClick={() => setPostTypeCategory(c.name)}
                  className={`p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                    postTypeCategory === c.name
                      ? 'bg-emerald-600/20 border-emerald-500 text-white font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="font-bold text-slate-200">{c.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGeneratePost}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:opacity-95"
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>Gerar Post & Legendas</span>
          </button>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {generatedPost && selectedProduct ? (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Post Estático • {postTypeCategory}
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">{selectedProduct.name}</h3>
                </div>
                <button
                  onClick={handleSchedulePost}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Agendar Post</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                    <MessageSquare className="w-4 h-4" /> Legenda Gerada pela IA
                  </div>
                  <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">{generatedPost.caption}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
                    <Hash className="w-4 h-4" /> Grupos de Hashtags Inteligentes
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {generatedPost.hashtags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] font-medium text-slate-300 border border-slate-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800/60 text-center space-y-4 flex flex-col items-center justify-center min-h-[350px]">
              <Image className="w-12 h-12 text-slate-600 mx-auto" />
              <div>
                <h4 className="text-base font-bold text-white">Nenhum Post Gerado</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Escolha o produto ao lado e clique em "Gerar Post & Legendas" para visualizar o conteúdo.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
