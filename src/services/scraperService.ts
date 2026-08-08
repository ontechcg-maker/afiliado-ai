export interface ScrapedProduct {
  title: string;
  priceFrom?: number;
  priceTo?: number;
  discountPct?: number;
  coupon?: string;
  rating?: number;
  imageUrl?: string;
  platform: 'Shopee' | 'Amazon' | 'Hotmart' | 'Kiwify' | 'Mercado Livre' | 'Magalu' | 'Outro';
  affiliateLink?: string;
}

export function detectPlatform(url: string): 'Shopee' | 'Amazon' | 'Hotmart' | 'Kiwify' | 'Mercado Livre' | 'Magalu' | 'Outro' {
  if (url.includes('mercadolivre') || url.includes('mercadolibre') || url.includes('mercl.io') || url.includes('meli.la')) return 'Mercado Livre';
  if (url.includes('shopee') || url.includes('shope.ee')) return 'Shopee';
  if (url.includes('amazon') || url.includes('amzn')) return 'Amazon';
  if (url.includes('hotmart')) return 'Hotmart';
  if (url.includes('kiwify')) return 'Kiwify';
  if (url.includes('magazineluiza') || url.includes('magalu') || url.includes('mglu') || url.includes('magazinevoce')) return 'Magalu';
  return 'Outro';
}

/**
 * Expande e desencurta URLs (meli.la, amzn.to, shope.ee, etc.)
 */
export async function unshortenUrl(url: string): Promise<string> {
  const isShortLink =
    url.includes('meli.la') ||
    url.includes('/sec/') ||
    url.includes('mercl.io') ||
    url.includes('shope.ee') ||
    url.includes('amzn.to') ||
    url.includes('onelink.me') ||
    url.includes('mglu.io');

  if (!isShortLink) {
    return url;
  }

  try {
    const proxyRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    if (proxyRes.ok) {
      const data = await proxyRes.json();
      const finalUrl = data?.status?.url;
      if (finalUrl && finalUrl !== url && !finalUrl.includes('corsproxy')) {
        return finalUrl;
      }
    }
  } catch {}

  return url;
}

function extractDiscount(priceFrom?: number, priceTo?: number): number | undefined {
  if (!priceFrom || !priceTo || priceFrom <= priceTo) return undefined;
  return Math.round(((priceFrom - priceTo) / priceFrom) * 100);
}

