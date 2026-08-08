import type { Product, ContentPost, ReelScript, CarouselSlide, UserStrategy } from '../types';

export class AIContentEngine {
  // 1. GERADOR DE REELS AUTOMÁTICO
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

  // 2. GERADOR DE CARROSSÉIS
  static generateCarouselSlides(product: Product, topic?: string): CarouselSlide[] {
    const slides: CarouselSlide[] = [
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
    return slides;
  }

  // 3. GERADOR DE LEGENDAS & HASHTAGS INTELIGENTES
  static generateCaptionAndHashtags(product: Product, style: 'Viral' | 'Conversão' | 'Engajamento' = 'Conversão'): { caption: string; hashtags: string[]; cta: string } {
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
  static generateCompleteCampaign(product: Product, scheduledBaseDate: Date): ContentPost[] {
    const { caption, hashtags, cta } = this.generateCaptionAndHashtags(product, 'Conversão');
    const reelScript = this.generateReelScript(product, 'Gancho + produto + CTA', 15, 'no_voice');
    const carouselSlides = this.generateCarouselSlides(product);

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

  // 5. EXTRATOR DE LINK
  static async extractProductFromLink(link: string): Promise<Partial<Product>> {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    let marketplace: 'Shopee' | 'Amazon' | 'Hotmart' | 'Mercado Livre' = 'Shopee';
    if (link.includes('amazon') || link.includes('amzn')) marketplace = 'Amazon';
    else if (link.includes('hotmart')) marketplace = 'Hotmart';
    else if (link.includes('mercadolivre')) marketplace = 'Mercado Livre';

    return {
      name: `Produto Extraído do Link (${marketplace})`,
      photoUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
      description: 'Item de alto engajamento extraído automaticamente via IA do link informado.',
      category: 'Achadinhos Virais',
      price: 59.90,
      originalPrice: 109.90,
      affiliateLink: link,
      marketplace,
      commissionPercentage: 15.0,
      features: ['Extração Automática de Preço', 'Foto HD'],
      benefits: ['Economia de tempo no cadastro'],
      viralScore: 9.1,
    };
  }

  // 6. MOTOR CONSULTOR IA
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
