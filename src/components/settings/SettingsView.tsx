import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { metaApiService } from '../../services/metaApiService';
import { evolutionService } from '../../services/evolutionService';
import { InstagramIcon } from '../ui/Icons';
import { Zap, CreditCard, Check, ShieldCheck, MessageCircle, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    instagramAccount,
    connectInstagram,
    disconnectInstagram,
    autopilot,
    toggleAutopilot,
    updateAutopilotSettings,
    userProfile,
    addToast,
  } = useApp();

  const currentMeta = metaApiService.getMetaConfig();
  const [metaAppId, setMetaAppId] = useState(currentMeta.appId);
  const [metaAppSecret, setMetaAppSecret] = useState(currentMeta.appSecret);

  const currentEvo = evolutionService.getConfig();
  const [evoUrl, setEvoUrl] = useState(currentEvo.baseUrl);
  const [evoKey, setEvoKey] = useState(currentEvo.apiKey);
  const [evoInstance, setEvoInstance] = useState(currentEvo.instanceName);

  const handleSaveMeta = (e: React.FormEvent) => {
    e.preventDefault();
    metaApiService.saveMetaConfig({ appId: metaAppId.trim(), appSecret: metaAppSecret.trim() });
    addToast('✅ Configurações da Meta API salvas com sucesso!', 'success');
  };

  const handleSaveEvo = (e: React.FormEvent) => {
    e.preventDefault();
    evolutionService.saveConfig({ baseUrl: evoUrl.trim(), apiKey: evoKey.trim(), instanceName: evoInstance.trim() });
    addToast('✅ Configurações da Evolution API (WhatsApp) salvas!', 'success');
  };

  const plans = [
    { name: 'GRATUITO', price: 'R$0', desc: 'Ideal para testes iniciais', features: ['5 artes geradas/mês', 'Instagram Conectado', 'Gerador de Legendas'] },
    { name: 'PRO', price: 'R$97/mês', desc: 'Para afiliados profissionais', features: ['Conteúdos ilimitados', 'Piloto Automático 2x/dia', 'Reels AI Studio', 'Brand Kit Custom'] },
    { name: 'PREMIUM', price: 'R$197/mês', desc: 'Automação avançada', features: ['Renderização 4K de vídeo', 'IA Media Provider Privado', 'Suporte Prioritário'] },
    { name: 'EMPRESARIAL', price: 'R$397/mês', desc: 'Agências e múltiplas contas', features: ['Até 10 contas Instagram', 'Equipe multiusuário', 'API REST liberada'] },
  ];

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* Bloco 1: Conexão Instagram */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-500 text-white">
              <InstagramIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Conexão com Instagram (Meta API Oficial)</h3>
              <p className="text-xs text-slate-400">Respeitando todas as políticas, limites e OAuth 2.0 oficiais da Meta</p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${instagramAccount.isConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'}`}>
            {instagramAccount.isConnected ? '🟢 Instagram Conectado' : '🔴 Desconectado'}
          </span>
        </div>

        {instagramAccount.isConnected ? (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={instagramAccount.profilePictureUrl} alt="" className="w-10 h-10 rounded-full border border-emerald-500 object-cover" />
              <div>
                <p className="text-sm font-bold text-white">@{instagramAccount.username}</p>
                <p className="text-xs text-slate-400">{instagramAccount.followersCount.toLocaleString('pt-BR')} seguidores • {instagramAccount.mediaCount} posts</p>
              </div>
            </div>
            <button
              onClick={() => disconnectInstagram()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Desconectar
            </button>
          </div>
        ) : (
          <button
            onClick={() => connectInstagram()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 text-white text-xs font-bold shadow hover:opacity-95 transition-opacity"
          >
            Conectar Instagram / Meta OAuth
          </button>
        )}
      </div>

      {/* Bloco 2: Configuração Direta das APIs (Meta App ID & WhatsApp) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meta API Config */}
        <form onSubmit={handleSaveMeta} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">Credenciais da Meta Graph API</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Insira o Meta App ID e Secret criados no portal Meta for Developers para habilitar a verificação oficial com Facebook Login.
          </p>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Meta App ID</label>
              <input
                type="text"
                value={metaAppId}
                onChange={(e) => setMetaAppId(e.target.value)}
                placeholder="Ex: 123456789012345"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Meta App Secret (Chave Secreta)</label>
              <input
                type="password"
                value={metaAppSecret}
                onChange={(e) => setMetaAppSecret(e.target.value)}
                placeholder="Ex: a1b2c3d4e5f67890..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Meta App Credentials</span>
            </button>
          </div>
        </form>

        {/* WhatsApp / Evolution API Config */}
        <form onSubmit={handleSaveEvo} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <MessageCircle className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">Configuração do WhatsApp (Evolution API)</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Configure a URL e chave da sua instância da Evolution API para enviar notificações automáticas de relatórios no WhatsApp.
          </p>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">URL da Evolution API</label>
              <input
                type="text"
                value={evoUrl}
                onChange={(e) => setEvoUrl(e.target.value)}
                placeholder="http://76.13.67.241:8080"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition-all font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Instância</label>
                <input
                  type="text"
                  value={evoInstance}
                  onChange={(e) => setEvoInstance(e.target.value)}
                  placeholder="afiliado-ai"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">API Key</label>
                <input
                  type="password"
                  value={evoKey}
                  onChange={(e) => setEvoKey(e.target.value)}
                  placeholder="Sua API Key"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar WhatsApp Credentials</span>
            </button>
          </div>
        </form>
      </div>

      {/* Bloco 3: Piloto Automático */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className={`w-5 h-5 ${autopilot.enabled ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
            <div>
              <h3 className="text-base font-bold text-white">Automação em Piloto Automático</h3>
              <p className="text-xs text-slate-400">A IA planeja, cria e agenda conteúdos nos horários de maior engajamento</p>
            </div>
          </div>

          <button
            onClick={() => toggleAutopilot(!autopilot.enabled)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              autopilot.enabled ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {autopilot.enabled ? 'Piloto Automático ATIVO' : 'Piloto Automático PAUSADO'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {[1, 2, 3].map((f) => (
            <button
              key={f}
              onClick={() => updateAutopilotSettings({ postsPerDay: f })}
              className={`p-3 rounded-2xl border text-center transition-all ${
                autopilot.postsPerDay === f ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span className="text-sm font-bold block">{f} Publicação{f > 1 ? 'ões' : ''}/dia</span>
              <span className="text-[10px] text-slate-400">Frequência da IA</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bloco 4: Planos SaaS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Planos & Assinaturas SaaS</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`p-5 rounded-3xl border flex flex-col justify-between space-y-4 ${
                userProfile.planTier.toUpperCase() === p.name
                  ? 'bg-gradient-to-b from-indigo-950/80 to-slate-950 border-indigo-500 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {p.name}
                </span>
                <h4 className="text-xl font-black text-white">{p.price}</h4>
                <p className="text-[11px] text-slate-400">{p.desc}</p>
                <div className="space-y-1.5 pt-2">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                disabled={userProfile.planTier.toUpperCase() === p.name}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white text-xs font-bold disabled:bg-emerald-600/30 disabled:text-emerald-400 transition-colors"
              >
                {userProfile.planTier.toUpperCase() === p.name ? 'Seu Plano Atual' : 'Fazer Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
