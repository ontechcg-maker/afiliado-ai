export interface EvolutionConfig {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
  targetPhone?: string;
}

export interface ConnectionStatus {
  connected: boolean;
  qrCode?: string;
  number?: string;
}

const defaultConfig: EvolutionConfig = {
  baseUrl: import.meta.env.VITE_EVOLUTION_API_URL || 'http://76.13.67.241:8080',
  apiKey: import.meta.env.VITE_EVOLUTION_API_KEY || '',
  instanceName: import.meta.env.VITE_EVOLUTION_INSTANCE || 'afiliado-ai',
  targetPhone: '',
};

export class EvolutionService {
  private config: EvolutionConfig;

  constructor() {
    this.config = this.loadStoredConfig();
  }

  private loadStoredConfig(): EvolutionConfig {
    try {
      const stored = localStorage.getItem('afiliado_ai_whatsapp_config');
      if (stored) {
        return { ...defaultConfig, ...JSON.parse(stored) };
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
      localStorage.setItem('afiliado_ai_whatsapp_config', JSON.stringify(this.config));
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
    };
  }

  private formatQrCode(raw: string): string {
    if (!raw) return '';
    if (raw.startsWith('data:image')) return raw;
    if (raw.startsWith('iVBORw0')) return `data:image/png;base64,${raw}`;
    return raw;
  }

  public isConfigured(): boolean {
    const { baseUrl, apiKey } = this.cleanConfig();
    return Boolean(baseUrl && apiKey);
  }

  /**
   * Cria a instância na Evolution API caso não exista
   */
  async createInstance(): Promise<string> {
    const { baseUrl, apiKey, instanceName } = this.cleanConfig();
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
    const { baseUrl, apiKey, instanceName } = this.cleanConfig();
    if (!baseUrl || !apiKey) return { connected: false };

    try {
      const res = await fetch(`${baseUrl}/instance/connectionState/${instanceName}`, {
        headers: { apikey: apiKey },
      });

      if (!res.ok) {
        // Se retornar 404, tenta criar a instância
        if (res.status === 404) {
          await this.createInstance();
        }
        return { connected: false };
      }

      const data = await res.json();
      const state = data?.instance?.state || data?.state;
      const isOpen = state === 'open' || state === 'CONNECTED';
      return {
        connected: isOpen,
        number: data?.instance?.profileName || data?.profileName,
      };
    } catch {
      return { connected: false };
    }
  }

  /**
   * Obtém o QR Code para pareamento
   */
  async getQRCode(): Promise<string> {
    const { baseUrl, apiKey, instanceName } = this.cleanConfig();
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

      // Se a requisição GET falhar ou não retornar QR Code, tenta criar/obter via POST /instance/create
      return await this.createInstance();
    } catch {
      return await this.createInstance();
    }
  }

  /**
   * Envia uma mensagem de texto simples para um número ou para o número configurado
   */
  async sendTextMessage(text: string, phone?: string): Promise<boolean> {
    const { baseUrl, apiKey, instanceName, targetPhone } = this.cleanConfig();
    const recipient = phone || targetPhone;

    if (!baseUrl || !apiKey || !recipient) {
      console.warn('Configuração de WhatsApp incompleta (URL, API Key ou Telefone faltando).');
      return false;
    }

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
          options: {
            delay: 1200,
            presence: 'composing',
          },
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
    const { baseUrl, apiKey, instanceName, targetPhone } = this.cleanConfig();
    const recipient = phone || targetPhone;

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
