export interface EvolutionConfig {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
  targetPhone?: string;
  useSimulation?: boolean;
}

export interface ConnectionStatus {
  connected: boolean;
  number?: string;
  errorDetail?: string;
  isSimulated?: boolean;
}

const defaultConfig: EvolutionConfig = {
  baseUrl: import.meta.env.VITE_EVOLUTION_API_URL || 'https://evo.ontechcg.cloud',
  apiKey: import.meta.env.VITE_EVOLUTION_API_KEY || '',
  instanceName: import.meta.env.VITE_EVOLUTION_INSTANCE || 'afiliado-ai',
  targetPhone: '',
  useSimulation: false,
};

export class EvolutionService {
  private config: EvolutionConfig;

  constructor() {
    this.config = this.loadStoredConfig();
  }

  private loadStoredConfig(): EvolutionConfig {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('afiliado_ai_whatsapp_config');
        if (stored) {
          return { ...defaultConfig, ...JSON.parse(stored) };
        }
      }
    } catch {}
    return defaultConfig;
  }

  public getConfig(): EvolutionConfig {
    return this.config;
  }

  public saveConfig(newConfig: Partial<EvolutionConfig>) {
    this.config = { ...this.config, ...newConfig };
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('afiliado_ai_whatsapp_config', JSON.stringify(this.config));
      }
    } catch {}
  }

  private cleanConfig() {
    let url = (this.config.baseUrl || '').trim().replace(/\/$/, '');
    url = url.replace(/\/manager\/?$/i, '');
    return {
      baseUrl: url,
      apiKey: (this.config.apiKey || '').trim(),
      instanceName: (this.config.instanceName || '').trim() || 'afiliado-ai',
      targetPhone: (this.config.targetPhone || '').trim(),
      useSimulation: Boolean(this.config.useSimulation),
    };
  }

  private formatQrCode(raw: string): string {
    if (!raw) return '';
    if (raw.startsWith('data:image')) return raw;
    if (raw.startsWith('iVBORw0')) return `data:image/png;base64,${raw}`;
    return raw;
  }

  public isConfigured(): boolean {
    const { baseUrl, apiKey, useSimulation } = this.cleanConfig();
    return useSimulation || Boolean(baseUrl && apiKey);
  }

  /**
   * Gerador de QR Code de Demonstração / Simulação
   */
  private getMockQRCode(): string {
    // QR code de demonstração em SVG/Data URI
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="white"/><g fill="black"><rect x="20" y="20" width="50" height="50"/><rect x="30" y="30" width="30" height="30" fill="white"/><rect x="40" y="40" width="10" height="10"/><rect x="130" y="20" width="50" height="50"/><rect x="140" y="30" width="30" height="30" fill="white"/><rect x="150" y="40" width="10" height="10"/><rect x="20" y="130" width="50" height="50"/><rect x="30" y="140" width="30" height="30" fill="white"/><rect x="40" y="150" width="10" height="10"/><rect x="80" y="20" width="20" height="20"/><rect x="100" y="50" width="10" height="40"/><rect x="80" y="100" width="40" height="20"/><rect x="140" y="100" width="40" height="30"/><rect x="90" y="140" width="30" height="40"/><rect x="130" y="150" width="40" height="30"/></g></svg>';
  }

  /**
   * Cria a instância na Evolution API caso não exista
   */
  async createInstance(): Promise<string> {
    const { baseUrl, apiKey, instanceName, useSimulation } = this.cleanConfig();
    if (useSimulation) return this.getMockQRCode();
    if (!baseUrl || !apiKey) return '';

    try {
      const res = await fetch(`${baseUrl}/instance/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: apiKey,
        },
        body: JSON.stringify({
          instanceName: instanceName,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS',
        }),
      });

      const data = await res.json();
      const raw =
        data?.qrcode?.base64 ||
        data?.base64 ||
        data?.code ||
        data?.instance?.qrcode?.base64 ||
        '';
      return this.formatQrCode(raw);
    } catch (e) {
      console.warn('Erro ao criar instância na Evolution API:', e);
      return '';
    }
  }

  /**
   * Verifica o status de conexão da instância com o WhatsApp
   */
  async getConnectionStatus(): Promise<ConnectionStatus> {
    const { baseUrl, apiKey, instanceName, useSimulation } = this.cleanConfig();

    if (useSimulation) {
      return {
        connected: true,
        number: '+55 (83) 98206-3080 [Simulado]',
        isSimulated: true,
      };
    }

    if (!baseUrl || !apiKey) {
      return {
        connected: false,
        errorDetail: 'Preencha a URL da Evolution API e a API Key Global.',
      };
    }

    try {
      const res = await fetch(`${baseUrl}/instance/connectionState/${instanceName}`, {
        headers: { apikey: apiKey },
      });

      if (!res.ok) {
        if (res.status === 502 || res.status === 503) {
          return {
            connected: false,
            errorDetail: `O servidor da Evolution API (${baseUrl}) retornou erro ${res.status} Bad Gateway. O serviço na VPS está fora do ar ou com a porta incorreta.`,
          };
        }
        if (res.status === 401 || res.status === 403) {
          return {
            connected: false,
            errorDetail: 'API Key incorreta. Verifique sua chave nas configurações da Evolution API.',
          };
        }
        if (res.status === 404) {
          await this.createInstance();
          return {
            connected: false,
            errorDetail: 'Instância não encontrada. Tentando criar automaticamente...',
          };
        }
        return { connected: false, errorDetail: `Erro HTTP ${res.status} ao conectar.` };
      }

      const data = await res.json();
      const state = data?.instance?.state || data?.state;
      const isOpen = state === 'open' || state === 'CONNECTED';
      return {
        connected: isOpen,
        number: data?.instance?.profileName || data?.profileName,
      };
    } catch {
      return {
        connected: false,
        errorDetail: `Não foi possível conectar ao servidor (${baseUrl}). Verifique se o endereço da API está acessível.`,
      };
    }
  }

  /**
   * Obtém o QR Code para pareamento
   */
  async getQRCode(): Promise<string> {
    const { baseUrl, apiKey, instanceName, useSimulation } = this.cleanConfig();

    if (useSimulation) {
      return this.getMockQRCode();
    }

    if (!baseUrl || !apiKey) return '';

    try {
      const res = await fetch(`${baseUrl}/instance/connect/${instanceName}`, {
        headers: { apikey: apiKey },
      });

      if (res.ok) {
        const data = await res.json();
        const raw =
          data?.base64 ||
          data?.qrcode?.base64 ||
          data?.code ||
          data?.count?.base64 ||
          data?.instance?.qrcode?.base64 ||
          '';

        if (raw) return this.formatQrCode(raw);
      }

      return await this.createInstance();
    } catch {
      return await this.createInstance();
    }
  }

  /**
   * Envia uma mensagem de texto simples para um número
   */
  async sendTextMessage(text: string, phone?: string): Promise<boolean> {
    const { baseUrl, apiKey, instanceName, targetPhone, useSimulation } = this.cleanConfig();
    const recipient = phone || targetPhone;

    if (useSimulation) {
      console.log('📱 [Modo Simulado] Mensagem enviada para WhatsApp:', recipient, text);
      return true;
    }

    if (!baseUrl || !apiKey || !recipient) return false;
    const cleanNumber = recipient.replace(/\D/g, '');

    try {
      const res = await fetch(`${baseUrl}/message/sendText/${instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: apiKey,
        },
        body: JSON.stringify({
          number: cleanNumber,
          text,
          options: { delay: 1200, presence: 'composing' },
        }),
      });

      return res.ok;
    } catch (e) {
      console.warn('Erro ao enviar mensagem no WhatsApp via Evolution API:', e);
      return false;
    }
  }

  /**
   * Envia uma mensagem de mídia (Imagem / Vídeo) com legenda
   */
  async sendMediaMessage(
    mediaUrl: string,
    caption: string,
    mediaType: 'image' | 'video' = 'image',
    phone?: string
  ): Promise<boolean> {
    const { baseUrl, apiKey, instanceName, targetPhone, useSimulation } = this.cleanConfig();
    const recipient = phone || targetPhone;

    if (useSimulation) {
      console.log('📱 [Modo Simulado] Mídia enviada para WhatsApp:', recipient, mediaUrl, caption);
      return true;
    }

    if (!baseUrl || !apiKey || !recipient) return false;
    const cleanNumber = recipient.replace(/\D/g, '');

    try {
      const res = await fetch(`${baseUrl}/message/sendMedia/${instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: apiKey,
        },
        body: JSON.stringify({
          number: cleanNumber,
          mediatype: mediaType,
          mediaUrl: mediaUrl.startsWith('http') ? mediaUrl : undefined,
          media: !mediaUrl.startsWith('http') ? mediaUrl : undefined,
          caption,
          fileName: mediaType === 'video' ? 'video.mp4' : 'imagem.jpg',
        }),
      });

      return res.ok;
    } catch (e) {
      console.warn('Erro ao enviar mídia no WhatsApp:', e);
      return false;
    }
  }
}

export const evolutionService = new EvolutionService();
