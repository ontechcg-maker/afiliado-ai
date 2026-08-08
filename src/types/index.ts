export type PlanTier = 'free' | 'pro' | 'premium' | 'enterprise';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  planTier: PlanTier;
}

export interface InstagramAccount {
  id: string;
  instagramUserId: string;
  username: string;
  name: string;
  profilePictureUrl: string;
  followersCount: number;
  mediaCount: number;
  accountType: 'BUSINESS' | 'CREATOR';
  isConnected: boolean;
  connectedAt: string;
}

export type StrategyObjective = 'gain_followers' | 'increase_engagement' | 'generate_sales' | 'generate_clicks' | 'build_authority';

export type VisualStyle = 'Profissional' | 'Minimalista' | 'Luxuoso' | 'Moderno' | 'Viral' | 'Jovem' | 'Popular' | 'Elegante' | 'Tecnológico' | 'Promocional';

export type CommunicationTone = 'Profissional' | 'Descontraído' | 'Persuasivo' | 'Educativo' | 'Inspiracional' | 'Direto';

export interface ContentDistribution {
  attraction: number; // default 40%
  viral: number;      // default 25%
  authority: number;  // default 20%
  commercial: number; // default 15%
}

export interface UserStrategy {
  profileName: string;
  username: string;
  niche: string;
  subniche: string;
  targetAudience: string;
  ageRange: string;
  genderPredominant: string;
  region: string;
  primaryObjectives: StrategyObjective[];
  visualStyle: VisualStyle;
  communicationTone: CommunicationTone;
  postingFrequency: number; // 1, 2, or 3 posts/day
  preferredPostingHours: string[];
  affiliateLinks: string[];
  marketplaces: string[];
  distribution: ContentDistribution;
}

export interface BrandKit {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontHeading: string;
  fontBody: string;
  logoUrl?: string;
  watermarkEnabled: boolean;
  watermarkPosition: 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right';
}

export interface Product {
  id: string;
  name: string;
  photoUrl: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  affiliateLink: string;
  marketplace: 'Shopee' | 'Hotmart' | 'Kiwify' | 'Amazon' | 'Mercado Livre' | 'Magalu' | 'Outro';
  commissionPercentage: number;
  brand?: string;
  features: string[];
  benefits: string[];
  viralScore: number; // 1 to 10
  createdAt: string;
}

export type ContentType = 'reel' | 'carousel' | 'post' | 'story';
export type StrategyCategory = 'attraction' | 'viral' | 'authority' | 'commercial';
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'error';

export interface ReelScene {
  sceneNumber: number;
  visual: string;
  audioText?: string;
  onScreenText: string;
  cameraMovement: string;
  transition: string;
  durationSeconds: number;
}

export interface ReelScript {
  hook: string;
  durationSeconds: number;
  structureModel: string; // e.g. 'Gancho + produto + CTA', 'Problema/Solução'
  mode: 'no_voice' | 'voiceover';
  suggestedMusic: string;
  scenes: ReelScene[];
}

export interface CarouselSlide {
  slideNumber: number;
  headline: string;
  text: string;
  visualDescription: string;
  ctaText?: string;
}

export interface PostAnalytics {
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  followersGained: number;
}

export interface ContentPost {
  id: string;
  productId?: string;
  productName?: string;
  title: string;
  type: ContentType;
  strategyCategory: StrategyCategory;
  status: PostStatus;
  scheduledFor: string;
  publishedAt?: string;
  mediaUrls: string[];
  coverUrl?: string;
  caption: string;
  hashtags: string[];
  cta: string;
  reelScript?: ReelScript;
  carouselSlides?: CarouselSlide[];
  analytics: PostAnalytics;
  createdAt: string;
}

export interface AutopilotSettings {
  enabled: boolean;
  postsPerDay: number;
  requireApproval: boolean; // true: modo aprovação, false: modo automático
  lastRunAt?: string;
  nextRunAt?: string;
}

export interface JobItem {
  id: string;
  taskName: string;
  status: 'pending' | 'processing' | 'rendering' | 'completed' | 'failed';
  progress: number; // 0 to 100
  errorMessage?: string;
  resultContentId?: string;
  createdAt: string;
}

export interface ViralProductTrend {
  id: string;
  productName: string;
  category: string;
  viralReason: string;
  reelIdea: string;
  carouselIdea: string;
  postIdea: string;
  cta: string;
  potentialEngagement: string;
  sampleImageUrl: string;
}

export interface AIConsultantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; actionKey: string }[];
}

export type ActiveTab =
  | 'dashboard'
  | 'studio'
  | 'reels'
  | 'posts'
  | 'carousels'
  | 'stories'
  | 'products'
  | 'calendar'
  | 'trends'
  | 'analytics'
  | 'consultant'
  | 'brand'
  | 'library'
  | 'settings';
