import { GoogleGenAI } from '@google/genai';
import type { Product, ContentPost, ReelScript, CarouselSlide, UserStrategy } from '../types';
import { scrapeProduct } from './scraperService';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
const aiClient = apiKey && apiKey !== 'sua-chave-gemini-aqui' ? new GoogleGenAI({ apiKey }) : null;

export class AIContentEngine {
  public static isGeminiConfigured(): boolean {
    return Boolean(aiClient);
  }

  private static async generateJSONWithGemini<T>(prompt: string, systemInstruction?: string): Promise<T | null> {
    if (!aiClient) return null;
    try {
      const response = await aiClient.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: systemInstruction || 'Você é um assistente de IA especialista em marketing de afiliados, Instagram Reels e estratégias de conversão de alto impacto.',
        },
      });

      if (response.text) {
        return JSON.parse(response.text) as T;
      }
    } catch (error) {
      console.warn('Erro na geração com Gemini (JSON), utilizando fallback estruturado:', error);
    }
    return null;
  }

  // 1. GERADOR DE REELS AUTOMÁTICO (COM SUPORTE A GEMINI REAL)
  static async generateReelScriptAsync(
    product: Product,
    structureModel: string = 'Gancho + produto + CTA',
    durationSeconds: number = 15,
    mode: 'no_voice' | 'voiceover' = 'no_voice'
  ): Promise<ReelScript> {
    const prompt = `Crie um roteiro de Reel viral para o produto de afiliado:
Nome: "${product.name}"
Categoria: "${product.category}"
Preço: R$${product.price} (Original: R$${product.originalPrice || product.price * 1.5})
Plataforma: ${product.marketplace}
Benefícios: ${product.benefits.join(', ')}
Características: ${product.features.join(', ')}

Duração: ${durationSeconds} segundos
Modo de áudio: ${mode === 'no_voice' ? 'Sem narração (somente texto chamativo e áudio em alta)' : 'Narração por voz (Voiceover)'}
Modelo de estrutura: ${structureModel}

Retorne estritamente um objeto JSON com a seguinte estrutura:
{
  "hook": "frase de gancho super chamativa para os primeiros 2 segundos com emojis",
  "durationSeconds": ${durationSeconds},
  "structureModel": "${structureModel}",
  "mode": "${mode}",
  "suggestedMusic": "estilo ou nome de áudio viral recomendado",
  "scenes": [
    {
      "sceneNumber": 1,
      "visual": "descrição visual detalhada da cena 1",
      "audioText": "texto falado (ou vazio se no_voice)",
      "onScreenText": "texto chamativo na tela",
      "cameraMovement": "movimento de câmera",
      "transition": "tipo de transição",
      "durationSeconds": 3
    }
  ]
}`;

    const geminiResult = await this.generateJSONWithGemini<ReelScript>(prompt);
    if (geminiResult && geminiResult.scenes && geminiResult.scenes.length > 0) {
      return geminiResult;
    }

    return this.generateReelScript(product, structureModel, durationSeconds, mode);
  }

  static generateReelScript(
    product: Product,
    structureModel: string = 'Gancho + produto + CTA',
    durationSeconds: number = 15,
    mode: 'no_voice' | 'voiceover' = 'no_voice'
  ): ReelScript {
    const hooks = [
      `Esse item da ${product.marketplace} está viralizando por um motivo chocante... 😱`,
      `Pare de gastar dinheiro à toa antes de ver isso! 🔥`,
      `5 pessoas me perguntaram onde comprei isso hoje... ✨`,
      `Se você tem problemas com ${product.category.toLowerCase()}, você PRECISA ver isso! 💡`,
      `POV: Você encontrou o achadinho perfeito de R$${product.price.toFixed(2)} 🛍️`
    ];

    const randomHook = hooks[Math.floor(Math.random() * hooks.length)];

    return {
      hook: randomHook,
      durationSeconds,
      structureModel,
      mode,
      suggestedMusic: mode === 'no_voice' ? 'Phonk Instrumental / Upbeat Trending Audio' : 'Aesthetic Chill House',
      scenes: [
        {
          sceneNumber: 1,
          visual: `Close-up cinematográfico de alta definição do produto ${product.name}`,
          onScreenText: randomHook,
          cameraMovement: 'Zoom in suave nos primeiros 2 segundos',
          transition: 'Corte rápido ritmado',
          durationSeconds: 3,
        },
        {
          sceneNumber: 2,
          visual: `Demonstração realista do produto sendo utilizado em ação: ${product.description}`,
          onScreenText: `Benefício: ${product.benefits[0] || 'Praticidade total no seu dia a dia'}`,
          cameraMovement: 'Panorâmica horizontal com foco na textura',
          transition: 'Flash suave',
          durationSeconds: Math.max(3, durationSeconds - 7),
        },
        {
          sceneNumber: 3,
          visual: `Recorte chamativo do preço promocional de R$${product.price.toFixed(2)}`,
          onScreenText: `De R$${(product.originalPrice || product.price * 1.8).toFixed(2)} por APENAS R$${product.price.toFixed(2)}! 🤑`,
          cameraMovement: 'Fixo com brilho em destaque',
          transition: 'Slide para esquerda',
          durationSeconds: 2,
        },
        {
          sceneNumber: 4,
          visual: `Tela final com CTA animada e direcionamento para a Bio`,
          onScreenText: `💬 Comente "${product.category.slice(0, 4).toUpperCase()}" ou toque no link da Bio!`,
          cameraMovement: 'Fixo com pulso no botão',
          transition: 'Fade out',
          durationSeconds: 2,
        }
      ]
    };
  }

  // 2. GERADOR DE CARROSSÉIS (COM SUPORTE A GEMINI REAL)
  static async generateCarouselSlidesAsync(product: Product, topic?: string): Promise<CarouselSlide[]> {
    const prompt = `Crie 5 slides para um carrossel do Instagram focado no produto de afiliado:
Nome: "${product.name}"
Categoria: "${product.category}"
Preço: R$${product.price}
Marketplace: ${product.marketplace}
Tópico opcional: "${topic || ''}"

Retorne estritamente um objeto JSON no seguinte formato:
{
  "slides": [
    {
      "slideNumber": 1,
      "headline": "título chamativo da capa",
      "text": "texto descritivo do slide",
      "visualDescription": "orientação visual para a imagem de fundo",
      "ctaText": "CTA ou frase final"
    }
  ]
}`;

    const geminiResult = await this.generateJSONWithGemini<{ slides: CarouselSlide[] }>(prompt);
    if (geminiResult && geminiResult.slides && geminiResult.slides.length >= 3) {
      return geminiResult.slides;
    }

    return this.generateCarouselSlides(product, topic);
  }

  static generateCarouselSlides(product: Product, topic?: string): CarouselSlide[] {
    return [
      {
        slideNumber: 1,
        headline: topic || `5 Motivos para ter o ${product.name} na sua casa`,
        text: 'Arraste para o lado e veja o motivo #3! ➡️',
        visualDescription: 'Capa chamativa com tipografia em contraste alto e foto de fundo desfocada',
      },
      {
        slideNumber: 2,
        headline: '1. ' + (product.benefits[0] || 'Economia de Tempo'),
        text: product.description,
        visualDescription: 'Foto em zoom do produto em ação com marca dágua discreta',
      },
      {
        slideNumber: 3,
        headline: '2. ' + (product.features[0] || 'Alta Durabilidade & Qualidade'),
        text: `Desenvolvido pela ${product.brand || 'marca líder'}, garante eficiência máxima sem ocupar espaço.`,
        visualDescription: 'Layout split com foto e lista de especificações',
      },
      {
        slideNumber: 4,
        headline: '3. Preço imbatível na ' + product.marketplace,
        text: `Enquanto no mercado custa R$${(product.originalPrice || product.price * 1.7).toFixed(2)}, você paga apenas R$${product.price.toFixed(2)}!`,
        visualDescription: 'Badge com oferta e porcentagem de desconto destacada em verde neon',
      },
      {
        slideNumber: 5,
        headline: 'Gostou deste achadinho? 📌',
        text: '1. Siga o perfil para não perder as ofertas diárias.\n2. Salve para ver depois.\n3. Link disponível no perfil!',
        visualDescription: 'Slide final de CTA direcionando o público para seguir e salvar o post',
        ctaText: 'Siga o perfil e receba o link exclusivo!',
      }
    ];
  }

  // 3. GERADOR DE LEGENDAS & HASHTAGS (COM SUPORTE A GEMINI REAL)
  static async generateCaptionAndHashtagsAsync(
    product: Product,
    style: 'Viral' | 'Conversão' | 'Engajamento' = 'Conversão'
  ): Promise<{ caption: string; hashtags: string[]; cta: string }> {
    const prompt = `Escreva uma legenda altamente persuasiva para Instagram para o produto:
Produto: "${product.name}"
Categoria: "${product.category}"
Preço: R$${product.price} (Original: R$${product.originalPrice || product.price * 1.5})
Marketplace: ${product.marketplace}
Estilo desejado: ${style}

Retorne estritamente um objeto JSON com:
{
  "caption": "texto da legenda completo com quebras de linha \\n e emojis",
  "hashtags": ["#achadinhos", "#ofertas", "#hashtag3", "#hashtag4"],
  "cta": "chamada para ação final"
}`;

    const geminiResult = await this.generateJSONWithGemini<{ caption: string; hashtags: string[]; cta: string }>(prompt);
    if (geminiResult && geminiResult.caption && geminiResult.hashtags) {
      return geminiResult;
    }

    return this.generateCaptionAndHashtags(product, style);
  }

  static generateCaptionAndHashtags(
    product: Product,
    style: 'Viral' | 'Conversão' | 'Engajamento' = 'Conversão'
  ): { caption: string; hashtags: string[]; cta: string } {
    const ctas = [
      `🔥 Quer o link com desconto? Comente "${product.name.split(' ')[0].toUpperCase()}" que te mando no direct!`,
      `📌 Salve esta dica para não esquecer quando for comprar na ${product.marketplace}!`,
      `👉 Siga @achadinhos.top.afiliado para descobrir produtos que facilitam sua vida todo dia!`,
      `📲 Compartilhe com quem precisa ver isso urgente!`
    ];
    const chosenCta = ctas[Math.floor(Math.random() * ctas.length)];

    let captionText = '';

    if (style === 'Viral') {
      captionText = `Eu tô em CHOQUE com essa descoberta na ${product.marketplace}! 😱\n\n${product.description}\n\nE o melhor: custa menos de R$${(product.price + 10).toFixed(0)}!\n\n${chosenCta}`;
    } else if (style === 'Conversão') {
      captionText = `🚨 ALERTA DE OFERTA NA ${product.marketplace.toUpperCase()}!\n\n${product.name}\n\n✅ ${product.benefits[0] || 'Super prático'}\n✅ ${product.features[0] || 'Alta qualidade'}\n\n💰 De R$${(product.originalPrice || product.price * 1.6).toFixed(2)} por APENAS R$${product.price.toFixed(2)}\n\n${chosenCta}`;
    } else {
      captionText = `Você compraria isso para sua casa? Sim ou Com certeza? 👇\n\n${product.description}\n\n${chosenCta}`;
    }

    const broadHashtags = ['#achadinhos', '#ofertas', '#afiliados', '#promoção'];
    const nicheHashtags = [`#${product.category.toLowerCase().replace(/[^a-z0-9]/g, '')}`, '#dicasdecasa', '#utilidades'];
    const marketplaceHashtags = [`#${product.marketplace.toLowerCase()}br`, `#achadinhos${product.marketplace.toLowerCase()}`];
    const intentHashtags = ['#cupomdedesconto', '#comprasonline'];

    const hashtags = Array.from(new Set([...broadHashtags, ...nicheHashtags, ...marketplaceHashtags, ...intentHashtags]));

    return {
      caption: captionText,
      hashtags,
      cta: chosenCta,
    };
  }

  // 4. CRIADOR DE CAMPANHA COMPLETA 360°
  static async generateCompleteCampaignAsync(product: Product, scheduledBaseDate: Date): Promise<ContentPost[]> {
    const { caption, hashtags, cta } = await this.generateCaptionAndHashtagsAsync(product, 'Conversão');
    const reelScript = await this.generateReelScriptAsync(product, 'Gancho + produto + CTA', 15, 'no_voice');
    const carouselSlides = await this.generateCarouselSlidesAsync(product);

    const posts: ContentPost[] = [];

    // Reel
    posts.push({
      id: `campaign-reel-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      title: `[Reel Viral] ${product.name}`,
      type: 'reel',
      strategyCategory: 'attraction',
      status: 'scheduled',
      scheduledFor: new Date(scheduledBaseDate.getTime() + 3600000 * 2).toISOString(),
      mediaUrls: [product.photoUrl],
      coverUrl: product.photoUrl,
      caption: `🔥 ${reelScript.hook}\n\n${caption}`,
      hashtags,
      cta,
      reelScript,
      analytics: { reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, followersGained: 0 },
      createdAt: new Date().toISOString(),
    });

    // Carrossel
    posts.push({
      id: `campaign-carousel-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      title: `[Carrossel Guia] 5 Motivos para comprar o ${product.name}`,
      type: 'carousel',
      strategyCategory: 'authority',
      status: 'scheduled',
      scheduledFor: new Date(scheduledBaseDate.getTime() + 86400000).toISOString(),
      mediaUrls: [product.photoUrl],
      coverUrl: product.photoUrl,
      caption,
      hashtags,
      cta,
      carouselSlides,
      analytics: { reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, followersGained: 0 },
      createdAt: new Date().toISOString(),
    });

    // Post Estático / Oferta
    posts.push({
      id: `campaign-post-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      title: `[Oferta Direta] ${product.name} em Promoção`,
      type: 'post',
      strategyCategory: 'commercial',
      status: 'scheduled',
      scheduledFor: new Date(scheduledBaseDate.getTime() + 86400000 * 2).toISOString(),
      mediaUrls: [product.photoUrl],
      coverUrl: product.photoUrl,
      caption: `💥 DESCONTO EXCLUSIVO NA ${product.marketplace.toUpperCase()}!\n\n${product.name} por R$${product.price.toFixed(2)}\n\n${cta}`,
      hashtags,
      cta,
      analytics: { reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, followersGained: 0 },
      createdAt: new Date().toISOString(),
    });

    // Story 1
    posts.push({
      id: `campaign-story1-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      title: `[Story Enquete] Você tem esse problema?`,
      type: 'story',
      strategyCategory: 'viral',
      status: 'scheduled',
      scheduledFor: new Date(scheduledBaseDate.getTime() + 3600000 * 1).toISOString(),
      mediaUrls: [product.photoUrl],
      caption: `Você usaria isso na sua casa? 🤔\n[SIM, COM CERTEZA] [QUERO TESTAR]`,
      hashtags: [],
      cta: 'VOTE NA ENQUETE ACIMA!',
      analytics: { reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, followersGained: 0 },
      createdAt: new Date().toISOString(),
    });

    return posts;
  }

  static generateCompleteCampaign(product: Product, scheduledBaseDate: Date): ContentPost[] {
    const { caption, hashtags, cta } = this.generateCaptionAndHashtags(product, 'Conversão');
    const reelScript = this.generateReelScript(product, 'Gancho + produto + CTA', 15, 'no_voice');
    const carouselSlides = this.generateCarouselSlides(product);

    const posts: ContentPost[] = [];

    posts.push({
      id: `campaign-reel-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      title: `[Reel Viral] ${product.name}`,
      type: 'reel',
      strategyCategory: 'attraction',
      status: 'scheduled',
      scheduledFor: new Date(scheduledBaseDate.getTime() + 3600000 * 2).toISOString(),
      mediaUrls: [product.photoUrl],
      coverUrl: product.photoUrl,
      caption: `🔥 ${reelScript.hook}\n\n${caption}`,
      hashtags,
      cta,
      reelScript,
      analytics: { reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, followersGained: 0 },
      createdAt: new Date().toISOString(),
    });

    posts.push({
      id: `campaign-carousel-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      title: `[Carrossel Guia] 5 Motivos para comprar o ${product.name}`,
      type: 'carousel',
      strategyCategory: 'authority',
      status: 'scheduled',
      scheduledFor: new Date(scheduledBaseDate.getTime() + 86400000).toISOString(),
      mediaUrls: [product.photoUrl],
      coverUrl: product.photoUrl,
      caption,
      hashtags,
      cta,
      carouselSlides,
      analytics: { reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, followersGained: 0 },
      createdAt: new Date().toISOString(),
    });

    posts.push({
      id: `campaign-post-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      title: `[Oferta Direta] ${product.name} em Promoção`,
      type: 'post',
      strategyCategory: 'commercial',
      status: 'scheduled',
      scheduledFor: new Date(scheduledBaseDate.getTime() + 86400000 * 2).toISOString(),
      mediaUrls: [product.photoUrl],
      coverUrl: product.photoUrl,
      caption: `💥 DESCONTO EXCLUSIVO NA ${product.marketplace.toUpperCase()}!\n\n${product.name} por R$${product.price.toFixed(2)}\n\n${cta}`,
      hashtags,
      cta,
      analytics: { reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, followersGained: 0 },
      createdAt: new Date().toISOString(),
    });

    posts.push({
      id: `campaign-story1-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      title: `[Story Enquete] Você tem esse problema?`,
      type: 'story',
      strategyCategory: 'viral',
      status: 'scheduled',
      scheduledFor: new Date(scheduledBaseDate.getTime() + 3600000 * 1).toISOString(),
      mediaUrls: [product.photoUrl],
      caption: `Você usaria isso na sua casa? 🤔\n[SIM, COM CERTEZA] [QUERO TESTAR]`,
      hashtags: [],
      cta: 'VOTE NA ENQUETE ACIMA!',
      analytics: { reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, followersGained: 0 },
      createdAt: new Date().toISOString(),
    });

    return posts;
  }

  // 5. EXTRATOR DE LINK REAL (COM SCRAPER + GEMINI 2.5 PRO)
  static async extractProductFromLink(link: string): Promise<Partial<Product>> {
    // 1. Scraping de dados reais (Mercado Livre API, Microlink, OpenGraph)
    const scraped = await scrapeProduct(link);

    const price = scraped.priceTo || 49.90;
    const originalPrice = scraped.priceFrom || price * 1.5;

    interface AIEnrichedProduct {
      description?: string;
      category?: string;
      brand?: string;
      features?: string[];
      benefits?: string[];
      viralScore?: number;
    }

    let aiEnriched: AIEnrichedProduct | null = null;

    // 2. Enriquecimento via Gemini 2.5 Pro (se ativo)
    if (aiClient && scraped.title) {
      const prompt = `Analise o produto de afiliado extraído de uma loja online:
Título do Produto: "${scraped.title}"
Loja/Marketplace: "${scraped.platform}"
Preço: R$${price}

Retorne um objeto JSON com a enriquecimento do produto:
{
  "description": "uma descrição persuasiva e chamativa do produto em 2 parágrafos curtos",
  "category": "categoria exata do produto (ex: Casa & Cozinha, Tecnologia, Moda, Beleza, Utilitários)",
  "brand": "marca estimada ou provável do produto",
  "features": ["3 características técnicas ou físicas principais"],
  "benefits": ["3 benefícios de uso do produto para o consumidor"],
  "viralScore": 9.2 (um número de 1.0 a 10.0 representando a virabilidade do produto)
}`;

      aiEnriched = await this.generateJSONWithGemini<AIEnrichedProduct>(prompt);
    }

    return {
      name: scraped.title || `Produto Extraído (${scraped.platform})`,
      photoUrl: scraped.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
      description: aiEnriched?.description || 'Item de alto engajamento e alta conversão extraído automaticamente do link.',
      category: aiEnriched?.category || 'Achadinhos Virais',
      price,
      originalPrice,
      affiliateLink: scraped.affiliateLink || link,
      marketplace: scraped.platform,
      commissionPercentage: 15.0,
      brand: aiEnriched?.brand || undefined,
      features: aiEnriched?.features || ['Foto HD Extraída', 'Menor Preço Garantido'],
      benefits: aiEnriched?.benefits || ['Economia de tempo', 'Facilidade de compra'],
      viralScore: aiEnriched?.viralScore || 9.1,
    };
  }

  // 6. MOTOR CONSULTOR IA (COM SUPORTE A GEMINI REAL)
  static async generateConsultantResponseAsync(
    userMessage: string,
    strategy: UserStrategy,
    productsCount: number
  ): Promise<string> {
    if (aiClient) {
      const systemInstruction = `Você é um Consultor Estratégico de Social Media e Marketing de Afiliados de Nível Master.
Seu objetivo é orientar o usuário a maximizar seguidores, engajamento e vendas no Instagram.
Contexto do Usuário:
- Nome do Perfil: "${strategy.profileName}" (@${strategy.username})
- Nicho: "${strategy.niche}" (Subniche: "${strategy.subniche || 'Geral'}")
- Público Alvo: "${strategy.targetAudience}"
- Objetivos Principais: ${strategy.primaryObjectives.join(', ')}
- Tom de Comunicação: ${strategy.communicationTone}
- Estilo Visual: ${strategy.visualStyle}
- Frequência de Postagem: ${strategy.postingFrequency} posts por dia
- Horários Preferidos: ${strategy.preferredPostingHours.join(', ')}
- Produtos Cadastrados: ${productsCount} produtos no banco

Responda em formato markdown direto, amigável, altamente estratégico e prático. Use listas e destaques em negrito.`;

      try {
        const response = await aiClient.models.generateContent({
          model: modelName,
          contents: userMessage,
          config: { systemInstruction },
        });

        if (response.text) {
          return response.text;
        }
      } catch (error) {
        console.warn('Erro ao chamar Gemini no Consultor, usando resposta estruturada:', error);
      }
    }

    return this.generateConsultantResponse(userMessage, strategy, productsCount);
  }

  static generateConsultantResponse(userMessage: string, strategy: UserStrategy, productsCount: number): string {
    const msg = userMessage.toLowerCase();

    if (msg.includes('ganhar seguidores') || msg.includes('crescer')) {
      return `Para aumentar seus seguidores no nicho de **${strategy.niche}**, devemos aplicar a regra de ouro dos **40% de conteúdo de atração**:

1. **Publique Reels de 7 a 15 segundos** usando ganchos visuais e áudios em alta.
2. **Crie Carrosséis de lista** (ex: "5 achadinhos que parecem caros por menos de R$50").
3. **Evite transformar o perfil em um catálogo estático**. Conteúdo de entretenimento e curiosidade atrai pessoas que nem sabiam que queriam o produto!`;
    }

    if (msg.includes('hoje') || msg.includes('publicar') || msg.includes('ideia')) {
      return `Com base na sua estratégia de **${strategy.postingFrequency} postagens por dia**, recomendo para hoje:

• **Horário 1 (11:30):** 1 Reel do produto de maior pontuação viral.
• **Horário 2 (19:30):** 1 Carrossel estilo "Antes e Depois" ou "Problema / Solução".

Você tem **${productsCount} produtos cadastrados**. Deseja que eu gere essa campanha agora?`;
    }

    if (msg.includes('reels') || msg.includes('alcance')) {
      return `Seu alcance em Reels melhora drasticamente quando os **primeiros 2 segundos** têm um gancho visual forte ou texto provocativo na tela (Modo Sem Narração). 

A IA do Instagram mede a **taxa de retenção** e o **número de salvamentos**. Quando o usuário salva o vídeo para olhar o produto depois, o algoritmo distribui para milhares de novos não-seguidores.`;
    }

    return `Entendi sua dúvida! Como seu objetivo principal no perfil **${strategy.profileName}** é **${strategy.primaryObjectives.join(', ')}**, a IA do AFILIADO.AI está constantemente ajustando seu calendário editorial para equilibrar 40% Atração, 25% Viral, 20% Autoridade e 15% Vendas.`;
  }
}
