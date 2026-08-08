import type { Product, ContentPost, UserStrategy, BrandKit, InstagramAccount, AutopilotSettings, ViralProductTrend } from '../types';

export const INITIAL_INSTAGRAM_ACCOUNT: InstagramAccount = {
  id: 'ig-101',
  instagramUserId: '1784140123456789',
  username: 'achadinhos.top.afiliado',
  name: 'Achadinhos Incríveis ✨',
  profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  followersCount: 14820,
  mediaCount: 184,
  accountType: 'BUSINESS',
  isConnected: true,
  connectedAt: new Date().toISOString(),
};

export const INITIAL_USER_STRATEGY: UserStrategy = {
  profileName: 'Achadinhos Incríveis ✨',
  username: 'achadinhos.top.afiliado',
  niche: 'Achadinhos & Casa Inteligente',
  subniche: 'Organização, Cozinha & Utensílios Virais',
  targetAudience: 'Homens e Mulheres de 22 a 45 anos interessados em praticidade no lar e ofertas',
  ageRange: '25-44',
  genderPredominant: 'Feminino (68%)',
  region: 'Brasil (São Paulo, Rio de Janeiro, MG)',
  primaryObjectives: ['gain_followers', 'generate_sales', 'increase_engagement'],
  visualStyle: 'Moderno',
  communicationTone: 'Persuasivo',
  postingFrequency: 2,
  preferredPostingHours: ['11:30', '19:30'],
  affiliateLinks: ['https://shopee.com.br/shop/achadinhos', 'https://amzn.to/3xyz'],
  marketplaces: ['Shopee', 'Amazon', 'Hotmart'],
  distribution: {
    attraction: 40,
    viral: 25,
    authority: 20,
    commercial: 15,
  },
};

export const INITIAL_BRAND_KIT: BrandKit = {
  brandName: 'Achadinhos Incríveis',
  primaryColor: '#8B5CF6',
  secondaryColor: '#EC4899',
  accentColor: '#10B981',
  backgroundColor: '#0F172A',
  fontHeading: 'Inter',
  fontBody: 'Inter',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
  watermarkEnabled: true,
  watermarkPosition: 'bottom_right',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Mini Processador Elétrico Portátil Recarregável USB',
    photoUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80',
    description: 'Tritura alho, cebola e temperos em segundos sem sujar as mãos. Bateria recarregável USB com lâmina inox tripla.',
    category: 'Cozinha & Lar',
    price: 39.90,
    originalPrice: 79.90,
    affiliateLink: 'https://shope.ee/mini-processador-afiliado',
    marketplace: 'Shopee',
    commissionPercentage: 14.5,
    brand: 'AchadosHome',
    features: ['300ml de capacidade', 'Carga USB rápida', 'Lâmina tripla inox'],
    benefits: ['Economiza 15 minutos na preparação', 'Sem cheiro nas mãos'],
    viralScore: 9.6,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Fita LED RGB Inteligente Wi-Fi 5M com Sensor Rítmico',
    photoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    description: 'Fita de LED multicolorida controlada por aplicativo e Alexa. Sincroniza com o ritmo da música.',
    category: 'Casa Inteligente & Tech',
    price: 64.90,
    originalPrice: 119.00,
    affiliateLink: 'https://amzn.to/fita-led-rgb-afiliado',
    marketplace: 'Amazon',
    commissionPercentage: 12.0,
    brand: 'LumiTech',
    features: ['16 milhões de cores', 'Compatível Alexa', 'Sensor rítmico'],
    benefits: ['Transforma a estética do quarto', 'Ideal para fotos'],
    viralScore: 9.2,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Mop Giratório Lavo e Seco com Balde Separador de Água Suja',
    photoUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    description: 'Limpeza 360° sem molhar ou sujar as mãos. Balde duo que separa água limpa da suja.',
    category: 'Utilidades Domésticas',
    price: 89.90,
    originalPrice: 159.90,
    affiliateLink: 'https://shope.ee/mop-giratorio-afiliado',
    marketplace: 'Shopee',
    commissionPercentage: 15.0,
    brand: 'CleanPro',
    features: ['Microfibra lavável', 'Balde duo'],
    benefits: ['Limpa em metade do tempo'],
    viralScore: 9.8,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Umidificador de Ar e Difusor de Aromas Efeito Chama Vulcan',
    photoUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80',
    description: 'Difusor ultra-sônico com iluminação de chama realista de LED e desligamento automático.',
    category: 'Decoração & Bem-Estar',
    price: 98.00,
    originalPrice: 180.00,
    affiliateLink: 'https://amzn.to/umidificador-chama',
    marketplace: 'Amazon',
    commissionPercentage: 11.5,
    brand: 'AromaVibe',
    features: ['Efeito fogo 3D', 'Silencioso'],
    benefits: ['Casa perfumada e decorada'],
    viralScore: 9.4,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

const now = new Date();

export const INITIAL_POSTS: ContentPost[] = [
  {
    id: 'post-101',
    productId: 'prod-1',
    productName: 'Mini Processador Elétrico Portátil Recarregável USB',
    title: '5 Achadinhos da Shopee que Parecem Caros mas Custam Menos de R$50',
    type: 'carousel',
    strategyCategory: 'attraction',
    status: 'published',
    scheduledFor: new Date(now.getTime() - 86400000 * 2).toISOString(),
    publishedAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
    mediaUrls: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80'
    ],
    coverUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
    caption: 'Você sabia que não precisa gastar muito para facilitar a rotina na cozinha? 😱 Arraste para o lado e veja 5 achadinhos por menos de 50 reais que mudaram minha vida! 🔥\n\n💬 Digite "EU QUERO" que envio o link no seu direct!\n\n#achadinhosshopee #cozinha #utilidadesdomesticas #dicasdecasa #afiliadoshopee',
    hashtags: ['#achadinhosshopee', '#cozinha', '#utilidadesdomesticas', '#dicasdecasa', '#afiliadoshopee'],
    cta: 'Comente "EU QUERO" para receber o link com desconto no direct!',
    analytics: {
      reach: 12450,
      impressions: 15890,
      likes: 980,
      comments: 142,
      shares: 310,
      saves: 520,
      clicks: 210,
      followersGained: 48
    },
    createdAt: new Date(now.getTime() - 86400000 * 3).toISOString()
  },
  {
    id: 'post-102',
    productId: 'prod-3',
    productName: 'Mop Giratório Lavo e Seco com Balde Separador',
    title: 'POV: Você descobriu como limpar a casa sem sujar a mão nunca mais 🧹',
    type: 'reel',
    strategyCategory: 'viral',
    status: 'scheduled',
    scheduledFor: new Date(now.getTime() + 3600000 * 4).toISOString(),
    mediaUrls: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
    ],
    coverUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    caption: 'Definitivamente esse Mop duo que separa a água suja da limpa foi a melhor compra do ano! 🧼✨\n\nLink no perfil ou comente "MOP" no post!\n\n#mop #limpezadecasa #donadecasa #achadinhos #organização',
    hashtags: ['#mop', '#limpezadecasa', '#donadecasa', '#achadinhos', '#organização'],
    cta: 'Siga @achadinhos.top.afiliado para acompanhar as melhores ofertas diárias!',
    analytics: {
      reach: 0,
      impressions: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      clicks: 0,
      followersGained: 0
    },
    createdAt: new Date(now.getTime() - 3600000 * 2).toISOString()
  }
];

