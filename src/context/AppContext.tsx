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
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthModal } from '../components/auth/AuthModal';
import { evolutionService } from '../services/evolutionService';
import { WhatsAppConfigDrawer } from '../components/whatsapp/WhatsAppConfigDrawer';
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
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  isWhatsAppDrawerOpen: boolean;
  
  // Handlers
  setActiveTab: (tab: ActiveTab) => void;
  setIsOnboardingCompleted: (status: boolean) => void;
  connectInstagram: () => Promise<void>;
  disconnectInstagram: () => Promise<void>;
  updateStrategy: (strategy: Partial<UserStrategy>) => void;
  updateBrandKit: (kit: Partial<BrandKit>) => void;

  // WhatsApp Drawer Handlers
  openWhatsAppDrawer: () => void;
  closeWhatsAppDrawer: () => void;
  
  // Auth Handlers
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  
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
  const [userProfile, setUserProfile] = useState<Profile>({
    id: 'guest',
    email: '',
    fullName: 'Visitante',
    avatarUrl: '',
    planTier: 'free',
  });

  const [instagramAccount, setInstagramAccount] = useState<InstagramAccount>(
    isSupabaseConfigured()
      ? {
          id: '',
          instagramUserId: '',
          username: '',
          name: '',
          profilePictureUrl: '',
          followersCount: 0,
          mediaCount: 0,
          accountType: 'BUSINESS',
          isConnected: false,
          connectedAt: undefined,
        }
      : INITIAL_INSTAGRAM_ACCOUNT
  );

  const [userStrategy, setUserStrategy] = useState<UserStrategy>(INITIAL_USER_STRATEGY);
  const [brandKit, setBrandKit] = useState<BrandKit>(INITIAL_BRAND_KIT);
  const [products, setProducts] = useState<Product[]>(isSupabaseConfigured() ? [] : INITIAL_PRODUCTS);
  const [posts, setPosts] = useState<ContentPost[]>(isSupabaseConfigured() ? [] : INITIAL_POSTS);
  const [autopilot, setAutopilot] = useState<AutopilotSettings>(INITIAL_AUTOPILOT_SETTINGS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [viralTrends] = useState<ViralProductTrend[]>(INITIAL_VIRAL_TRENDS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(true);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isWhatsAppDrawerOpen, setIsWhatsAppDrawerOpen] = useState<boolean>(false);

  const openWhatsAppDrawer = () => setIsWhatsAppDrawerOpen(true);
  const closeWhatsAppDrawer = () => setIsWhatsAppDrawerOpen(false);

  useEffect(() => {
    const unsubscribe = jobQueueService.subscribe((updatedJobs) => {
      setJobs(updatedJobs);
    });
    return unsubscribe;
  }, []);

  // Escuta a sessão de autenticação do Supabase
  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      setIsDatabaseConnected(true);

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          setIsAuthenticated(true);
          const userId = session.user.id;
          const userEmail = session.user.email || '';
          const userFullName = session.user.user_metadata?.full_name || 'Afiliado Pro';

          setUserProfile({
            id: userId,
            email: userEmail,
            fullName: userFullName,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            planTier: 'pro',
          });

          // Carrega dados do usuário autenticado
          loadUserData(userId);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
          setIsAuthenticated(true);
          const userId = session.user.id;
          const userEmail = session.user.email || '';
          const userFullName = session.user.user_metadata?.full_name || 'Afiliado Pro';

          setUserProfile({
            id: userId,
            email: userEmail,
            fullName: userFullName,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            planTier: 'pro',
          });

          loadUserData(userId);
        } else {
          setIsAuthenticated(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const loadUserData = (userId: string) => {
    SupabaseService.fetchProducts(userId).then((dbProducts) => {
      setProducts(dbProducts || []);
    });

    SupabaseService.fetchPosts(userId).then((dbPosts) => {
      setPosts(dbPosts || []);
    });

    SupabaseService.fetchStrategy(userId).then((dbStrategy) => {
      if (dbStrategy) setUserStrategy(dbStrategy);
    });

    SupabaseService.fetchBrandKit(userId).then((dbBrandKit) => {
      if (dbBrandKit) setBrandKit(dbBrandKit);
    });

    SupabaseService.fetchAutopilot(userId).then((dbAutopilot) => {
      if (dbAutopilot) setAutopilot(dbAutopilot);
    });
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    if (!isSupabaseConfigured() || !supabase) {
      addToast('Supabase não configurado. Rodando em modo simulação.', 'warning');
      setIsAuthenticated(true);
      return true;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Traduzir erros comuns do Supabase para português
      let msg = error.message;
      if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
        msg = 'E-mail ou senha incorretos. Verifique e tente novamente.';
      } else if (msg.includes('Email not confirmed')) {
        msg = '⚠️ Confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.';
      } else if (msg.includes('Too many requests')) {
        msg = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
      }
      addToast(msg, 'error');
      return false;
    }

    if (data.session) {
      addToast(`👋 Bem-vindo de volta, ${data.user.user_metadata?.full_name || email}!`, 'success');
      confetti({ particleCount: 60, spread: 60 });
      return true;
    }
    return false;
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string): Promise<boolean> => {
    if (!isSupabaseConfigured() || !supabase) {
      addToast('Conta simulada criada com sucesso no modo local.', 'success');
      setIsAuthenticated(true);
      return true;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}`,
      },
    });

    if (error) {
      let msg = error.message;
      if (msg.includes('User already registered') || msg.includes('already been registered')) {
        msg = '⚠️ Este e-mail já está cadastrado. Tente fazer login.';
      } else if (msg.includes('Password should be at least')) {
        msg = '⚠️ Senha muito curta. Use pelo menos 6 caracteres.';
      } else if (msg.includes('Invalid email')) {
        msg = '⚠️ E-mail inválido. Verifique o endereço digitado.';
      }
      addToast(msg, 'error');
      return false;
    }

    if (data.user) {
      // Salvar perfil no banco
      await SupabaseService.saveProfile({
        id: data.user.id,
        email,
        fullName,
        planTier: 'pro',
      });

      // Se a sessão já foi criada (confirmação de e-mail desabilitada no Supabase)
      if (data.session) {
        addToast(`🎉 Bem-vindo ao AFILIADO.AI, ${fullName}! Conta criada com sucesso!`, 'success');
        confetti({ particleCount: 100, spread: 80 });
        return true;
      } else {
        // Confirmação de e-mail habilitada — avisar o usuário
        addToast(
          `📧 Conta criada! Acesse seu e-mail (${email}) e clique no link de confirmação para ativar sua conta.`,
          'info'
        );
        return false; // Não fechar o modal — usuário precisa confirmar e-mail
      }
    }
    return false;
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    addToast('Sessão encerrada com sucesso.', 'info');
  };

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
    await metaApiService.publishMediaToInstagram(
      targetPost.id,
      targetPost.mediaUrls[0] || targetPost.coverUrl || '',
      targetPost.caption,
      targetPost.type,
      targetPost.mediaUrls
    );

    const updatedPost: ContentPost = {
      ...targetPost,
      status: 'published',
      publishedAt: new Date().toISOString(),
      // Analytics zeradas — serão preenchidas pelos dados reais da Meta Insights API
      analytics: {
        reach: 0,
        impressions: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        clicks: 0,
        followersGained: 0,
      },
    };

    setPosts((prev) => prev.map((p) => (p.id === id ? updatedPost : p)));
    SupabaseService.savePost(updatedPost);

    addToast(`🟢 Publicado com sucesso no Instagram @${instagramAccount.username}!`, 'success');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });

    // Notificação WhatsApp
    evolutionService.sendTextMessage(
      `🚀 *AFILIADO.AI*: Seu conteúdo *"${targetPost.title}"* acaba de ser publicado com sucesso no Instagram @${instagramAccount.username}!`
    );
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

    // Notificação WhatsApp
    evolutionService.sendTextMessage(
      `✨ *AFILIADO.AI*: Uma nova campanha 360° (Reel, Carrossel, Post e Stories) foi gerada pela IA Gemini 2.5 Pro para o produto *"${product.name}"*!`
    );
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
        isAuthenticated,
        isAuthModalOpen,
        isWhatsAppDrawerOpen,
        openWhatsAppDrawer,
        closeWhatsAppDrawer,
        openAuthModal,
        closeAuthModal,
        loginWithEmail,
        signUpWithEmail,
        logout,
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
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      <WhatsAppConfigDrawer isOpen={isWhatsAppDrawerOpen} onClose={closeWhatsAppDrawer} />
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
