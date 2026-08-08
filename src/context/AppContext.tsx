import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Profile,
  InstagramAccount,
  UserStrategy,
  BrandKit,
  Product,
  ContentPost,
  AutopilotSettings,
  ActiveTab,
  JobItem,
  ViralProductTrend
} from '../types';
import {
  INITIAL_INSTAGRAM_ACCOUNT,
  INITIAL_USER_STRATEGY,
  INITIAL_BRAND_KIT,
  INITIAL_PRODUCTS,
  INITIAL_POSTS,
  INITIAL_AUTOPILOT_SETTINGS,
  INITIAL_VIRAL_TRENDS
} from '../utils/mockData';
import { metaApiService } from '../services/metaApiService';
import { AIContentEngine } from '../services/aiContentEngine';
import { jobQueueService } from '../services/jobQueueService';
import { SupabaseService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  userProfile: Profile;
  instagramAccount: InstagramAccount;
  userStrategy: UserStrategy;
  brandKit: BrandKit;
  products: Product[];
  posts: ContentPost[];
  autopilot: AutopilotSettings;
  activeTab: ActiveTab;
  jobs: JobItem[];
  viralTrends: ViralProductTrend[];
  toasts: Toast[];
  isOnboardingCompleted: boolean;
  isDatabaseConnected: boolean;
  
  // Handlers
  setActiveTab: (tab: ActiveTab) => void;
  setIsOnboardingCompleted: (status: boolean) => void;
  connectInstagram: () => Promise<void>;
  disconnectInstagram: () => Promise<void>;
  updateStrategy: (strategy: Partial<UserStrategy>) => void;
  updateBrandKit: (kit: Partial<BrandKit>) => void;
  
  // Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Post CRUD & Actions
  createPost: (post: Omit<ContentPost, 'id' | 'createdAt' | 'analytics'>) => ContentPost;
  updatePost: (id: string, post: Partial<ContentPost>) => void;
  deletePost: (id: string) => void;
  publishPostNow: (id: string) => Promise<void>;
  
  // AI Automation
  generateAutoCampaignForProduct: (productId: string) => void;
  generateAutoContentPlan: () => void;
  
  // Autopilot
  toggleAutopilot: (enabled: boolean) => void;
  updateAutopilotSettings: (settings: Partial<AutopilotSettings>) => void;
  
  // Toast
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile] = useState<Profile>({
    id: 'user-01',
    email: 'afiliado.pro@exemplo.com',
    fullName: 'Alex Afiliado Pro',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    planTier: 'pro',
  });

  const [instagramAccount, setInstagramAccount] = useState<InstagramAccount>(INITIAL_INSTAGRAM_ACCOUNT);
  const [userStrategy, setUserStrategy] = useState<UserStrategy>(INITIAL_USER_STRATEGY);
  const [brandKit, setBrandKit] = useState<BrandKit>(INITIAL_BRAND_KIT);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [posts, setPosts] = useState<ContentPost[]>(INITIAL_POSTS);
  const [autopilot, setAutopilot] = useState<AutopilotSettings>(INITIAL_AUTOPILOT_SETTINGS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [viralTrends] = useState<ViralProductTrend[]>(INITIAL_VIRAL_TRENDS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(true);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = jobQueueService.subscribe((updatedJobs) => {
      setJobs(updatedJobs);
    });
    return unsubscribe;
  }, []);

  // Carregamento inicial do Supabase Backend
  useEffect(() => {
    if (isSupabaseConfigured()) {
      setIsDatabaseConnected(true);
      addToast('🟢 Supabase Backend conectado em tempo real (Projeto: afiliado-ai)!', 'success');

      SupabaseService.fetchProducts().then((dbProducts) => {
        if (dbProducts && dbProducts.length > 0) setProducts(dbProducts);
      });

      SupabaseService.fetchPosts().then((dbPosts) => {
        if (dbPosts && dbPosts.length > 0) setPosts(dbPosts);
      });

      SupabaseService.fetchStrategy().then((dbStrategy) => {
        if (dbStrategy) setUserStrategy(dbStrategy);
      });

      SupabaseService.fetchBrandKit().then((dbBrandKit) => {
        if (dbBrandKit) setBrandKit(dbBrandKit);
      });

      SupabaseService.fetchAutopilot().then((dbAutopilot) => {
        if (dbAutopilot) setAutopilot(dbAutopilot);
      });
    }
  }, []);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const connectInstagram = async () => {
    try {
      const account = await metaApiService.connectAccount();
      setInstagramAccount(account);
      addToast('🟢 Instagram conectado com sucesso via Meta API oficial!', 'success');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {
      addToast('Erro ao conectar conta do Instagram', 'error');
    }
  };

  const disconnectInstagram = async () => {
    await metaApiService.disconnectAccount();
    setInstagramAccount((prev) => ({ ...prev, isConnected: false }));
    addToast('Conta do Instagram desconectada', 'info');
  };

  const updateStrategy = (partial: Partial<UserStrategy>) => {
    setUserStrategy((prev) => {
      const updated = { ...prev, ...partial };
      SupabaseService.saveStrategy(updated);
      return updated;
    });
    addToast('Estratégia atualizada com sucesso', 'success');
  };

  const updateBrandKit = (partial: Partial<BrandKit>) => {
    setBrandKit((prev) => {
      const updated = { ...prev, ...partial };
      SupabaseService.saveBrandKit(updated);
      return updated;
    });
    addToast('Brand Kit atualizado!', 'success');
  };

  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt'>): Product => {
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [product, ...prev]);
    SupabaseService.saveProduct(product);
    addToast(`Produto "${product.name}" adicionado ao Banco de Produtos!`, 'success');
    return product;
  };

  const updateProduct = (id: string, partial: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...partial };
          SupabaseService.saveProduct(updated);
          return updated;
        }
        return p;
      })
    );
    addToast('Produto atualizado', 'info');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    SupabaseService.deleteProduct(id);
    addToast('Produto removido', 'warning');
  };

  const createPost = (newPost: Omit<ContentPost, 'id' | 'createdAt' | 'analytics'>): ContentPost => {
    const post: ContentPost = {
      ...newPost,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      analytics: { reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, followersGained: 0 },
    };
    setPosts((prev) => [post, ...prev]);
    SupabaseService.savePost(post);
    jobQueueService.addJob(`Gerar e renderizar mídia para ${post.type.toUpperCase()}: ${post.title}`);
    addToast(`Publicação "${post.title}" agendada!`, 'success');
    return post;
  };

  const updatePost = (id: string, partial: Partial<ContentPost>) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...partial };
          SupabaseService.savePost(updated);
          return updated;
        }
        return p;
      })
    );
    addToast('Conteúdo atualizado', 'info');
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    SupabaseService.deletePost(id);
    addToast('Conteúdo excluído do calendário', 'warning');
  };

  const publishPostNow = async (id: string) => {
    const targetPost = posts.find((p) => p.id === id);
    if (!targetPost) return;

    addToast(`Publicando "${targetPost.title}" no Instagram...`, 'info');
    await metaApiService.publishMediaToInstagram(targetPost.id, targetPost.mediaUrls[0], targetPost.caption);

    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'published',
              publishedAt: new Date().toISOString(),
              analytics: {
                reach: Math.floor(Math.random() * 2000) + 500,
                impressions: Math.floor(Math.random() * 3500) + 800,
                likes: Math.floor(Math.random() * 300) + 40,
                comments: Math.floor(Math.random() * 45) + 5,
                shares: Math.floor(Math.random() * 80) + 12,
                saves: Math.floor(Math.random() * 120) + 20,
                clicks: Math.floor(Math.random() * 60) + 10,
                followersGained: Math.floor(Math.random() * 15) + 2,
              },
            }
          : p
      )
    );

    addToast(`🟢 Publicado com sucesso no Instagram @${instagramAccount.username}!`, 'success');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
  };

  const generateAutoCampaignForProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    addToast(`Criando campanha completa 360° com IA para "${product.name}"...`, 'info');
    jobQueueService.addJob(`Criando Reel, Carrossel, Post e Stories para ${product.name}`);

    const campaignPosts = AIContentEngine.generateCompleteCampaign(product, new Date());
    setPosts((prev) => [...campaignPosts, ...prev]);

    addToast(`✨ Campanha criada! 4 conteúdos adicionados ao calendário.`, 'success');
    confetti({ particleCount: 70, spread: 60 });
  };

  const generateAutoContentPlan = () => {
    if (products.length === 0) {
      addToast('Cadastre ao menos 1 produto no Banco de Produtos primeiro!', 'warning');
      return;
    }

    addToast('IA Content Studio analisando nicho, público e gerando calendário...', 'info');
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    generateAutoCampaignForProduct(randomProduct.id);
  };

  const toggleAutopilot = (enabled: boolean) => {
    setAutopilot((prev) => {
      const updated = { ...prev, enabled };
      SupabaseService.saveAutopilot(updated);
      return updated;
    });
    if (enabled) {
      addToast('✨ Piloto Automático ATIVADO! A IA irá planejar e criar conteúdos diariamente.', 'success');
      confetti({ particleCount: 50, spread: 50 });
    } else {
      addToast('Piloto Automático desativado', 'info');
    }
  };

  const updateAutopilotSettings = (partial: Partial<AutopilotSettings>) => {
    setAutopilot((prev) => {
      const updated = { ...prev, ...partial };
      SupabaseService.saveAutopilot(updated);
      return updated;
    });
    addToast('Configurações de automação salvas!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        instagramAccount,
        userStrategy,
        brandKit,
        products,
        posts,
        autopilot,
        activeTab,
        jobs,
        viralTrends,
        toasts,
        isOnboardingCompleted,
        isDatabaseConnected,
        setActiveTab,
        setIsOnboardingCompleted,
        connectInstagram,
        disconnectInstagram,
        updateStrategy,
        updateBrandKit,
        addProduct,
        updateProduct,
        deleteProduct,
        createPost,
        updatePost,
        deletePost,
        publishPostNow,
        generateAutoCampaignForProduct,
        generateAutoContentPlan,
        toggleAutopilot,
        updateAutopilotSettings,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
