
import React, { useState } from 'react';
import { Product, ProductUnit, ProductStatus } from '../types';
import { ICONS, INITIAL_CATEGORIES, UNITS } from '../constants';
import ImageUpload from '../components/ImageUpload';
import { StorageService } from '../services/storage';

interface AdminPanelProps {
  products: Product[];
  onAdd: (p: Omit<Product, 'id' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onDelete: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ sku: '', internalCode: '', name: '', description: '', category: INITIAL_CATEGORIES[0], stock: 0, unit: ProductUnit.UN, conversionFactor: 1, status: ProductStatus.ACTIVE, imageUrl: '' });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleEdit = (p: Product) => {
    setEditing(p);
    setFormData({ ...p, internalCode: p.internalCode || '', conversionFactor: p.conversionFactor || 1, imageUrl: p.imageUrl || '' });
    setSelectedImage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = formData.imageUrl;

      // Se há uma nova imagem selecionada, fazer upload
      if (selectedImage) {
        // Gerar ID temporário se for novo produto
        const productId = editing?.id || Math.random().toString(36).substr(2, 9);

        // Comprimir imagem
        const compressedImage = await StorageService.compressImage(selectedImage, 800, 800);

        // Upload
        const uploadedUrl = await StorageService.uploadProductImage(compressedImage, productId);

        if (uploadedUrl) {
          // Se está editando e tinha imagem antiga, deletar
          if (editing?.imageUrl && editing.imageUrl !== uploadedUrl) {
            await StorageService.deleteProductImage(editing.imageUrl);
          }
          imageUrl = uploadedUrl;
        }
      }

      const data = {
        ...formData,
        imageUrl,
        conversionFactor: formData.conversionFactor > 0 ? formData.conversionFactor : 1
      };

      editing ? onUpdate(editing.id, data) : onAdd(data);

      setIsModalOpen(false);
      setEditing(null);
      setSelectedImage(null);
      setFormData({ sku: '', internalCode: '', name: '', description: '', category: INITIAL_CATEGORIES[0], stock: 0, unit: ProductUnit.UN, conversionFactor: 1, status: ProductStatus.ACTIVE, imageUrl: '' });
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setFormData({ ...formData, imageUrl: '' });
  };

  return (
    <div className="p-5 space-y-4 animate-in fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-black italic text-ativa-400 uppercase tracking-tighter">Estoque Central</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Controle de Suprimentos</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setSelectedImage(null);
            setFormData({ sku: '', internalCode: '', name: '', description: '', category: INITIAL_CATEGORIES[0], stock: 0, unit: ProductUnit.UN, conversionFactor: 1, status: ProductStatus.ACTIVE, imageUrl: '' });
            setIsModalOpen(true);
          }}
          className="bg-ativa-400 text-white p-4 rounded-2xl shadow-xl shadow-ativa-100 active:scale-90 transition-all"
        >
          {ICONS.Plus}
        </button>
      </div>

      <div className="space-y-3">
        {products.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-[1.5rem] border border-gray-50 shadow-sm flex justify-between items-center group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-ativa-50 rounded-2xl flex items-center justify-center text-ativa-400 overflow-hidden flex-shrink-0 relative">
                {p.imageUrl ? (
                  <>
                    <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.name} />
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white" title="Com foto" />
                  </>
                ) : (
                  ICONS.Package
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold truncate text-gray-800">{p.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-gray-400 font-black uppercase">{p.category}</span>
                  <span className="text-[9px] text-ativa-400 font-black uppercase italic tracking-tighter">
                    {Math.floor(p.stock / (p.conversionFactor || 1))} {p.unit} ({p.stock}L Total)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleEdit(p)} className="p-2.5 text-ativa-400 hover:bg-ativa-50 rounded-xl transition-colors">{ICONS.Edit}</button>
              <button onClick={() => confirm('Deseja excluir este item?') && onDelete(p.id)} className="p-2.5 text-gray-200 hover:text-red-400 rounded-xl transition-colors">{ICONS.Trash}</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto space-y-5"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-black text-ativa-400 italic uppercase leading-none">{editing ? 'Editar' : 'Novo'} Item</h3>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Configuração de Volume/Unidade</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400">✕</button>
            </div>

            <div className="space-y-4 pt-2">
              {/* Upload de Imagem */}
              <ImageUpload
                currentImage={formData.imageUrl}
                onImageSelect={setSelectedImage}
                onImageRemove={handleImageRemove}
              />

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Comercial</label>
                <input type="text" placeholder="Ex: Galão Hipoclorito" required className="w-full p-4 bg-gray-50 border border-transparent focus:border-ativa-100 focus:bg-white rounded-2xl text-sm outline-none transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">SKU</label>
                  <input type="text" placeholder="SKU123" required className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm outline-none" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Código Interno</label>
                  <input type="text" placeholder="Opcional" className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm outline-none" value={formData.internalCode} onChange={e => setFormData({ ...formData, internalCode: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição</label>
                <textarea placeholder="Descrição do produto..." required className="w-full p-4 bg-gray-50 border border-transparent focus:border-ativa-100 focus:bg-white rounded-2xl text-sm outline-none transition-all resize-none" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
                  <select className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    {INITIAL_CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-ativa-400 uppercase tracking-widest ml-1 italic">Capacidade (Ex: 5L p/ Un)</label>
                  <input type="number" step="0.1" className="w-full p-4 bg-ativa-50/30 border border-ativa-100 rounded-2xl text-sm outline-none focus:bg-white" placeholder="1.0" value={formData.conversionFactor} onChange={e => setFormData({ ...formData, conversionFactor: parseFloat(e.target.value) || 1 })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Volume Total (Ex: 15L)</label>
                  <input type="number" placeholder="0" required className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm outline-none" value={formData.stock} onChange={e => setFormData({ ...formData, stock: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Unidade de Entrega</label>
                  <select className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm outline-none" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value as ProductUnit })}>
                    {UNITS.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[10px] font-medium text-gray-500 text-center uppercase">
                  O sistema exibirá <span className="text-ativa-500 font-black">{Math.floor(formData.stock / (formData.conversionFactor || 1))} {formData.unit}</span> disponíveis no catálogo.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-ativa-400 text-white font-black italic py-5 rounded-2xl shadow-xl shadow-ativa-100 uppercase tracking-widest active:scale-95 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Salvando...' : editing ? 'Confirmar Edição' : 'Cadastrar no Sistema'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
