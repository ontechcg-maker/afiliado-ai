import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  Profile,
  InstagramAccount,
  Product,
  ContentPost,
  UserStrategy,
  BrandKit,
  AutopilotSettings
} from '../types';

export class SupabaseService {
  // --- PROFILES & AUTH ---
  static async fetchProfile(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name || '',
      avatarUrl: data.avatar_url || undefined,
      planTier: data.plan_tier || 'pro',
    };
  }

  static async saveProfile(profile: Profile): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    const payload = {
      id: profile.id,
      email: profile.email,
      full_name: profile.fullName,
      avatar_url: profile.avatarUrl || null,
      plan_tier: profile.planTier,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(payload);
    if (error) console.error('Erro ao salvar perfil no Supabase:', error);
    return !error;
  }

  static async fetchInstagramAccount(userId: string): Promise<InstagramAccount | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    const { data, error } = await supabase
      .from('instagram_accounts')
      .select('*')
      .eq('user_id', userId)
      .order('connected_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      instagramUserId: data.instagram_user_id,
      username: data.username,
      name: data.name || data.username,
      profilePictureUrl: data.profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      followersCount: data.followers_count || 1200,
      mediaCount: data.media_count || 45,
      accountType: (data.account_type as any) || 'BUSINESS',
      isConnected: data.is_connected,
      connectedAt: data.connected_at,
    };
  }

  static async saveInstagramAccount(account: InstagramAccount, userId: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    const payload = {
      user_id: userId,
      instagram_user_id: account.instagramUserId || `ig-${Date.now()}`,
      username: account.username,
      name: account.name,
      profile_picture_url: account.profilePictureUrl,
      followers_count: account.followersCount || 1200,
      media_count: account.mediaCount || 45,
      account_type: account.accountType || 'BUSINESS',
      is_connected: account.isConnected,
      connected_at: account.connectedAt || new Date().toISOString(),
    };

    const { error } = await supabase.from('instagram_accounts').upsert(payload, { onConflict: 'user_id,username' });
    if (error) console.error('Erro ao salvar conta do Instagram no Supabase:', error);
    return !error;
  }

  // --- PRODUCTS ---
  static async fetchProducts(userId?: string): Promise<Product[] | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });
    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query;
    if (error) {
      console.error('Erro ao buscar produtos do Supabase:', error);
      return null;
    }

    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      photoUrl: row.photo_url || '',
      description: row.description || '',
      category: row.category,
      price: Number(row.price),
      originalPrice: row.original_price ? Number(row.original_price) : undefined,
      affiliateLink: row.affiliate_link,
      marketplace: row.marketplace,
      commissionPercentage: Number(row.commission_percentage || 30),
      brand: row.brand || undefined,
      features: row.features || [],
      benefits: row.benefits || [],
      viralScore: Number(row.viral_score || 8.5),
      createdAt: row.created_at,
    }));
  }

  static async saveProduct(product: Product, userId?: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    const payload: any = {
      name: product.name,
      photo_url: product.photoUrl,
      description: product.description,
      category: product.category,
      price: product.price,
      original_price: product.originalPrice,
      affiliate_link: product.affiliateLink,
      marketplace: product.marketplace,
      commission_percentage: product.commissionPercentage,
      brand: product.brand,
      features: product.features,
      benefits: product.benefits,
      viral_score: product.viralScore,
    };
    if (userId) payload.user_id = userId;

    const { error } = await supabase.from('products').upsert(payload);
    if (error) console.error('Erro ao salvar produto no Supabase:', error);
    return !error;
  }

  static async deleteProduct(id: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error('Erro ao deletar produto no Supabase:', error);
    return !error;
  }

  // --- CONTENT POSTS ---
  static async fetchPosts(userId?: string): Promise<ContentPost[] | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    let query = supabase.from('content_posts').select('*').order('scheduled_for', { ascending: false });
    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query;
    if (error) {
      console.error('Erro ao buscar posts do Supabase:', error);
      return null;
    }

    return (data || []).map((row) => ({
      id: row.id,
      productId: row.product_id || undefined,
      productName: row.product_name || undefined,
      title: row.title,
      type: row.type,
      strategyCategory: row.strategy_category,
      status: row.status,
      scheduledFor: row.scheduled_for,
      publishedAt: row.published_at || undefined,
      mediaUrls: row.media_urls || [],
      coverUrl: row.cover_url || undefined,
      caption: row.caption,
      hashtags: row.hashtags || [],
      cta: row.cta,
      reelScript: row.reel_script || undefined,
      carouselSlides: row.carousel_slides || undefined,
      analytics: row.analytics || {
        reach: 0, impressions: 0, likes: 0, comments: 0,
        shares: 0, saves: 0, clicks: 0, followersGained: 0
      },
      createdAt: row.created_at,
    }));
  }

  static async savePost(post: ContentPost, userId?: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    const payload: any = {
      product_id: post.productId || null,
      product_name: post.productName || null,
      title: post.title,
      type: post.type,
      strategy_category: post.strategyCategory,
      status: post.status,
      scheduled_for: post.scheduledFor,
      published_at: post.publishedAt || null,
      media_urls: post.mediaUrls,
      cover_url: post.coverUrl || null,
      caption: post.caption,
      hashtags: post.hashtags,
      cta: post.cta,
      reel_script: post.reelScript || null,
      carousel_slides: post.carouselSlides || null,
      analytics: post.analytics,
    };
    if (userId) payload.user_id = userId;

    const { error } = await supabase.from('content_posts').upsert(payload);
    if (error) console.error('Erro ao salvar post no Supabase:', error);
    return !error;
  }

  static async deletePost(id: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    const { error } = await supabase.from('content_posts').delete().eq('id', id);
    if (error) console.error('Erro ao deletar post no Supabase:', error);
    return !error;
  }

  // --- STRATEGY ---
  static async fetchStrategy(userId?: string): Promise<UserStrategy | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    let query = supabase.from('user_strategies').select('*');
    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query.single();
    if (error || !data) return null;

    return {
      profileName: data.profile_name,
      username: data.username,
      niche: data.niche,
      subniche: data.subniche || '',
      targetAudience: data.target_audience,
      ageRange: data.age_range || '',
      genderPredominant: data.gender_predominant || '',
      region: data.region || 'Brasil',
      primaryObjectives: data.primary_objectives || [],
      communicationTone: data.communication_tone || 'Moderno',
      visualStyle: data.visual_style || 'Moderno',
      postingFrequency: data.posting_frequency || 2,
      preferredPostingHours: data.preferred_posting_hours || ['11:30', '19:30'],
      affiliateLinks: data.affiliate_links || [],
      marketplaces: data.marketplaces || [],
      distribution: data.distribution || { attraction: 40, viral: 25, authority: 20, commercial: 15 },
    };
  }

  static async saveStrategy(strategy: UserStrategy, userId?: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    const payload: any = {
      profile_name: strategy.profileName,
      username: strategy.username,
      niche: strategy.niche,
      subniche: strategy.subniche,
      target_audience: strategy.targetAudience,
      age_range: strategy.ageRange,
      gender_predominant: strategy.genderPredominant,
      region: strategy.region,
      primary_objectives: strategy.primaryObjectives,
      communication_tone: strategy.communicationTone,
      visual_style: strategy.visualStyle,
      posting_frequency: strategy.postingFrequency,
      preferred_posting_hours: strategy.preferredPostingHours,
      affiliate_links: strategy.affiliateLinks,
      marketplaces: strategy.marketplaces,
      distribution: strategy.distribution,
    };
    if (userId) payload.user_id = userId;

    const { error } = await supabase.from('user_strategies').upsert(payload);
    if (error) console.error('Erro ao salvar estratégia no Supabase:', error);
    return !error;
  }

  // --- BRAND KIT ---
  static async fetchBrandKit(userId?: string): Promise<BrandKit | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    let query = supabase.from('brand_kits').select('*');
    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query.single();
    if (error || !data) return null;

    return {
      brandName: data.brand_name,
      primaryColor: data.primary_color,
      secondaryColor: data.secondary_color,
      accentColor: data.accent_color,
      backgroundColor: data.background_color,
      fontHeading: data.font_heading,
      fontBody: data.font_body,
      logoUrl: data.logo_url || undefined,
      watermarkEnabled: data.watermark_enabled,
      watermarkPosition: data.watermark_position || 'bottom_right',
    };
  }

  static async saveBrandKit(brandKit: BrandKit, userId?: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    const payload: any = {
      brand_name: brandKit.brandName,
      primary_color: brandKit.primaryColor,
      secondary_color: brandKit.secondaryColor,
      accent_color: brandKit.accentColor,
      background_color: brandKit.backgroundColor,
      font_heading: brandKit.fontHeading,
      font_body: brandKit.fontBody,
      logo_url: brandKit.logoUrl || null,
      watermark_enabled: brandKit.watermarkEnabled,
      watermark_position: brandKit.watermarkPosition,
    };
    if (userId) payload.user_id = userId;

    const { error } = await supabase.from('brand_kits').upsert(payload);
    if (error) console.error('Erro ao salvar Brand Kit no Supabase:', error);
    return !error;
  }

  // --- AUTOPILOT ---
  static async fetchAutopilot(userId?: string): Promise<AutopilotSettings | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    let query = supabase.from('autopilot_settings').select('*');
    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query.single();
    if (error || !data) return null;

    return {
      enabled: data.enabled,
      postsPerDay: data.posts_per_day,
      requireApproval: data.require_approval,
      lastRunAt: data.last_run_at || undefined,
      nextRunAt: data.next_run_at || undefined,
    };
  }

  static async saveAutopilot(autopilot: AutopilotSettings, userId?: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    const payload: any = {
      enabled: autopilot.enabled,
      posts_per_day: autopilot.postsPerDay,
      require_approval: autopilot.requireApproval,
      last_run_at: autopilot.lastRunAt || null,
      next_run_at: autopilot.nextRunAt || null,
    };
    if (userId) payload.user_id = userId;

    const { error } = await supabase.from('autopilot_settings').upsert(payload);
    if (error) console.error('Erro ao salvar Autopilot no Supabase:', error);
    return !error;
  }
}
