
import React from 'react';
import { User, UserRole } from '../types';
import { ICONS, Logo } from '../constants';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-5 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-ativa-400 p-1.5 rounded-xl text-white shadow-md shadow-ativa-100 flex items-center justify-center">
          <Logo size={24} />
        </div>
        <div>
          <h1 className="text-xs font-black text-gray-900 leading-none italic uppercase tracking-tighter">Galinheiro</h1>
          <p className="text-[8px] text-ativa-400 font-bold tracking-widest uppercase mt-0.5">Interno</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[11px] font-bold text-gray-800 leading-none">{user.name.split(' ')[0]}</p>
          <span className={`text-[8px] font-black uppercase tracking-tighter ${
            user.role === UserRole.ADMIN ? 'text-ativa-400' : 'text-gray-400'
          }`}>
            {user.role}
          </span>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 text-gray-200 hover:text-red-400 transition-colors"
        >
          {ICONS.Logout}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
