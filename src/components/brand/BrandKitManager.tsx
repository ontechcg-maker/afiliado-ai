import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Palette } from 'lucide-react';

export const BrandKitManager: React.FC = () => {
  const { brandKit, updateBrandKit, addToast } = useApp();

  const [kit, setKit] = useState(brandKit);

  const handleSave = () => {
    updateBrandKit(kit);
    addToast('🎨 Brand Kit salvo! A IA usará essas cores e marca dágua automaticamente.', 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-3">
          <Palette className="w-6 h-6 text-purple-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Brand Kit & Identidade Visual</h2>
            <p className="text-xs text-slate-400">Cadastre suas cores, fontes e logo para que a IA padronize todas as artes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Paleta de Cores</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Cor Primária</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={kit.primaryColor}
                    onChange={(e) => setKit({ ...kit, primaryColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={kit.primaryColor}
                    onChange={(e) => setKit({ ...kit, primaryColor: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Cor Secundária</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={kit.secondaryColor}
                    onChange={(e) => setKit({ ...kit, secondaryColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={kit.secondaryColor}
                    onChange={(e) => setKit({ ...kit, secondaryColor: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Marca d'Água & Tipografia</h3>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Fonte Principal</label>
              <select
                value={kit.fontHeading}
                onChange={(e) => setKit({ ...kit, fontHeading: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="Inter">Inter (Moderna)</option>
                <option value="Montserrat">Montserrat (Impacto)</option>
                <option value="Poppins">Poppins (Descontraída)</option>
                <option value="Roboto">Roboto (Clean)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-200 font-semibold">Inserir Marca d'Água nos Carrosséis</span>
              <button
                onClick={() => setKit({ ...kit, watermarkEnabled: !kit.watermarkEnabled })}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                  kit.watermarkEnabled ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {kit.watermarkEnabled ? 'Ativada' : 'Desativada'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-all"
        >
          Salvar Configurações do Brand Kit
        </button>
      </div>
    </div>
  );
};
