import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIContentEngine } from '../../services/aiContentEngine';
import type { CarouselSlide } from '../../types';
import { Layers, Sparkles, Wand2, UserPlus } from 'lucide-react';

export const CarouselStudio: React.FC = () => {
  const { products, createPost, setActiveTab, addToast } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [topic, setTopic] = useState<string>('');
  const [generatedSlides, setGeneratedSlides] = useState<CarouselSlide[] | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerateCarousel = async () => {
    if (!selectedProduct) {
      addToast('Cadastre ao menos 1 produto no Banco!', 'warning');
      return;
    }

    setIsGenerating(true);
    addToast('🤖 IA gerando slides do Carrossel...', 'info');

    const slides = await AIContentEngine.generateCarouselSlidesAsync(selectedProduct, topic || undefined);
    setGeneratedSlides(slides);
    setIsGenerating(false);
    addToast('📚 Carrossel de alta conversão gerado!', 'success');
  };

  const handleScheduleCarousel = async () => {
    if (!generatedSlides || !selectedProduct) return;

    const { caption, hashtags, cta } = await AIContentEngine.generateCaptionAndHashtagsAsync(selectedProduct, 'Conversão');

    createPost({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      title: `[Carrossel AI] ${slidesHeadlineOrDefault()}`,
      type: 'carousel',
      strategyCategory: 'attraction',
      status: 'scheduled',
      scheduledFor: new Date(Date.now() + 3600000 * 5).toISOString(),
      mediaUrls: [selectedProduct.photoUrl],
      coverUrl: selectedProduct.photoUrl,
      caption,
      hashtags,
      cta,
      carouselSlides: generatedSlides,
    });

    setActiveTab('calendar');
  };

  const slidesHeadlineOrDefault = () => {
    return generatedSlides?.[0]?.headline || selectedProduct?.name || 'Carrossel de Achadinhos';
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto animate-fadeIn">
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>CRIAR CARROSSEL COM IA</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Gerador de Carrosséis de Alta Conversão
          </h2>
          <p className="text-xs text-slate-300">
            Gere slides perfeitos com ganchos iniciais matadores e CTA final estratégico direcionado para seguidores e salvamentos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <h3 className="text-base font-bold text-white mb-2">Configurar Carrossel</h3>

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
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Tema ou Gancho Personalizado (Opcional)</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: 5 produtos que parecem caros mas custam R$50..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerateCarousel}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all hover:opacity-95 disabled:opacity-50"
            >
              <Wand2 className={`w-4 h-4 text-amber-300 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Gerando Carrossel com IA...' : 'Gerar Carrossel Completo'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {generatedSlides ? (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                    Carrossel ({generatedSlides.length} Slides)
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">{slidesHeadlineOrDefault()}</h3>
                </div>
                <button
                  onClick={handleScheduleCarousel}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Agendar Carrossel</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedSlides.map((slide, idx) => (
                  <div
                    key={slide.slideNumber}
                    className={`p-4 rounded-2xl border space-y-2 relative ${
                      idx === 0
                        ? 'bg-gradient-to-br from-purple-950/80 to-slate-950 border-purple-500/50'
                        : idx === generatedSlides.length - 1
                        ? 'bg-gradient-to-br from-indigo-950/80 to-slate-950 border-indigo-500/50'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      Slide #{slide.slideNumber}
                    </span>

                    <h4 className="text-xs font-black text-white pr-12">{slide.headline}</h4>
                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{slide.text}</p>

                    {idx === 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 mt-2">
                        🔥 Gancho de Atração Inicial
                      </span>
                    )}

                    {idx === generatedSlides.length - 1 && (
                      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2 text-[10px] font-bold text-indigo-400">
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>CTA de Seguidores & Salvamento</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800/60 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-3xl bg-purple-600/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Pronto para Gerar seu Carrossel</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Selecione um produto e clique em "Gerar Carrossel Completo" para ver todos os slides estruturados!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