function extractTitleFromUrlSlug(url: string): string | undefined {
  if (url.includes('shopee') || url.includes('shope.ee')) return undefined;

  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;

    const slugMatch =
      pathname.match(/\/([a-z0-9-]+)\/(?:p\/|MLB|\d)/i) ||
      pathname.match(/\/([a-z0-9-]{10,})\/?$/i);

    if (slugMatch && slugMatch[1]) {
      const rawSlug = slugMatch[1];
      if (rawSlug !== 'p' && rawSlug !== 'mercadolivre' && rawSlug.length > 5) {
        return rawSlug
          .split('-')
          .map((word) => {
            if (['tv', '4k', 'ai', 'hd', '5g', 'pc', 'ar', 'bivolt', 'led', 'ram', 'gb', 'tb', 'ssd', 'oven', '12l', '127v', '220v'].includes(word.toLowerCase())) {
              return word.toUpperCase();
            }
            if (word.length <= 2) return word.toLowerCase();
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(' ');
      }
    }
  } catch {}
  return undefined;
}

export async function scrapeProduct(rawUrl: string): Promise<ScrapedProduct> {
  const url = await unshortenUrl(rawUrl);
  const platform = detectPlatform(url);
  let bestResult: ScrapedProduct | null = null;

  // --- MERCADO LIVRE API (SEM RESTRIÇÃO DE CORS E ALTA PRECISÃO) ---
  if (platform === 'Mercado Livre') {
    const widMatch = url.match(/wid=(MLB[0-9]+)/i);
    const generalMatch = url.match(/(MLB-?[0-9]{8,14})/i);
    const pMatch = url.match(/\/p\/(MLB[0-9]+)/i);

    const mlIds: string[] = [];
    if (widMatch) mlIds.push(widMatch[1].replace('-', ''));
    if (generalMatch) mlIds.push(generalMatch[1].replace('-', ''));
    if (pMatch) mlIds.push(pMatch[1].replace('-', ''));

    const uniqueIds = Array.from(new Set(mlIds));

    for (const mlId of uniqueIds) {
      try {
        let title = '';
        let priceTo: number | undefined;
        let priceFrom: number | undefined;
        let imageUrl: string | undefined;

        const itemRes = await fetch(`https://api.mercadolibre.com/items/${mlId}`);
        if (itemRes.ok) {
          const itemData = await itemRes.json();
          title = itemData.title || itemData.name || '';
          priceTo = itemData.price || itemData.base_price;
          priceFrom = itemData.original_price;

          if (itemData.pictures && itemData.pictures.length > 0) {
            imageUrl = itemData.pictures[0].secure_url || itemData.pictures[0].url;
          }
          if (!imageUrl) imageUrl = itemData.thumbnail;

          if (!priceTo && Array.isArray(itemData.variations) && itemData.variations.length > 0) {
            priceTo = itemData.variations[0].price;
            priceFrom = itemData.variations[0].original_price;
          }
        }

        if (!title || !priceTo) {
          const prodRes = await fetch(`https://api.mercadolibre.com/products/${mlId}`);
          if (prodRes.ok) {
            const prodData = await prodRes.json();
            title = title || prodData.name || prodData.title || '';
            priceTo = priceTo || prodData.buy_box_winner?.price || prodData.price;
            priceFrom = priceFrom || prodData.buy_box_winner?.original_price || prodData.original_price;

            if (!imageUrl && prodData.pictures && prodData.pictures.length > 0) {
              imageUrl = prodData.pictures[0].secure_url || prodData.pictures[0].url;
            }
          }
        }

        if (imageUrl) {
          if (imageUrl.startsWith('http:')) imageUrl = imageUrl.replace('http:', 'https:');
          if (imageUrl.includes('-I.jpg')) imageUrl = imageUrl.replace('-I.jpg', '-F.jpg');
          if (imageUrl.includes('-I.png')) imageUrl = imageUrl.replace('-I.png', '-F.png');
        }

        if (title) {
          const result: ScrapedProduct = {
            title: title.trim(),
            priceTo: priceTo ? Number(priceTo) : undefined,
            priceFrom: priceFrom ? Number(priceFrom) : undefined,
            discountPct: extractDiscount(priceFrom, priceTo),
            imageUrl: imageUrl || undefined,
            platform: 'Mercado Livre',
            affiliateLink: rawUrl,
          };

          if (result.priceTo) {
            return result;
          }
          if (!bestResult) {
            bestResult = result;
          }
        }
      } catch (e) {
        console.warn('Erro ao consultar Mercado Livre API:', e);
      }
    }

    if (bestResult && bestResult.priceTo) {
      return bestResult;
    }
  }

  // --- MICROLINK API FALLBACK (TODAS AS DEMAIS LOJAS / MERCADO LIVRE EXTRA) ---
  try {
    const microRes = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
    if (microRes.ok) {
      const microData = await microRes.json();
      const meta = microData?.data;
      const metaTitle = meta?.title?.replace(/\s*\|\s*(Shopee|Amazon|Magalu|Mercado Livre).*/i, '').trim();

      if (metaTitle) {
        const img = meta.image?.url || meta.logo?.url;
        const cleanImg = img?.includes('logo') || img?.includes('handshake') ? undefined : img;
        return {
          title: bestResult?.title || metaTitle,
          imageUrl: bestResult?.imageUrl || cleanImg,
          priceTo: meta.price?.amount ? Number(meta.price.amount) : undefined,
          platform,
          affiliateLink: rawUrl,
        };
      }
    }
  } catch (e) {
    console.warn('Erro ao consultar Microlink Scraper:', e);
  }

  const slugTitle = extractTitleFromUrlSlug(url);

  return {
    title: bestResult?.title || slugTitle || `Produto do link (${platform})`,
    platform,
    imageUrl: bestResult?.imageUrl || undefined,
    affiliateLink: rawUrl,
  };
}
