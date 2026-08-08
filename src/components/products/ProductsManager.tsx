import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Product } from '../../types';
import { Package, Plus, Trash2, ExternalLink, Sparkles, Search, Filter } from 'lucide-react';

export const ProductsManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, generateAutoCampaignForProduct, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    photoUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80',
    description: '',
    category: 'Cozinha & Lar',
    price: 49.90,
    originalPrice: 89.90,
    affiliateLink: '',
    marketplace: 'Shopee' as const,
    commissionPercentage: 15,
    brand: '',
    features: ['Recarregável USB', 'Lâmina Inox'],
    benefits: ['Economiza tempo na cozinha'],
    viralScore: 9.0,
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'todos' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      photoUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80',
      description: '',
      category: 'Cozinha & Lar',
      price: 49.90,
      originalPrice: 89.90,
      affiliateLink: 'https://shope.ee/exemplo-afiliado',
      marketplace: 'Shopee',
      commissionPercentage: 15,
      brand: 'AchadosHome',
      features: ['Prático', 'Resistente'],
      benefits: ['Facilita a rotina'],
      viralScore: 9.0,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.affiliateLink.trim()) {
      addToast('Preencha o nome e o link de afiliado!', 'warning');
      return;
    }

    if (editingProduct) {
      updateProduct((editingProduct as Product).id, formData);
    } else {
      addProduct(formData);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Banco de Produtos de Afiliado</h2>
          </div>
          <p className="text-xs text-slate-400">
            Cadastre os produtos que você divulga com seus links de comissão e comissão %
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome ou descrição..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
          >
            <option value="todos">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 backdrop-blur-sm space-y-4 flex flex-col justify-between transition-all group"
          >
            <div className="space-y-3">
              <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800">
                <img src={prod.photoUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  🔥 Viral Score {prod.viralScore}
                </span>
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow">
                  {prod.marketplace}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white line-clamp-1">{prod.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{prod.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Preço de Afiliado</span>
                  <span className="font-black text-emerald-400 text-sm">R${prod.price.toFixed(2)}</span>
                  {prod.originalPrice && (
                    <span className="text-[10px] text-slate-500 line-through ml-1.5">
                      R${prod.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Comissão</span>
                  <span className="font-bold text-indigo-300">{prod.commissionPercentage}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => generateAutoCampaignForProduct(prod.id)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Criar Campanha 360° com IA</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={prod.affiliateLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Link de Afiliado</span>
                </a>

                <button
                  onClick={() => deleteProduct(prod.id)}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Cadastrar Novo Produto de Afiliado</h3>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="Ex: Mini Processador Elétrico"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Marketplace</label>
                  <select
                    value={formData.marketplace}
                    onChange={(e) => setFormData({ ...formData, marketplace: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Shopee">Shopee</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Hotmart">Hotmart</option>
                    <option value="Kiwify">Kiwify</option>
                    <option value="Mercado Livre">Mercado Livre</option>
                    <option value="Magalu">Magalu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Categoria</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">De (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Comissão %</label>
                  <input
                    type="number"
                    value={formData.commissionPercentage}
                    onChange={(e) => setFormData({ ...formData, commissionPercentage: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Link de Afiliado</label>
                <input
                  type="text"
                  value={formData.affiliateLink}
                  onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="https://shope.ee/..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">URL da Imagem</label>
                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Descrição do Produto</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none h-16"
                  placeholder="Principais detalhes para a IA usar nas legendas..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
