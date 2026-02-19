
import React from 'react';
import { ICONS } from '../constants';
import { UserRole } from '../types';

interface BottomTabsProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  cartCount: number;
  userRole: UserRole;
}

const BottomTabs: React.FC<BottomTabsProps> = ({ activeTab, setActiveTab, cartCount, userRole }) => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/90 backdrop-blur-lg border border-gray-100 rounded-[2rem] flex justify-around py-3 px-4 z-40 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
      <TabButton 
        active={activeTab === 'catalog'} 
        onClick={() => setActiveTab('catalog')}
        icon={ICONS.Home}
        label="Início"
      />
      
      <TabButton 
        active={activeTab === 'cart'} 
        onClick={() => setActiveTab('cart')}
        icon={ICONS.Cart}
        label="Pedido"
        badge={cartCount > 0 ? cartCount : undefined}
      />

      <TabButton 
        active={activeTab === 'history'} 
        onClick={() => setActiveTab('history')}
        icon={ICONS.Requests}
        label="Histórico"
      />

      {userRole === UserRole.ADMIN && (
        <>
          <TabButton 
            active={activeTab === 'admin'} 
            onClick={() => setActiveTab('admin')}
            icon={ICONS.Package}
            label="Estoque"
          />
          <TabButton 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
            icon={ICONS.User}
            label="Equipe"
          />
        </>
      )}
    </nav>
  );
};

const TabButton: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
  badge?: number;
}> = ({ active, onClick, icon, label, badge }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center flex-1 transition-all relative py-1 ${active ? 'text-ativa-400' : 'text-gray-300'}`}
  >
    <div className={`transition-all ${active ? 'scale-110' : 'scale-100'}`}>
      {icon}
      {badge && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-black px-1 rounded-full min-w-[14px] h-3.5 flex items-center justify-center border-2 border-white shadow-sm">
          {badge}
        </span>
      )}
    </div>
    <span className={`text-[8px] mt-1 font-black uppercase tracking-tighter italic ${active ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{label}</span>
    {active && <div className="absolute -bottom-1 w-1 h-1 bg-ativa-400 rounded-full"></div>}
  </button>
);

export default BottomTabs;
