import type { InstagramAccount } from '../types';

export class MetaApiService {
  // Simulação de fluxo oficial OAuth Meta / Instagram Graph API
  async connectAccount(): Promise<InstagramAccount> {
    await new Promise((resolve) => setTimeout(resolve, 1800));

    return {
      id: `ig-${Date.now()}`,
      instagramUserId: '1784140998877665',
      username: 'achadinhos.top.afiliado',
      name: 'Achadinhos Incríveis ✨',
      profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      followersCount: 14820,
      mediaCount: 184,
      accountType: 'BUSINESS',
      isConnected: true,
      connectedAt: new Date().toISOString(),
    };
  }

  async disconnectAccount(): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return true;
  }

  async publishMediaToInstagram(_postId: string, _mediaUrl: string, _caption: string): Promise<{ success: boolean; instagramMediaId: string }> {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: true,
      instagramMediaId: `meta_media_${Date.now()}`,
    };
  }
}

export const metaApiService = new MetaApiService();
