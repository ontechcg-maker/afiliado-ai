import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InstagramIcon } from '../ui/Icons';
import { Lock, Mail, User as UserIcon, Sparkles, Loader2, ArrowRight, Eye, EyeOff, ShieldCheck, Zap, ShoppingBag } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { loginWithEmail, signUpWithEmail, addToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
        await loginWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, fullName);
      }
    } catch (err: any) {
      addToast(err.message || 'Erro na autenticação.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 md:p-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Brand Highlights */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-400 text-xs font-bold border border-pink-500/30 shadow-lg">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>AFILIADO.AI • SOCIAL MEDIA COM IA</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Crie e Automatize <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
              Vendas no Instagram
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            A plataforma completa com Inteligência Artificial para afiliados transformarem links de produtos em Reels virais, Carrosséis profissionais e vendas no piloto automático.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Reels & Carrosséis IA</h4>
                <p className="text-[11px] text-slate-400">Geração dinâmica em segundos</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Extrator de Produtos</h4>
                <p className="text-[11px] text-slate-400">Shopee, Mercado Livre, Amazon</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                <InstagramIcon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Instagram Integration</h4>
                <p className="text-[11px] text-slate-400">Automação de postagens</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Piloto Automático</h4>
                <p className="text-[11px] text-slate-400">Agendamento & Alertas WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Mandatory Auth Form */}
        <div className="lg:col-span-6">
          <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Form Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {mode === 'login' ? 'Acesse a sua Conta' : 'Criar Conta de Afiliado'}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'login'
                  ? 'Informe seu e-mail e senha para entrar na plataforma'
                  : 'Preencha seus dados para criar sua conta imediatamente'}
              </p>
            </div>

            {/* Alternador Login / Signup */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'login' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'signup' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cadastrar
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo <span className="text-pink-400">*</span></label>
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
                <label className="block text-xs font-medium text-slate-300 mb-1">E-mail de Acesso <span className="text-pink-400">*</span></label>
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
                <label className="block text-xs font-medium text-slate-300 mb-1">Senha <span className="text-pink-400">*</span></label>
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">Confirmar Senha <span className="text-pink-400">*</span></label>
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
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Entrar na Plataforma' : 'Criar minha Conta'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
