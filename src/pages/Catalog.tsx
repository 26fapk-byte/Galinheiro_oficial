
import React, { useState, useMemo } from 'react';
import { Product, CartItem, ProductStatus } from '../types';
import { ICONS, INITIAL_CATEGORIES } from '../constants';
import ProductPlaceholder from '../components/ProductPlaceholder';
import { Plus, Minus } from 'lucide-react';

interface CatalogProps {
  products: Product[];
  onAddToCart: (p: Product, q: number) => void;
  cartItems: CartItem[];
}

const Catalog: React.FC<CatalogProps> = ({ products, onAddToCart, cartItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tudo');

  const filtered = useMemo(() => products.filter(p => {
    const match = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.internalCode?.includes(searchTerm);
    return match && (activeCategory === 'Tudo' || p.category === activeCategory) && p.status === ProductStatus.ACTIVE;
  }), [products, searchTerm, activeCategory]);

  const getCartQuantity = (productId: string): number => {
    const item = cartItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in">
      <div className="space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">{ICONS.Search}</span>
          <input
            type="text"
            placeholder="Buscar no estoque..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-50 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-ativa-400/20 transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {['Tudo', ...INITIAL_CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${activeCategory === cat
                  ? 'bg-ativa-400 border-ativa-400 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-400 border-gray-100 hover:border-ativa-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-2 gap-4 pb-4">
        {filtered.map(p => {
          const factor = p.conversionFactor || 1;
          const unitsAvailable = Math.floor(p.stock / factor);
          const cartQuantity = getCartQuantity(p.id);
          const inCart = cartQuantity > 0;
          const isLowStock = unitsAvailable <= 3 && unitsAvailable > 0;
          const isOutOfStock = unitsAvailable <= 0;

          return (
            <div
              key={p.id}
              className={`
                bg-white rounded-3xl overflow-hidden border shadow-sm
                transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                ${inCart ? 'border-green-400 ring-2 ring-green-100' : 'border-gray-100'}
                ${isOutOfStock ? 'opacity-60' : ''}
              `}
            >
              {/* Imagem do Produto */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden group">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <ProductPlaceholder category={p.category} size="large" />
                )}

                {/* Badge de Quantidade no Carrinho */}
                {inCart && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1.5 rounded-full shadow-lg animate-in zoom-in flex items-center gap-1">
                    <span className="text-xs font-black">{cartQuantity}</span>
                    <span className="text-[8px] font-medium uppercase">{p.unit}</span>
                  </div>
                )}

                {isLowStock && !isOutOfStock && !inCart && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-[8px] font-black uppercase shadow-lg">
                    Baixo
                  </div>
                )}

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-black text-sm uppercase tracking-wider">Esgotado</span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Informações do Produto */}
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                    {p.name}
                  </h3>

                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-[8px] font-black bg-ativa-400 text-white px-2 py-0.5 rounded-full uppercase">
                      ID #{p.internalCode || p.sku}
                    </span>
                    {p.conversionFactor && p.conversionFactor > 1 && (
                      <span className="text-[8px] font-black text-ativa-400 bg-ativa-50 px-2 py-0.5 rounded-full uppercase italic">
                        {p.conversionFactor}L
                      </span>
                    )}
                  </div>
                </div>

                {/* Estoque e Controles */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-lg font-black text-ativa-500 leading-none">
                      {unitsAvailable}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase">
                      {p.unit} disponível
                    </div>
                  </div>

                  {/* Botões de Quantidade */}
                  {inCart ? (
                    <div className="flex items-center gap-1 bg-green-50 rounded-2xl p-1">
                      <button
                        onClick={() => onAddToCart(p, -1)}
                        className="p-2 bg-white text-green-600 rounded-xl hover:bg-green-100 active:scale-90 transition-all shadow-sm"
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <div className="px-3 min-w-[2rem] text-center">
                        <span className="text-lg font-black text-green-600">{cartQuantity}</span>
                      </div>
                      <button
                        onClick={() => onAddToCart(p, 1)}
                        disabled={cartQuantity >= unitsAvailable}
                        className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 active:scale-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddToCart(p, 1)}
                      disabled={isOutOfStock}
                      className={`
                        p-3.5 rounded-2xl transition-all shadow-lg
                        ${isOutOfStock
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-ativa-400 text-white hover:bg-ativa-500 active:scale-90'
                        }
                      `}
                    >
                      {ICONS.Plus}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estado Vazio */}
      {filtered.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            {ICONS.Package}
          </div>
          <h3 className="text-lg font-bold text-gray-400 mb-2">Nenhum produto encontrado</h3>
          <p className="text-sm text-gray-400">
            {searchTerm ? 'Tente buscar com outros termos' : 'Nenhum produto disponível nesta categoria'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Catalog;
