-- AFILIADO.AI - DATABASE SCHEMA (SUPABASE / POSTGRESQL)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    plan_tier TEXT DEFAULT 'pro', -- 'free', 'pro', 'premium', 'enterprise'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. INSTAGRAM ACCOUNTS
CREATE TABLE IF NOT EXISTS public.instagram_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    instagram_user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    name TEXT,
    profile_picture_url TEXT,
    followers_count INT DEFAULT 0,
    media_count INT DEFAULT 0,
    account_type TEXT DEFAULT 'BUSINESS',
    is_connected BOOLEAN DEFAULT true,
    access_token TEXT,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_instagram UNIQUE (user_id, username)
);

-- 4. USER STRATEGIES & ONBOARDING
CREATE TABLE IF NOT EXISTS public.user_strategies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    profile_name TEXT NOT NULL,
    username TEXT NOT NULL,
    niche TEXT NOT NULL,
    subniche TEXT,
    target_audience TEXT NOT NULL,
    age_range TEXT,
    gender_predominant TEXT,
    region TEXT DEFAULT 'Brasil',
    primary_objectives TEXT[] DEFAULT ARRAY['gain_followers', 'generate_sales'],
    communication_tone TEXT DEFAULT 'Moderno',
    visual_style TEXT DEFAULT 'Moderno',
    posting_frequency INT DEFAULT 2, -- 1, 2 or 3 per day
    preferred_posting_hours TEXT[] DEFAULT ARRAY['11:30', '19:30'],
    affiliate_links TEXT[],
    marketplaces TEXT[] DEFAULT ARRAY['Hotmart', 'Shopee', 'Amazon'],
    distribution JSONB DEFAULT '{"attraction": 40, "viral": 25, "authority": 20, "commercial": 15}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BRAND KITS
CREATE TABLE IF NOT EXISTS public.brand_kits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    primary_color TEXT DEFAULT '#8B5CF6',
    secondary_color TEXT DEFAULT '#EC4899',
    accent_color TEXT DEFAULT '#F59E0B',
    background_color TEXT DEFAULT '#0F172A',
    font_heading TEXT DEFAULT 'Inter',
    font_body TEXT DEFAULT 'Inter',
    logo_url TEXT,
    watermark_enabled BOOLEAN DEFAULT true,
    watermark_position TEXT DEFAULT 'bottom_right',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PRODUCTS (BANCO DE PRODUTOS)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    photo_url TEXT,
    description TEXT,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    affiliate_link TEXT NOT NULL,
    marketplace TEXT NOT NULL,
    commission_percentage NUMERIC(5, 2) DEFAULT 30.00,
    brand TEXT,
    features TEXT[],
    benefits TEXT[],
    viral_score NUMERIC(3, 1) DEFAULT 8.5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. CONTENT POSTS & CALENDAR
CREATE TABLE IF NOT EXISTS public.content_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('reel', 'carousel', 'post', 'story')),
    strategy_category TEXT NOT NULL CHECK (strategy_category IN ('attraction', 'viral', 'authority', 'commercial')),
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'published', 'error')),
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    media_urls TEXT[],
    cover_url TEXT,
    caption TEXT NOT NULL,
    hashtags TEXT[],
    cta TEXT NOT NULL,
    reel_script JSONB,
    carousel_slides JSONB,
    analytics JSONB DEFAULT '{"reach": 0, "impressions": 0, "likes": 0, "comments": 0, "shares": 0, "saves": 0, "clicks": 0, "followers_gained": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. AUTOPILOT SETTINGS
CREATE TABLE IF NOT EXISTS public.autopilot_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT false,
    posts_per_day INT DEFAULT 2,
    require_approval BOOLEAN DEFAULT true, -- true = modo aprovação, false = publicar direto
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_autopilot UNIQUE (user_id)
);

-- 9. JOB QUEUE
CREATE TABLE IF NOT EXISTS public.job_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'rendering', 'completed', 'failed')),
    progress INT DEFAULT 0,
    error_message TEXT,
    result_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autopilot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_queue ENABLE ROW LEVEL SECURITY;

-- POLICIES (Usuário acessa estritamente seus próprios dados)
CREATE POLICY "Profiles self select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles self update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Instagram accounts self" ON public.instagram_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User strategies self" ON public.user_strategies FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Brand kits self" ON public.brand_kits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Products self" ON public.products FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Content posts self" ON public.content_posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Autopilot settings self" ON public.autopilot_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Job queue self" ON public.job_queue FOR ALL USING (auth.uid() = user_id);
