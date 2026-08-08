import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIContentEngine } from '../../services/aiContentEngine';
import type { AIConsultantMessage } from '../../types';
import { Bot, Send, User } from 'lucide-react';

export const AIConsultantDrawer: React.FC = () => {
  const { userStrategy, products } = useApp();

  const [messages, setMessages] = useState<AIConsultantMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Olá! Sou seu Consultor de Social Media com IA. Analisei seu perfil no nicho **${userStrategy.niche}** e estou pronto para te orientar a multiplicar seus seguidores e vendas de afiliados!\n\nComo posso te ajudar hoje?`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'Que conteúdo devo publicar hoje?', actionKey: 'hoje' },
        { label: 'Como ganhar 1.000 seguidores rápido?', actionKey: 'seguidores' },
        { label: 'Por que Reels têm mais alcance?', actionKey: 'reels' },
      ],
    },
  ]);

  const [inputText, setInputText] = useState<string>('');

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: AIConsultantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    const responseText = await AIContentEngine.generateConsultantResponseAsync(text, userStrategy, products.length);

    const assistantMsg: AIConsultantMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: responseText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, assistantMsg]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col justify-between animate-fadeIn">
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Consultor IA de Social Media</h2>
            <p className="text-xs text-slate-400">Análise estratégica baseada nos dados reais do seu perfil</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
          🟢 Ativo
        </span>
      </div>

      <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-xl p-4 rounded-3xl space-y-2 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>
              <span className="text-[9px] text-slate-400 block text-right">{msg.timestamp}</span>

              {msg.suggestedActions && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {msg.suggestedActions.map((act) => (
                    <button
                      key={act.actionKey}
                      onClick={() => handleSendMessage(act.label)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-purple-300 transition-colors"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Pergunte qualquer coisa sobre estratégia, conteúdos ou produtos..."
          className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
        />
        <button
          onClick={() => handleSendMessage()}
          className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
