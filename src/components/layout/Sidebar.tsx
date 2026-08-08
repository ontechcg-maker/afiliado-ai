import React from 'react';
import { useApp } from '../../context/AppContext';
import type { ActiveTab } from '../../types';
import { InstagramIcon } from '../ui/Icons';
import {
  LayoutDashboard,
  Sparkles,
  Video,
  Image,
  Layers,
  Smartphone,
  Package,
  Calendar,
  Flame,
  BarChart3,
  Bot,
  Palette,
  FolderKanban,
  Settings,
  Zap,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, instagramAccount, autopilot, toggleAutopilot, userProfile } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'studio', label: 'Criar com IA', icon: <Sparkles className="w-4 h-4 text-amber-400" />, badge: 'IA' },
    { id: 'reels', label: 'Reels AI Studio', icon: <Video className="w-4 h-4 text-indigo-400" />, badge: 'HOT' },
    { id: 'carousels', label: 'Carrosséis', icon: <Layers className="w-4 h-4" /> },
    { id: 'posts', label: 'Posts Estáticos', icon: <Image className="w-4 h-4" /> },
    { id: 'stories', label: 'Stories Interativos', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'products', label: 'Meus Produtos', icon: <Package className="w-4 h-4 text-emerald-400" /> },
    { id: 'calendar', label: 'Calendário Editorial', icon: <Calendar className="w-4 h-4" /> },
    { id: 'trends', label: 'Produtos Virais', icon: <Flame className="w-4 h-4 text-orange-400" />, badge: '🔥' },
    { id: 'analytics', label: 'Analytics & IA', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'consultant', label: 'Consultor IA', icon: <Bot className="w-4 h-4 text-purple-400" /> },
    { id: 'brand', label: 'Brand Kit', icon: <Palette className="w-4 h-4" /> },
    { id: 'library', label: 'Biblioteca', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'settings', label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none backdrop-blur-md">
      <div>
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                AFILIADO<span className="text-indigo-400">.AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Social Media com IA</p>
            </div>
          </div>
        </div>

        <div className="p-3 mx-3 my-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {instagramAccount.isConnected ? (
              <div className="relative">
                <img
                  src={instagramAccount.profilePictureUrl}
                  alt={instagramAccount.username}
                  className="w-8 h-8 rounded-full border border-emerald-500/50 object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <InstagramIcon className="w-4 h-4" />
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {instagramAccount.isConnected ? `@${instagramAccount.username}` : 'Instagram Off'}
              </p>
              <p className="text-[10px] text-slate-400">
                {instagramAccount.isConnected ? `${instagramAccount.followersCount.toLocaleString('pt-BR')} seg.` : 'Conectar conta'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            title="Gerenciar Conexão"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="px-3 mb-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${autopilot.enabled ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
              <div>
                <span className="text-xs font-medium text-slate-200 block">Piloto Automático</span>
                <span className="text-[10px] text-slate-400">{autopilot.enabled ? 'Ativo (2x/dia)' : 'Pausado'}</span>
              </div>
            </div>
            <button
              onClick={() => toggleAutopilot(!autopilot.enabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autopilot.enabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  autopilot.enabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <nav className="px-2 space-y-0.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={userProfile.avatarUrl} alt={userProfile.fullName} className="w-8 h-8 rounded-full object-cover border border-indigo-500/40" />
            <div className="truncate">
              <p className="text-xs font-medium text-slate-200 truncate">{userProfile.fullName}</p>
              <span className="inline-block px-1.5 py-0.5 text-[9px] font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded">
                PLANO {userProfile.planTier.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
