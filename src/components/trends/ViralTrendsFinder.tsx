import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Sparkles } from 'lucide-react';

export const ViralTrendsFinder: React.FC = () => {
  const { viralTrends, addProduct, generateAutoCampaignForProduct, addToast } = useApp();

  const handleCreateFromTrend = (trend: typeof viralTrends[0]) => {
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {viralTrends.map((trend) => (
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
