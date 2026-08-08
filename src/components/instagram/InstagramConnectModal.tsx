import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InstagramIcon } from '../ui/Icons';
import { X, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface InstagramConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstagramConnectModal: React.FC<InstagramConnectModalProps> = ({ isOpen, onClose }) => {
  const { connectInstagramCustom, addToast } = useApp();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
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
            <span>META GRAPH API & INSTAGRAM</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Conectar seu Instagram
          </h3>
          <p className="text-xs text-slate-400">
            Informe o seu nome de usuário para vincular sua conta ao AFILIADO.AI
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nome de Usuário do Instagram <span className="text-pink-400">*</span>
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
            <p className="text-[11px] text-slate-500 mt-1">Exemplo: hevertonsalvador ou achadinhos.promo</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nome de Exibição do Perfil <span className="text-slate-500">(opcional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Heverton Salvador | Achadinhos"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none transition-all"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-purple-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>O que esta conexão permite:</span>
            </div>
            <ul className="list-disc list-inside pl-1 space-y-0.5 text-slate-400">
              <li>Agendamento e publicação automática de Reels, Posts e Carrosséis</li>
              <li>Leitura de estatísticas (alcance, curtidas, comentários) com IA</li>
            </ul>
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
                <span>Conectar @{username.replace(/^@/, '').trim() || 'meuperfil'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
