
import React, { useState } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { ICONS } from '../constants';

interface UserManagementProps {
  users: User[];
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdateUser, onDeleteUser }) => {
  const [showPass, setShowPass] = useState<Record<string, boolean>>({});

  return (
    <div className="p-5 space-y-6 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-ativa-400 font-black italic text-xl uppercase leading-none">Equipe Ativa</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Controle de Acessos</p>
        </div>
      </div>

      <div className="space-y-4">
        {users.map(u => (
          <div key={u.id} className="bg-white p-5 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${u.role === UserRole.ADMIN ? 'bg-ativa-400 text-white' : 'bg-ativa-50 text-ativa-400'}`}>
                  {u.role === UserRole.ADMIN ? ICONS.Admin : ICONS.User}
                </div>
                <div>
                  <h4 className="text-sm font-bold">@{u.username}</h4>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{u.name}</p>
                </div>
              </div>
              <select 
                className={`text-[8px] font-black uppercase px-2 py-1 rounded-full outline-none border-none cursor-pointer ${u.status === UserStatus.ACTIVE ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}
                value={u.status}
                onChange={e => onUpdateUser(u.id, { status: e.target.value as UserStatus })}
              >
                <option value={UserStatus.ACTIVE}>ATIVO</option>
                <option value={UserStatus.PENDING}>PENDENTE</option>
                <option value={UserStatus.INACTIVE}>BLOQUEADO</option>
              </select>
            </div>

            <div className="pt-3 border-t border-gray-50 space-y-2">
              <label className="text-[9px] font-black text-gray-300 uppercase ml-1">Senha de Acesso</label>
              <div className="relative">
                <input 
                  type={showPass[u.id] ? "text" : "password"}
                  className="w-full bg-gray-50 text-xs font-bold py-3 px-4 rounded-xl outline-none"
                  value={u.password}
                  onChange={e => onUpdateUser(u.id, { password: e.target.value })}
                />
                <button 
                  onClick={() => setShowPass(p => ({ ...p, [u.id]: !p[u.id] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-ativa-400 uppercase"
                >
                  {showPass[u.id] ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <select 
                className="text-[10px] font-black bg-gray-50 px-3 py-1.5 rounded-lg outline-none"
                value={u.role}
                onChange={e => onUpdateUser(u.id, { role: e.target.value as UserRole })}
              >
                <option value={UserRole.USER}>COLABORADOR</option>
                <option value={UserRole.ADMIN}>ADMINISTRADOR</option>
              </select>
              <button onClick={() => confirm('Remover?') && onDeleteUser(u.id)} className="text-[10px] font-black text-red-200 hover:text-red-400 transition-colors uppercase">Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
