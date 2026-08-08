import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { metaApiService } from '../../services/metaApiService';
import { InstagramIcon } from '../ui/Icons';
import { X, Loader2, ArrowRight, ShieldCheck, HelpCircle, ExternalLink } from 'lucide-react';

interface InstagramConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstagramConnectModal: React.FC<InstagramConnectModalProps> = ({ isOpen, onClose }) => {
  const { connectInstagramCustom, addToast } = useApp();

  const [tab, setTab] = useState<'oauth' | 'manual'>('oauth');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  if (!isOpen) return null;

  const isMetaConfigured = metaApiService.isMetaConfigured();
  const metaAuthUrl = metaApiService.getMetaAuthUrl();

  const handleStartMetaOAuth = () => {
    if (isMetaConfigured && metaAuthUrl !== '#') {
      addToast('Redirecionando para o login oficial do Facebook/Meta OAuth...', 'info');
      window.location.href = metaAuthUrl;
    } else {
      setShowTutorial(true);
      addToast('Para verificação oficial real, configure o Meta App ID nas variáveis do servidor.', 'warning');
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUsername = username.replace(/^@/, '').trim();
    if (!cleanUsername) {
      addToast('Digite o seu nome de usuário do Instagram (@).', 'warning');
      return;
    }

    setLoading(true);

    try {
      await connectInstagramCustom(cleanUsername, name.trim() || `@${cleanUsername}`);
      onClose();
      setUsername('');
      setName('');
    } catch {
      addToast('Erro ao vincular conta do Instagram.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Glow de Fundo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-400 text-xs font-bold border border-pink-500/30">
            <InstagramIcon className="w-4 h-4 text-pink-400" />
            <span>INSTAGRAM & META GRAPH API</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Conectar Conta do Instagram
          </h3>
          <p className="text-xs text-slate-400">
            Escolha o método de conexão para vincular sua conta ao AFILIADO.AI
          </p>
        </div>

        {/* Abas */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800/80 mb-6">
          <button
            type="button"
            onClick={() => setTab('oauth')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              tab === 'oauth' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verificação Meta (Oficial)</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('manual')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              tab === 'manual' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Vínculo Rápido por @</span>
          </button>
        </div>

        {tab === 'oauth' ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">OAuth 2.0 com Facebook Login</h4>
                  <p className="text-[11px] text-slate-400">
                    Redireciona para o login oficial do Facebook/Meta para autorizar a publicação direta de mídias e leitura de métricas.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-900">
                <span className="text-slate-400 font-medium">Status da Meta API no Servidor:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  isMetaConfigured ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {isMetaConfigured ? '✅ Meta App Configurado' : '⚠️ Requer Meta App ID'}
                </span>
              </div>
            </div>

            <button
              onClick={handleStartMetaOAuth}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Entrar com Facebook (Verificação Real Meta)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {!isMetaConfigured && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowTutorial(!showTutorial)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-medium text-amber-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Como configurar a verificação real da Meta?</span>
                  </span>
                  <span>{showTutorial ? '▲ Ocultar' : '▼ Ver Instruções'}</span>
                </button>

                {showTutorial && (
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-slate-300 space-y-2 animate-fadeIn">
                    <p className="font-bold text-amber-300">📋 Como ativar o login oficial da Meta:</p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400">
                      <li>Acesse <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline">developers.facebook.com</a> e crie um App do tipo <strong>Negócios (Business)</strong>.</li>
                      <li>Adicione os produtos <strong>Instagram Graph API</strong> e <strong>Login do Facebook para Empresas</strong>.</li>
                      <li>No Coolify/Servidor, adicione a variável de ambiente: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">VITE_META_APP_ID</code>.</li>
                      <li>Configure a URL de Redirecionamento no Meta App: <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-300">https://afiliado-ai.ontechcg.cloud</code>.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nome de Usuário do seu Instagram <span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold text-sm">@</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="seuperfil.oficial"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none transition-all font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Digite seu @ real para usar nas estratégias e artes da IA.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nome do Perfil <span className="text-slate-500">(opcional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Heverton Salvador | Achadinhos"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white text-xs font-bold shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 transition-all hover:opacity-95 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Conectando...</span>
                </>
              ) : (
                <>
                  <span>Vincular @{username.replace(/^@/, '').trim() || 'meuperfil'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
