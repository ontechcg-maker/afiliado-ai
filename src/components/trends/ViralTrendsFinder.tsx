import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Sparkles, Search, Wand2, Loader2 } from 'lucide-react';
import type { ViralProductTrend } from '../../types';

export const ViralTrendsFinder: React.FC = () => {
  const { viralTrends, addProduct, generateAutoCampaignForProduct, addToast } = useApp();

  const [nicheQuery, setNicheQuery] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [customTrends, setCustomTrends] = useState<ViralProductTrend[]>([]);

  const displayTrends = customTrends.length > 0 ? customTrends : viralTrends;

  const handleSearchTrends = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicheQuery) return;

    setSearching(true);
    addToast(`🤖 Gemini 2.5 Pro buscando produtos virais em alta para "${nicheQuery}"...`, 'info');

    try {
      await new Promise((r) => setTimeout(r, 1200));

      const newTrends: ViralProductTrend[] = [
        {
          id: `trend-${Date.now()}-1`,
          productName: `Mini Aspirador Portátil Sem Fio Turbo (${nicheQuery})`,
          category: nicheQuery,
          sampleImageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80',
          potentialEngagement: 'Muito Alto 🔥 (+420% buscas)',
          viralReason: 'Vídeos de limpeza satisfatória (ASMR) no TikTok com alta taxa de compartilhamento.',
          reelIdea: 'Vídeo mostrando aspirador limpando teclado e migalhas do carro com áudio viral.',
          carouselIdea: '5 Lugares que você esquece de limpar e este mini aspirador resolve.',
          postIdea: 'Post comparativo do mini aspirador vs limpeza tradicional.',
          cta: 'Comente "EU QUERO" para receber o link com desconto no direct!',
        },
        {
          id: `trend-${Date.now()}-2`,
          productName: `Organizador Giratório 360° Multiuso`,
          category: nicheQuery,
          sampleImageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
          potentialEngagement: 'Alto ⭐️ (Alta conversão)',
          viralReason: 'Tendência de Restock & Organização de Armários.',
          reelIdea: 'Antes e Depois do armário da cozinha antes do organizador giratório.',
          carouselIdea: 'Como transformar sua bancada gastando menos de R$ 40.',
          postIdea: 'Dicas de organização de temperos e maquiagem.',
          cta: 'Clique no link da bio para garantir o seu antes que esgote!',
        },
      ];

      setCustomTrends(newTrends);
      addToast('✨ Tendências virais encontradas!', 'success');
    } catch {
      addToast('Erro ao buscar tendências.', 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleCreateFromTrend = (trend: ViralProductTrend) => {
    addToast(`Importando produto viral "${trend.productName}"...`, 'info');

    const newProd = addProduct({
      name: trend.productName,
      photoUrl: trend.sampleImageUrl,
      description: trend.viralReason,
      category: trend.category,
      price: 69.90,
      originalPrice: 129.90,
      affiliateLink: 'https://shope.ee/produto-viral-afiliado',
      marketplace: 'Shopee',
      commissionPercentage: 15,
      brand: 'AchadinhosVirais',
      features: ['Tendência TikTok / Reels', 'Alto Engajamento'],
      benefits: ['Gera salvamentos e compartilhamentos'],
      viralScore: 9.9,
    });

    generateAutoCampaignForProduct(newProd.id);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-orange-950 via-slate-900 to-red-950 border border-orange-500/30 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span>MODO ENCONTRE PRODUTOS VIRAIS</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Tendências & Produtos em Alta no Reels
          </h2>
          <p className="text-xs text-slate-300">
            A IA monitora o mercado de afiliados e detecta itens com maior probabilidade de gerar engajamento, retenção e salvamentos.
          </p>

          {/* Search Input */}
          <form onSubmit={handleSearchTrends} className="flex gap-2 pt-3 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={nicheQuery}
                onChange={(e) => setNicheQuery(e.target.value)}
                placeholder="Pesquisar nicho (ex: Cozinha, Beleza, Tech)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              <span>Buscar</span>
            </button>
          </form>
        </div>
      </div>

      {/* Grid de Tendências */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayTrends.map((trend) => (
          <div
            key={trend.id}
            className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-orange-500/50 backdrop-blur-sm space-y-4 flex flex-col justify-between transition-all group"
          >
            <div className="space-y-4">
              <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800">
                <img src={trend.sampleImageUrl} alt={trend.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-2 right-2 px-3 py-1 rounded-full bg-slate-950/90 text-orange-400 border border-orange-500/40 text-[10px] font-bold">
                  {trend.potentialEngagement}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{trend.category}</span>
                <h3 className="text-base font-black text-white mt-0.5">{trend.productName}</h3>
                <p className="text-xs text-orange-300 font-medium mt-1 leading-relaxed">
                  💡 <strong>Motivo do Potencial:</strong> {trend.viralReason}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-indigo-400 block mb-0.5">🎬 Ideia de Reel:</strong>
                  <span className="text-slate-300">{trend.reelIdea}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-purple-400 block mb-0.5">📚 Ideia de Carrossel:</strong>
                  <span className="text-slate-300">{trend.carouselIdea}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCreateFromTrend(trend)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all mt-4"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Criar Campanha Viral 1-Click</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