export const INITIAL_AUTOPILOT_SETTINGS: AutopilotSettings = {
  enabled: true,
  postsPerDay: 2,
  requireApproval: true,
  lastRunAt: new Date(now.getTime() - 86400000).toISOString(),
  nextRunAt: new Date(now.getTime() + 43200000).toISOString(),
};

export const INITIAL_VIRAL_TRENDS: ViralProductTrend[] = [
  {
    id: 'trend-1',
    productName: 'Organizador de Geladeira Acrílico com Escorredor',
    category: 'Cozinha & Organização',
    viralReason: 'Alta busca no TikTok e Reels por vídeos no estilo ASMR Restock de Geladeira',
    reelIdea: 'Vídeo estilo ASMR preenchendo a geladeira com morangos e vegetais organizados',
    carouselIdea: 'Antes e Depois da geladeira caótica vs organizada',
    postIdea: '3 erros que você comete ao guardar frutas na geladeira',
    cta: 'Digite "GELADEIRA" para receber o link do kit com 4 potes!',
    potentialEngagement: 'Muito Alto 🔥 (Aumento de +310% em salvamentos)',
    sampleImageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'trend-2',
    productName: 'Luminária Projetor Galáxia Astronauta HD',
    category: 'Quarto & Tech',
    viralReason: 'Visual extremamente estético para vídeos curtos noturnos de Reels',
    reelIdea: 'Ligando a luminária no escuro com música envolvente ao fundo',
    carouselIdea: 'Comparativo: Quarto comum vs Quarto de Galáxia',
    postIdea: 'Dicas de presentes inesquecíveis por menos de R$100',
    cta: 'Salve este post para presentear quem você ama!',
    potentialEngagement: 'Alto ⭐ (Excelente retenção nos primeiros 3 segundos)',
    sampleImageUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=600&q=80',
  }
];
