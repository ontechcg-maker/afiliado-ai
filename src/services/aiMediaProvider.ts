// Abstração de Provedores de Mídia por IA (OpenAI, Veo, Kling, Runway, Mock)

export type ProviderType = 'mock' | 'openai' | 'kling' | 'runway' | 'veo';

export interface GenerationParams {
  prompt: string;
  mediaType: 'image' | 'video';
  aspectRatio?: '9:16' | '1:1' | '16:9';
  durationSeconds?: number;
  style?: string;
  productImageUrl?: string;
}

export interface GenerationResult {
  url: string;
  provider: ProviderType;
  renderTimeMs: number;
}

class AIMediaProviderService {
  private activeProvider: ProviderType = 'mock';

  setProvider(provider: ProviderType) {
    this.activeProvider = provider;
  }

  getProvider(): ProviderType {
    return this.activeProvider;
  }

  async generateMedia(params: GenerationParams): Promise<GenerationResult> {
    const startTime = Date.now();

    // Mock Provider (Simulação de Renderização Instantânea/Alta Fidelidade)
    if (this.activeProvider === 'mock') {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let url = 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80';
      if (params.productImageUrl) {
        url = params.productImageUrl;
      } else if (params.mediaType === 'video') {
        url = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80';
      }

      return {
        url,
        provider: 'mock',
        renderTimeMs: Date.now() - startTime,
      };
    }

    // Estrutura extensível para conectores reais de APIs externas
    throw new Error(`Provedor '${this.activeProvider}' requer configuração de API Key no painel.`);
  }
}

export const aiMediaProvider = new AIMediaProviderService();
