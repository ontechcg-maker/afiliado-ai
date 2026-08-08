import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { evolutionService, type EvolutionConfig } from '../../services/evolutionService';
import { X, QrCode, PhoneCall, RefreshCw, Send, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface WhatsAppConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppConfigDrawer: React.FC<WhatsAppConfigDrawerProps> = ({ isOpen, onClose }) => {
  const { addToast } = useApp();

  const [config, setConfig] = useState<EvolutionConfig>(evolutionService.getConfig());
  const [status, setStatus] = useState<{ connected: boolean; number?: string }>({ connected: false });
  const [qrCode, setQrCode] = useState<string>('');
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [testingMsg, setTestingMsg] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  const checkStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await evolutionService.getConnectionStatus();
      setStatus(res);
      if (!res.connected) {
        const qr = await evolutionService.getQRCode();
        setQrCode(qr);
      } else {
        setQrCode('');
      }
    } catch {
      setStatus({ connected: false });
    } finally {
      setLoadingStatus(false);
    }
  };

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    evolutionService.saveConfig(config);
    addToast('Configurações do WhatsApp salvas com sucesso!', 'success');
    checkStatus();
  };

  const handleSendTestMessage = async () => {
    if (!config.targetPhone) {
      addToast('Informe o número de telefone com DDD para teste.', 'warning');
      return;
    }

    setTestingMsg(true);
    const success = await evolutionService.sendTextMessage(
      '🟢 *AFILIADO.AI*: Teste de notificação via WhatsApp realizado com sucesso! Você receberá avisos automáticos de novas postagens e campanhas geradas pela IA neste número.',
      config.targetPhone
    );
    setTestingMsg(false);

    if (success) {
      addToast('Mensagem de teste enviada para seu WhatsApp!', 'success');
    } else {
      addToast('Falha ao enviar mensagem de teste. Verifique a URL, API Key e status da instância.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Notificações no WhatsApp</h3>
                <p className="text-xs text-slate-400">Evolution API Integration</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {status.connected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">Instância Conectada ao WhatsApp</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold text-rose-400">Instância Desconectada</span>
                  </>
                )}
              </div>

              <button
                onClick={checkStatus}
                disabled={loadingStatus}
                className="p-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                title="Atualizar Status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {status.connected && status.number && (
              <p className="text-xs text-slate-400">Número pareado: <span className="text-white font-medium">{status.number}</span></p>
            )}
          </div>

          {/* QR Code & Pareamento (Se desconectado) */}
          {!status.connected && (
            <div className="mb-6 space-y-3">
              {qrCode ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>ESCANEIE COM O WHATSAPP</span>
                  </div>
                  <div className="flex justify-center p-3 bg-white rounded-xl max-w-[200px] mx-auto shadow-md">
                    <img src={qrCode} alt="QR Code WhatsApp" className="w-full h-auto" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Abra o WhatsApp &gt; Aparelhos Conectados &gt; Conectar um Aparelho
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    setLoadingStatus(true);
                    evolutionService.saveConfig(config);
                    const qr = await evolutionService.getQRCode();
                    setQrCode(qr);
                    setLoadingStatus(false);
                    if (!qr) {
                      addToast('Não foi possível conectar com a Evolution API. Verifique se a URL e a API Key estão corretas.', 'error');
                    } else {
                      addToast('QR Code gerado com sucesso! Escaneie com seu WhatsApp.', 'success');
                    }
                  }}
                  disabled={loadingStatus}
                  className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-indigo-400" />
                  <span>Gerar QR Code para Pareamento</span>
                </button>
              )}
            </div>
          )}

          {/* Form Config */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">URL da Evolution API</label>
              <input
                type="text"
                value={config.baseUrl}
                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                placeholder="http://76.13.67.241:8080"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">API Key Global</label>
              <input
                type="password"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="Cole sua API Key da Evolution"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nome da Instância</label>
              <input
                type="text"
                value={config.instanceName}
                onChange={(e) => setConfig({ ...config, instanceName: e.target.value })}
                placeholder="afiliado-ai"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Seu Telefone com DDD (Receber Alertas)</label>
              <input
                type="text"
                value={config.targetPhone || ''}
                onChange={(e) => setConfig({ ...config, targetPhone: e.target.value })}
                placeholder="5511999999999"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700/60 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Salvar Configurações</span>
            </button>
          </form>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800 mt-6">
          <button
            type="button"
            onClick={handleSendTestMessage}
            disabled={testingMsg}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{testingMsg ? 'Enviando Teste...' : 'Enviar Mensagem de Teste no WhatsApp'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
