
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, UserStatus, Product, CartItem, Requisition, StockMovement } from './types';
import { WHATSAPP_NUMBER } from './constants';
import { ApiService } from './services/api';

import Login from './pages/Login';
import Catalog from './pages/Catalog';
import CartView from './pages/CartView';
import AdminPanel from './pages/AdminPanel';
import HistoryView from './pages/HistoryView';
import UserManagement from './pages/UserManagement';
import Navbar from './components/Navbar';
import BottomTabs from './components/BottomTabs';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'cart' | 'admin' | 'history' | 'users'>('catalog');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const init = async () => {
      const [p, u, r, m] = await Promise.all([
        ApiService.getProducts(),
        ApiService.getUsers(),
        ApiService.getRequisitions(),
        ApiService.getMovements()
      ]);

      setProducts(p);
      setRequisitions(r);
      setMovements(m);

      if (u.length > 0) {
        setUsers(u);
      } else {
        const initialAdmin = { id: 'u1', name: 'Administrador', username: 'admin', password: '123', role: UserRole.ADMIN, status: UserStatus.ACTIVE };
        setUsers([initialAdmin]);
        await ApiService.saveUsers([initialAdmin]);
      }

      const savedUser = localStorage.getItem('sm_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    };
    init();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('sm_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sm_user');
    setCart([]);
    setActiveTab('catalog');
  };

  const updateProductList = async (newList: Product[]) => {
    setProducts(newList);
    await ApiService.saveProducts(newList);
  };

  const finalizeRequisition = async () => {
    if (!currentUser || cart.length === 0) return;
    setIsProcessing(true);

    try {
      const newReq: Requisition = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        userId: currentUser.id,
        userName: currentUser.name,
        timestamp: new Date().toISOString(),
        items: cart.map(i => ({ productId: i.productId, productName: i.product.name, quantity: i.quantity, unit: i.product.unit }))
      };

      const newMovements: StockMovement[] = cart.map(i => ({
        id: Math.random().toString(36).substr(2, 9),
        productId: i.productId,
        productName: i.product.name,
        type: 'OUT',
        quantity: i.quantity,
        userId: currentUser.id,
        userName: currentUser.name,
        timestamp: new Date().toISOString()
      }));

      const updatedProducts = products.map(p => {
        const item = cart.find(c => c.productId === p.id);
        if (!item) return p;

        // Se houver fator de conversão (ex: 5L por galão), remove 1 un * 5L
        const factor = p.conversionFactor || 1;
        const totalToRemove = item.quantity * factor;

        return {
          ...p,
          stock: p.stock - totalToRemove,
          updatedAt: new Date().toISOString()
        };
      });

      await Promise.all([
        ApiService.saveRequisition(newReq),
        ApiService.saveMovements(newMovements),
        updateProductList(updatedProducts)
      ]);

      setRequisitions(prev => [newReq, ...prev]);
      setMovements(prev => [...newMovements, ...prev]);

      const message = `*📋 NOVA REQUISIÇÃO ATIVA*\n👤 *SOLICITANTE:* ${currentUser.name}\n🆔 *PROTOCOLO:* #${newReq.id}\n----------------------------\n\n` +
        cart.map(i => `🔹 ${i.product.name}: *${i.quantity} ${i.product.unit.toUpperCase()}*`).join('\n') +
        `\n\n_Enviado via App Galinheiro_`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      setCart([]);
      setActiveTab('catalog');
    } catch (e) {
      alert("Falha no checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentUser) return <Login onLogin={handleLogin} onRegister={async (u) => { const n = [...users, u]; setUsers(n); await ApiService.saveUsers(n); }} users={users} />;

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden border-x border-gray-100">
      <Navbar user={currentUser} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'catalog' && (
          <Catalog
            products={products}
            cartItems={cart}
            onAddToCart={(p, q) => setCart(prev => {
              const ex = prev.find(i => i.productId === p.id);
              if (ex) {
                const newQuantity = ex.quantity + q;
                // Se quantidade ficar zero ou negativa, remove do carrinho
                if (newQuantity <= 0) {
                  return prev.filter(i => i.productId !== p.id);
                }
                // Senão, atualiza a quantidade
                return prev.map(i => i.productId === p.id ? { ...i, quantity: newQuantity } : i);
              }
              // Se não existe e está adicionando (q > 0), adiciona ao carrinho
              if (q > 0) {
                return [...prev, { productId: p.id, product: p, quantity: q }];
              }
              return prev;
            })}
          />
        )}
        {activeTab === 'cart' && <CartView cart={cart} onRemove={id => setCart(cart.filter(i => i.productId !== id))} onFinalize={finalizeRequisition} onClear={() => setCart([])} currentUser={currentUser} isProcessing={isProcessing} />}
        {activeTab === 'admin' && <AdminPanel products={products} onAdd={p => updateProductList([...products, { ...p, id: Math.random().toString(36).substr(2, 9), updatedAt: new Date().toISOString() }])} onUpdate={(id, up) => updateProductList(products.map(p => p.id === id ? { ...p, ...up, updatedAt: new Date().toISOString() } : p))} onDelete={id => updateProductList(products.filter(p => p.id !== id))} />}
        {activeTab === 'history' && <HistoryView requisitions={currentUser.role === UserRole.ADMIN ? requisitions : requisitions.filter(r => r.userId === currentUser.id)} movements={movements} userRole={currentUser.role} />}
        {activeTab === 'users' && <UserManagement users={users} onUpdateUser={async (id, up) => { const n = users.map(u => u.id === id ? { ...u, ...up } : u); setUsers(n); await ApiService.saveUsers(n); }} onDeleteUser={async id => { const n = users.filter(u => u.id !== id); setUsers(n); await ApiService.saveUsers(n); }} />}
      </main>
      <BottomTabs activeTab={activeTab} setActiveTab={setActiveTab} cartCount={cart.length} userRole={currentUser.role} />
    </div>
  );
};

export default App;
