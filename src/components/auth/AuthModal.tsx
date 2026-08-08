import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, User as UserIcon, Sparkles, X, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithEmail, signUpWithEmail, addToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Preencha o e-mail e a senha.', 'warning');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        addToast('Informe seu nome completo para o cadastro.', 'warning');
        return;
      }
      if (password !== confirmPassword) {
        addToast('⚠️ As senhas não coincidem. Digite a confirmação de senha idêntica.', 'warning');
        return;
      }
      if (password.length < 6) {
        addToast('⚠️ A senha precisa ter pelo menos 6 caracteres.', 'warning');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const success = await loginWithEmail(email, password);
        if (success) {
          onClose();
        }
      } else {
        const success = await signUpWithEmail(email, password, fullName);
        if (success) {
          onClose();
        }
      }
    } catch (err: any) {
      addToast(err.message || 'Erro na autenticação.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Glow de Fundo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AFILIADO.AI AUTH</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            {mode === 'login' ? 'Acesse sua Conta' : 'Crie sua Conta Grátis'}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Entre com suas credenciais para acessar seus produtos e postagens'
              : 'Comece a automatizar suas vendas de afiliados com Inteligência Artificial'}
          </p>
        </div>

        {/* Alternador Login / Signup */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800/80 mb-6">
          <button
            type="button"
            onClick={() => handleSwitchMode('login')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('signup')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'signup' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-0.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-rose-500 focus:border-rose-400'
                      : confirmPassword && confirmPassword === password
                      ? 'border-emerald-500 focus:border-emerald-400'
                      : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 p-0.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-[10px] text-rose-400 mt-1 font-medium">As senhas não coincidem</p>
              )}
              {confirmPassword && confirmPassword === password && (
                <p className="text-[10px] text-emerald-400 mt-1 font-medium">✓ Senhas coincidem</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:opacity-95 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Entrar no AFILIADO.AI' : 'Criar minha Conta'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

