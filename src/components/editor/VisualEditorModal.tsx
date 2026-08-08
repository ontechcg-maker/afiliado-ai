import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { ContentPost } from '../../types';
import { Palette, Type, X, Save, Layers } from 'lucide-react';

interface VisualEditorModalProps {
  post: ContentPost;
  onClose: () => void;
}

export const VisualEditorModal: React.FC<VisualEditorModalProps> = ({ post, onClose }) => {
  const { brandKit, updatePost, addToast } = useApp();

  const [overlayText, setOverlayText] = useState<string>(post.title);
  const [bgColor, setBgColor] = useState<string>(brandKit.primaryColor);
  const [showWatermark, setShowWatermark] = useState<boolean>(brandKit.watermarkEnabled);

  const handleSaveEdit = () => {
    updatePost(post.id, {
      title: overlayText,
    });
    addToast('🎨 Arte personalizada salva no editor!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh]">
        <div className="flex-1 bg-slate-950 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" /> Editor Visual tipo Canva (1080x1080)
          </div>

          <div
            className="w-72 h-72 sm:w-80 sm:h-80 rounded-2xl relative shadow-2xl overflow-hidden flex flex-col justify-between p-6 transition-all"
            style={{ backgroundColor: bgColor }}
          >
            {post.coverUrl && (
              <img src={post.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

            <div className="relative z-10 text-left">
              <span className="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-[10px] font-black uppercase">
                {post.type}
              </span>
            </div>

            <div className="relative z-10 text-center space-y-2">
              <h3 className="text-base font-black leading-tight drop-shadow-md text-white">
                {overlayText}
              </h3>
              <p className="text-[10px] text-amber-300 font-bold bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-full inline-block border border-amber-500/30">
                {post.cta || 'Comente EU QUERO para receber o link!'}
              </p>
            </div>

            {showWatermark && (
              <div className="relative z-10 text-right">
                <span className="text-[9px] font-bold text-white/80 bg-slate-950/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  @{brandKit.brandName}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-80 bg-slate-900 p-6 border-l border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white">Controles de Design</h4>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-indigo-400" /> Texto de Destaque
              </label>
              <textarea
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none h-20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-purple-400" /> Cor de Fundo / Overlay
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs text-slate-400">{bgColor}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-200">Marca d'Água do Brand Kit</span>
              <button
                onClick={() => setShowWatermark(!showWatermark)}
                className={`px-3 py-1 rounded-xl text-[10px] font-bold ${
                  showWatermark ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {showWatermark ? 'Visível' : 'Oculta'}
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={handleSaveEdit}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Edição</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
