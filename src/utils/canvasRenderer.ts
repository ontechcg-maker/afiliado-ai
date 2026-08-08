import type { Product, BrandKit } from '../types';

export interface SlideRenderOptions {
  title: string;
  body: string;
  slideNumber: number;
  totalSlides: number;
  aspectRatio?: '1:1' | '9:16';
}

/**
 * Carrega uma imagem de forma assíncrona (com suporte a CORS habilitado)
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback sem crossOrigin se houver falha de CORS
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = (e) => reject(e);
      fallbackImg.src = src;
    };
    img.src = src;
  });
}

/**
 * Renderiza um slide visualmente atraente do produto aplicando o Brand Kit do usuário
 */
export async function renderBrandedSlide(
  product: Product,
  brandKit: BrandKit,
  options: SlideRenderOptions
): Promise<string> {
  const isVertical = options.aspectRatio === '9:16';
  const width = 1080;
  const height = isVertical ? 1920 : 1080;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Não foi possível inicializar o contexto Canvas');

  // 1. FUNDO COM GRADIENTE ELEGANTE
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  const primary = brandKit.primaryColor || '#6366f1';
  const bgDark = brandKit.backgroundColor || '#0f172a';

  bgGrad.addColorStop(0, bgDark);
  bgGrad.addColorStop(0.5, '#1e1b4b');
  bgGrad.addColorStop(1, primary);

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. DESENHO DA FOTO DO PRODUTO
  let productImg: HTMLImageElement | null = null;
  try {
    if (product.photoUrl) {
      productImg = await loadImage(product.photoUrl);
    }
  } catch (e) {
    console.warn('Não foi possível carregar a imagem do produto para o canvas:', e);
  }

  const padding = 60;
  const cardY = isVertical ? 350 : 180;
  const cardHeight = isVertical ? 800 : 540;

  if (productImg) {
    // Sombra Projetada para o Card da Imagem
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;

    // Fundo do Card
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(padding, cardY, width - padding * 2, cardHeight, 32);
    ctx.fill();
    ctx.restore();

    // Desenhar Imagem Centralizada
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(padding, cardY, width - padding * 2, cardHeight, 32);
    ctx.clip();

    const scale = Math.min((width - padding * 2) / productImg.width, cardHeight / productImg.height);
    const imgW = productImg.width * scale;
    const imgH = productImg.height * scale;
    const imgX = (width - imgW) / 2;
    const imgY = cardY + (cardHeight - imgH) / 2;

    ctx.drawImage(productImg, imgX, imgY, imgW, imgH);
    ctx.restore();
  }

  // 3. BADGE DE PREÇO & DESCONTO
  const badgeY = cardY + cardHeight - 30;
  ctx.save();

  // Selo de Preço (DE / POR)
  ctx.fillStyle = '#10b981'; // Verde Esmeralda
  ctx.beginPath();
  ctx.roundRect(padding + 20, badgeY, 280, 75, 20);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(`R$ ${product.price.toFixed(2)}`, padding + 40, badgeY + 48);

  // Badge de Desconto (Se houver Preço Original)
  if (product.originalPrice && product.originalPrice > product.price) {
    const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    ctx.fillStyle = '#ef4444'; // Vermelho Destaque
    ctx.beginPath();
    ctx.roundRect(padding + 315, badgeY, 180, 75, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`-${discountPct}% OFF`, padding + 335, badgeY + 48);
  }
  ctx.restore();

  // 4. TEXTO DO SLIDE (TÍTULO E CORPO)
  const textY = cardY + cardHeight + 80;

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';

  // Quebra de linha simples para o título
  const titleText = options.title;
  ctx.fillText(titleText.length > 35 ? titleText.substring(0, 32) + '...' : titleText, padding, textY);

  ctx.fillStyle = '#cbd5e1'; // Slate-300
  ctx.font = '30px sans-serif';
  const bodyText = options.body;
  ctx.fillText(bodyText.length > 60 ? bodyText.substring(0, 57) + '...' : bodyText, padding, textY + 55);

  // 5. MARCA D'ÁGUA / LOGO DO BRAND KIT
  if (brandKit.watermarkEnabled) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 26px sans-serif';

    const wmText = `@${brandKit.brandName || 'afiliado.pro'}`;
    const wmWidth = ctx.measureText(wmText).width + 30;

    let wmX = width - wmWidth - 40;
    let wmY = 90;

    if (brandKit.watermarkPosition === 'top_left') wmX = 40;
    if (brandKit.watermarkPosition === 'bottom_left') { wmX = 40; wmY = height - 60; }
    if (brandKit.watermarkPosition === 'bottom_right') { wmX = width - wmWidth - 40; wmY = height - 60; }

    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.beginPath();
    ctx.roundRect(wmX, wmY - 35, wmWidth, 50, 16);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(wmText, wmX + 15, wmY);
    ctx.restore();
  }

  // 6. NÚMERO DO SLIDE (PAGINAÇÃO 1/5)
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`${options.slideNumber} / ${options.totalSlides}`, width - 120, height - 40);
  ctx.restore();

  // Retorna a imagem codificada em Base64 Data URL
  return canvas.toDataURL('image/png');
}
