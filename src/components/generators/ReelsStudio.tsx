import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIContentEngine } from '../../services/aiContentEngine';
import type { Product, ReelScript } from '../../types';
import { Video, Sparkles, VolumeX, Volume2, Play, Music, Camera, Layers, Wand2 } from 'lucide-react';

const sampleProduct: Product = {
  id: 'sample-prod-1',
  name: 'Mini Processador de Alimentos Elétrico sem Fio',
  description: 'Processa alho, pimenta, legumes e temperos em 10 segundos com lâmina tripla de aço inox e carregamento USB-C.',
  category: 'Cozinha & Praticidade',
  price: 39.90,
  originalPrice: 79.90,
  affiliateLink: 'https://shopee.com.br/sample',
  marketplace: 'Shopee',
  commissionPercentage: 20.0,
  photoUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
  brand: 'Achadinhos Tech',
  features: ['Carregamento USB-C', 'Lâmina Inox Tripla', 'Resistente à água'],
  benefits: ['Tritura em 10 segundos', 'Sem sujeira na cozinha', 'Bateria dura 30 dias'],
  viralScore: 9.8,
  createdAt: new Date().toISOString(),
};

export const ReelsStudio: React.FC = () => {
  const { products, createPost, setActiveTab, addToast } = useApp();

  const displayProducts = products.length > 0 ? products : [sampleProduct];
  const [selectedProductId, setSelectedProductId] = useState<string>(displayProducts[0]?.id || sampleProduct.id);
  const [durationSeconds, setDurationSeconds] = useState<number>(15);
  const [structureModel, setStructureModel] = useState<string>('Modelo 1 — Gancho + produto + CTA');
  const [narratorMode, setNarratorMode] = useState<'no_voice' | 'voiceover'>('no_voice');
  const [generatedScript, setGeneratedScript] = useState<ReelScript | null>(null);

  const selectedProduct = displayProducts.find((p) => p.id === selectedProductId) || displayProducts[0] || sampleProduct;

  const modelsList = [
    { name: 'Modelo 1 — Gancho + produto + CTA', desc: '0–2s Gancho visual forte, 2–7s Apresentação, 7–10s Benefício, Final CTA' },
    { name: 'Modelo 2 — Problema/Solução', desc: 'Mostra dor do usuário primeiro, apresentando o produto como alívio instantâneo' },
    { name: 'Modelo 3 — Curiosidade', desc: '"Você provavelmente não sabia que isso existia..."' },
    { name: 'Modelo 4 — Produto viral', desc: 'Edição estética no ritmo de áudios em alta no Reels' },
    { name: 'Modelo 5 — Antes e depois', desc: 'Transformação impactante provocada pelo uso do produto' },
    { name: 'Modelo 6 — Lista', desc: '"3 produtos de menos de R$100 que você precisa conhecer"' },
  ];

  const durations = [6, 8, 10, 15, 30, 60];

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerateScript = async () => {
    if (!selectedProduct) {
      addToast('Cadastre ao menos 1 produto primeiro!', 'warning');
      return;
    }

    setIsGenerating(true);
    addToast('🤖 IA gerando roteiro de Reel em tempo real...', 'info');

    const script = await AIContentEngine.generateReelScriptAsync(
      selectedProduct,
      structureModel,
      durationSeconds,
      narratorMode
    );
    setGeneratedScript(script);
    setIsGenerating(false);
    addToast('🎬 Roteiro de Reel com alta retenção gerado com sucesso!', 'success');
  };

  const handleScheduleReel = async () => {
    if (!generatedScript || !selectedProduct) return;

    const { caption, hashtags, cta } = await AIContentEngine.generateCaptionAndHashtagsAsync(selectedProduct, 'Viral');

    createPost({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      title: `[Reel AI] ${selectedProduct.name}`,
      type: 'reel',
      strategyCategory: 'viral',
      status: 'scheduled',
      scheduledFor: new Date(Date.now() + 3600000 * 3).toISOString(),
      mediaUrls: [selectedProduct.photoUrl],
      coverUrl: selectedProduct.photoUrl,
      caption: `🔥 ${generatedScript.hook}\n\n${caption}`,
      hashtags,
      cta,
      reelScript: generatedScript,
    });

    setActiveTab('calendar');
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto animate-fadeIn">
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Video className="w-4 h-4 text-indigo-400" />
            <span>REELS AI STUDIO</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Criador de Reels de Alta Retenção
          </h2>
          <p className="text-xs text-slate-300">
            Gere Reels completos com ganchos virais, roteiros por cenas, textos na tela e modo sem narração.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <h3 className="text-base font-bold text-white mb-2">Configurar Reel</h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Produto Alvo</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              {displayProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (R${p.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Duração do Reel</label>
            <div className="grid grid-cols-3 gap-2">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDurationSeconds(d)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    durationSeconds === d
                      ? 'bg-indigo-600 text-white border border-indigo-500 shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d} Segundos
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Modo de Áudio & Narração</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setNarratorMode('no_voice')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  narratorMode === 'no_voice'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <VolumeX className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">Modo Sem Narração</span>
                  <span className="text-[10px] text-slate-400">Texto na tela + Música</span>
                </div>
              </button>

              <button
                onClick={() => setNarratorMode('voiceover')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  narratorMode === 'voiceover'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Volume2 className="w-5 h-5 text-pink-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">Com Locução</span>
                  <span className="text-[10px] text-slate-400">Roteiro de Voz</span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Estrutura de Alta Retenção</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {modelsList.map((m) => (
                <div
                  key={m.name}
                  onClick={() => setStructureModel(m.name)}
                  className={`p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                    structureModel === m.name
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="font-bold text-slate-200">{m.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateScript}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:opacity-95 disabled:opacity-50"
          >
            <Wand2 className={`w-4 h-4 text-amber-300 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Gerando com IA em Tempo Real...' : 'Gerar Roteiro de Reel com IA'}</span>
          </button>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {generatedScript ? (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    {generatedScript.structureModel} • {generatedScript.durationSeconds}s
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">"{generatedScript.hook}"</h3>
                </div>
                <button
                  onClick={handleScheduleReel}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Agendar no Calendário</span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-3">
                <Music className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Música Sugerida no Reels</span>
                  <span className="text-xs font-bold text-indigo-200">{generatedScript.suggestedMusic}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sequência de Cenas (Storyboard)</h4>

                {generatedScript.scenes.map((scene) => (
                  <div key={scene.sceneNumber} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 fill-indigo-400" /> Cena #{scene.sceneNumber} ({scene.durationSeconds}s)
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Camera className="w-3 h-3" /> {scene.cameraMovement}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      <strong>Visual:</strong> {scene.visual}
                    </p>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-300 font-medium flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Texto na Tela: "{scene.onScreenText}"</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800/60 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Video className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Nenhum Roteiro Gerado Ainda</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Selecione um produto ao lado e clique em "Gerar Roteiro de Reel" para ver a magia da IA em ação!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
