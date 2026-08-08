import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { StrategyObjective, VisualStyle } from '../../types';
import { InstagramIcon } from '../ui/Icons';
import { Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { userStrategy, updateStrategy, setIsOnboardingCompleted, connectInstagram, instagramAccount } = useApp();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    profileName: userStrategy.profileName,
    username: userStrategy.username,
    niche: userStrategy.niche,
    subniche: userStrategy.subniche,
    targetAudience: userStrategy.targetAudience,
    ageRange: userStrategy.ageRange,
    genderPredominant: userStrategy.genderPredominant,
    region: userStrategy.region,
    primaryObjectives: userStrategy.primaryObjectives as StrategyObjective[],
    visualStyle: userStrategy.visualStyle as VisualStyle,
    communicationTone: userStrategy.communicationTone,
    postingFrequency: userStrategy.postingFrequency,
  });

  const objectivesList: { id: StrategyObjective; label: string; desc: string }[] = [
    { id: 'gain_followers', label: 'Ganhar Seguidores', desc: 'Prioriza Reels virais e carrosséis topo de funil (40% atração)' },
    { id: 'increase_engagement', label: 'Aumentar Engajamento', desc: 'Conteúdo provocativo, perguntas e enquetes diárias' },
    { id: 'generate_sales', label: 'Gerar Vendas', desc: 'Vídeos de demonstração e ofertas de alta conversão' },
    { id: 'generate_clicks', label: 'Gerar Cliques no Link', desc: 'CTAs fortes direcionando para a bio ou direct' },
    { id: 'build_authority', label: 'Construir Autoridade', desc: 'Postagens de valor, comparativos e utilidade doméstica' },
  ];

  const stylesList: VisualStyle[] = [
    'Profissional',
    'Minimalista',
    'Luxuoso',
    'Moderno',
    'Viral',
    'Jovem',
    'Popular',
    'Elegante',
    'Tecnológico',
    'Promocional',
  ];

  const toggleObjective = (obj: StrategyObjective) => {
    setFormData((prev) => {
      const exists = prev.primaryObjectives.includes(obj);
      if (exists) {
        return { ...prev, primaryObjectives: prev.primaryObjectives.filter((o) => o !== obj) };
      } else {
        return { ...prev, primaryObjectives: [...prev.primaryObjectives, obj] };
      }
    });
  };

  const handleFinish = () => {
    updateStrategy(formData);
    setIsOnboardingCompleted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Assistente de Configuração</h2>
              <p className="text-xs text-slate-400">Passo {step} de 4 — Personalize seu Social Media com IA</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-6 h-2 rounded-full transition-all ${
                  step >= i ? 'bg-gradient-to-r from-indigo-500 to-pink-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-semibold text-white">1. Informações do Perfil de Afiliado</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome do Perfil</label>
                <input
                  type="text"
                  value={formData.profileName}
                  onChange={(e) => setFormData({ ...formData, profileName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="Ex: Achadinhos Incríveis"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">@username do Instagram</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="Ex: achadinhos.top.afiliado"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nicho Principal</label>
                <input
                  type="text"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="Ex: Cozinha, Tecnologia, Moda"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subnicho</label>
                <input
                  type="text"
                  value={formData.subniche}
                  onChange={(e) => setFormData({ ...formData, subniche: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="Ex: Utensílios de Cozinha Virais"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Público-Alvo</label>
              <textarea
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none h-20"
                placeholder="Descreva quem costuma comprar seus produtos de afiliado..."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-base font-semibold text-white mb-1">2. Qual é o seu principal objetivo?</h3>
              <p className="text-xs text-slate-400">Você pode selecionar mais de um objetivo estratégico.</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {objectivesList.map((obj) => {
                const selected = formData.primaryObjectives.includes(obj.id);
                return (
                  <div
                    key={obj.id}
                    onClick={() => toggleObjective(obj.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-semibold">{obj.label}</h4>
                      <p className="text-xs text-slate-400">{obj.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        selected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-base font-semibold text-white mb-1">3. Estilo Visual & Tom de Comunicação</h3>
              <p className="text-xs text-slate-400">A IA irá adaptar os layouts, cores e legendas com base no tom escolhido.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Estilo Visual da Marca</label>
              <div className="flex flex-wrap gap-2">
                {stylesList.map((style) => (
                  <button
                    key={style}
                    onClick={() => setFormData({ ...formData, visualStyle: style })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      formData.visualStyle === style
                        ? 'bg-indigo-600 text-white border border-indigo-500 shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Frequência de Publicação Diária</label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFormData({ ...formData, postingFrequency: freq })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      formData.postingFrequency === freq
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-sm font-bold block">{freq}x por dia</span>
                    <span className="text-[10px] text-slate-400">Recomendado</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center animate-fadeIn py-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-pink-500/20">
              <InstagramIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Conecte sua conta do Instagram</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Conecte via API Oficial da Meta / Instagram Graph API para permitir que a IA analise métricas, agende e publique de forma 100% segura.
              </p>
            </div>

            {instagramAccount.isConnected ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 max-w-sm mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={instagramAccount.profilePictureUrl} alt="" className="w-10 h-10 rounded-full border border-emerald-400 object-cover" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">@{instagramAccount.username}</p>
                    <p className="text-xs text-emerald-400 font-medium">🟢 Instagram Conectado</p>
                  </div>
                </div>
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
            ) : (
              <button
                onClick={() => connectInstagram()}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-xl hover:opacity-90 transition-all inline-flex items-center gap-2"
              >
                <InstagramIcon className="w-5 h-5" />
                <span>Conectar Instagram com a Meta</span>
              </button>
            )}
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition-all"
            >
              <span>Próximo Passo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-xl shadow-emerald-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Concluir e Ir para o Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
