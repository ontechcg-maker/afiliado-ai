import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIContentEngine } from '../../services/aiContentEngine';
import { Sparkles, Link as LinkIcon, Package, Wand2, ArrowRight, Loader2, Play, Layers } from 'lucide-react';

export const AIContentStudio: React.FC = () => {
  const { products, generateAutoCampaignForProduct, addProduct, setActiveTab, addToast } = useApp();

  const [productLink, setProductLink] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');

  const handleExtractFromLink = async () => {
    if (!productLink.trim()) {
      addToast('Cole o link do produto de afiliado!', 'warning');
      return;
    }

    setIsExtracting(true);
    addToast('Extraindo informações e foto do produto via IA...', 'info');

    try {
      const extracted = await AIContentEngine.extractProductFromLink(productLink);
      const newProd = addProduct({
        name: extracted.name || 'Produto da Campanha',
        photoUrl: extracted.photoUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
        description: extracted.description || 'Produto de alto engajamento',
        category: extracted.category || 'Geral',
        price: extracted.price || 49.90,
        originalPrice: extracted.originalPrice || 89.90,
        affiliateLink: productLink,
        marketplace: (extracted.marketplace as any) || 'Shopee',
        commissionPercentage: extracted.commissionPercentage || 15,
        features: extracted.features || ['Item Viral', 'Frete Grátis'],
        benefits: extracted.benefits || ['Facilita a rotina'],
        viralScore: 9.5,
      });

      setSelectedProductId(newProd.id);
      generateAutoCampaignForProduct(newProd.id);
      setProductLink('');
    } catch {
      addToast('Erro ao extrair dados do link', 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>IA CONTENT STUDIO</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Seu Estrategista Digital de Conteúdo
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            A inteligência artificial analisa seu nicho, seu público e o desempenho histórico do perfil para criar uma estratégia completa de Reels, Carrosséis e Stories.
          </p>
        </div>
      </div>

      {/* SEÇÃO 25: Criador a partir de um Link de Afiliado */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <LinkIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Criar Conteúdo a partir de um Link de Afiliado</h3>
            <p className="text-xs text-slate-400">Cole a URL da Shopee, Amazon, Hotmart, Kiwify ou Mercado Livre</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              placeholder="Cole o link do produto de afiliado aqui..."
              className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
            />
          </div>
          <button
            onClick={handleExtractFromLink}
            disabled={isExtracting}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Extraindo & Gerando...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>Criar Campanha Completa</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SEÇÃO 26: Campanha Automática por Produto do Banco */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-white mb-1">Selecione um Produto do Banco de Produtos</h3>
          <p className="text-xs text-slate-400">A IA criará instantaneamente: 1 Reel + 1 Carrossel + 1 Post + 3 Stories</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">Nenhum produto cadastrado ainda.</p>
            <button
              onClick={() => setActiveTab('products')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Cadastrar Primeiro Produto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((prod) => {
              const isSelected = selectedProductId === prod.id;
              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <img src={prod.photoUrl} alt={prod.name} className="w-full h-32 object-cover rounded-xl border border-slate-800" />
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {prod.marketplace} • R${prod.price.toFixed(2)}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 mt-1.5">{prod.name}</h4>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generateAutoCampaignForProduct(prod.id);
                    }}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Criar Campanha</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Atalhos Rápidos para Geradores Específicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('reels')}
          className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-indigo-400" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Reels AI Studio</h4>
          <p className="text-xs text-slate-400">Criador de Reels de alta retenção com modo sem narração.</p>
          <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1 mt-3">
            Abrir estúdio <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('carousels')}
          className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-purple-950/60 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Gerador de Carrosséis</h4>
          <p className="text-xs text-slate-400">Postagens em slides com ganchos virais e CTA de seguidores.</p>
          <span className="text-[11px] font-bold text-purple-400 flex items-center gap-1 mt-3">
            Abrir carrossel <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('trends')}
          className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-orange-950/60 border border-slate-800 hover:border-orange-500/50 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Wand2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Produtos Virais 🔥</h4>
          <p className="text-xs text-slate-400">Detector de tendências de mercado e ideias prontas.</p>
          <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1 mt-3">
            Ver tendências <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
