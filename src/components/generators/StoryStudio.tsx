import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Sparkles, Vote, HelpCircle, ShoppingBag, Flame } from 'lucide-react';

export const StoryStudio: React.FC = () => {
  const { products, createPost, setActiveTab, addToast } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [storyType, setStoryType] = useState<string>('Enquete');

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const storyTypes = [
    { id: 'Enquete', label: 'Story Enquete', desc: 'Aumenta engajamento com sticker de enquete (ex: Você compraria isso? [SIM] [COM CERTEZA])', icon: <Vote className="w-4 h-4 text-purple-400" /> },
    { id: 'Pergunta', label: 'Caixinha de Pergunta', desc: '"Qual seu maior problema na cozinha?"', icon: <HelpCircle className="w-4 h-4 text-amber-400" /> },
    { id: 'Produto', label: 'Showcase de Produto', desc: 'Demonstração rápida com foco no benefício', icon: <ShoppingBag className="w-4 h-4 text-emerald-400" /> },
    { id: 'Oferta', label: 'Urgência & Desconto', desc: 'Cupom exclusivo ou relógio de contagem regressiva', icon: <Flame className="w-4 h-4 text-orange-400" /> },
  ];

  const handleScheduleStory = () => {
    if (!selectedProduct) {
      addToast('Selecione um produto!', 'warning');
      return;
    }

    createPost({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      title: `[Story ${storyType}] ${selectedProduct.name}`,
      type: 'story',
      strategyCategory: 'viral',
      status: 'scheduled',
      scheduledFor: new Date(Date.now() + 3600000 * 2).toISOString(),
      mediaUrls: [selectedProduct.photoUrl],
      coverUrl: selectedProduct.photoUrl,
      caption: `Story Interativo de ${storyType}: ${selectedProduct.name}`,
      hashtags: [],
      cta: 'Toque no adesivo de Link para ver na loja!',
    });

    addToast(`📱 Story de ${storyType} agendado no calendário!`, 'success');
    setActiveTab('calendar');
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto animate-fadeIn">
      <div className="p-8 rounded-3xl bg-gradient-to-r from-pink-950 via-slate-900 to-indigo-950 border border-pink-500/30 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">
            <Smartphone className="w-4 h-4 text-pink-400" />
            <span>GERADOR DE STORIES INTERATIVOS</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Stories de Alta Retenção & Enquetes
          </h2>
          <p className="text-xs text-slate-300">
            Crie sequências de Stories preparadas para gerar respostas em caixinhas, enquetes virais e cliques diretos de afiliados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-5 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <h3 className="text-base font-bold text-white mb-2">Configurar Story</h3>

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
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Tipo de Sticker Interativo</label>
            <div className="space-y-2">
              {storyTypes.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setStoryType(st.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    storyType === st.id
                      ? 'bg-pink-950/40 border-pink-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-900 shrink-0">{st.icon}</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{st.label}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleScheduleStory}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 transition-all hover:opacity-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Agendar Story Interativo</span>
          </button>
        </div>

        <div className="md:col-span-7 flex justify-center items-center">
          <div className="w-72 h-[480px] rounded-[36px] border-4 border-slate-800 bg-slate-950 relative overflow-hidden shadow-2xl p-4 flex flex-col justify-between text-center select-none">
            {selectedProduct && (
              <img
                src={selectedProduct.photoUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[1px]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/80 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 p-0.5">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" className="w-full h-full rounded-full object-cover" alt="" />
                </div>
                <span className="text-[11px] font-bold text-white">achadinhos.top</span>
              </div>
              <span className="text-[10px] text-slate-300 font-medium">12m</span>
            </div>

            <div className="relative z-10 p-4 rounded-2xl bg-white/95 text-slate-900 shadow-2xl max-w-[220px] mx-auto space-y-2 animate-bounce-short">
              <p className="text-xs font-black">Você compraria esse item por R${selectedProduct?.price.toFixed(2)}?</p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="py-2 px-3 rounded-xl bg-pink-600 text-white font-bold text-xs shadow">
                  SIM! 😍
                </div>
                <div className="py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow">
                  COM CERTEZA
                </div>
              </div>
            </div>

            <div className="relative z-10 pb-2">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/50 animate-pulse">
                <span>🔗 TOQUE PARA COMPRAR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
