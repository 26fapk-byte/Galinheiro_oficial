
import React, { useState } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { ICONS, Logo } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, users }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegisterMode) {
      if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return setError('Usuário já cadastrado.');
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        username: username.toLowerCase(),
        password,
        role: UserRole.USER,
        status: UserStatus.PENDING
      };
      onRegister(newUser);
      setSuccess('Solicitação enviada! Aguarde a ativação.');
      setIsRegisterMode(false);
      resetFields();
    } else {
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
      if (user) {
        if (user.status !== UserStatus.ACTIVE) return setError('Acesso pendente de aprovação.');
        onLogin(user);
      } else {
        setError('Usuário ou senha incorretos.');
      }
    }
  };

  const resetFields = () => {
    setUsername('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Header Teal - Gradiente Fixo */}
      <div className="bg-gradient-to-br from-ativa-400 to-ativa-600 pt-12 pb-24 px-6 flex flex-col items-center text-center relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-8 -mb-8 blur-2xl"></div>

        <div className="relative z-10 space-y-3 flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-lg p-3 rounded-[2rem] border border-white/20 shadow-2xl flex items-center justify-center">
            <Logo size={48} className="text-white" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-white font-black text-3xl leading-none uppercase italic tracking-tighter">Galinheiro</h1>
            <p className="text-white/60 text-[9px] font-bold uppercase tracking-[0.4em]">Ativa Hospitalar</p>
          </div>
        </div>
      </div>
      
      {/* Form Card */}
      <div className="flex-1 px-6 -mt-12 relative z-20 pb-12">
        <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-8 flex flex-col">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-[1.4rem] font-black text-gray-800 uppercase italic tracking-tight">
              {isRegisterMode ? 'Novo Cadastro' : 'Entrar no Sistema'}
            </h2>
            <div className="w-10 h-1.5 bg-ativa-400/10 mt-3 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-ativa-400 rounded-full"></div>
            </div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-4">Gestão de Suprimentos</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-[10px] font-black p-4 rounded-2xl border border-red-100 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                {ICONS.Error}
                <span className="uppercase">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 text-[10px] font-black p-4 rounded-2xl border border-green-100 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                {ICONS.Success}
                <span className="uppercase">{success}</span>
              </div>
            )}
            
            <div className="space-y-4">
              {isRegisterMode && (
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Nome Completo</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-ativa-400 transition-colors">{ICONS.User}</span>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-ativa-50 focus:border-ativa-400 outline-none transition-all placeholder:text-gray-300 font-medium"
                      placeholder="Identificação"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Usuário de Login</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400/50 group-focus-within:text-ativa-400 font-black text-sm transition-colors">@</span>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-ativa-50 focus:border-ativa-400 outline-none transition-all placeholder:text-gray-300 font-medium"
                    placeholder="Seu identificador"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Senha de Acesso</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-ativa-400 transition-colors">{ICONS.Settings}</span>
                  <input 
                    type="password" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-ativa-50 focus:border-ativa-400 outline-none transition-all placeholder:text-gray-300 font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full bg-ativa-400 hover:bg-ativa-500 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-ativa-100 transition-all flex items-center justify-center gap-3 active:scale-[0.96] uppercase tracking-[0.1em] italic text-sm"
              >
                {isRegisterMode ? 'Confirmar Cadastro' : 'Acessar Galinheiro'}
                <div className="bg-white/20 p-1 rounded-full">{ICONS.ArrowRight}</div>
              </button>
            </div>

            <button 
              type="button"
              onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); setSuccess(''); }}
              className="w-full text-gray-400 text-[10px] font-black py-2 hover:text-ativa-400 transition-all uppercase tracking-[0.2em] text-center"
            >
              {isRegisterMode ? 'Já possuo login de acesso →' : 'Não tem conta? Solicite agora'}
            </button>
          </form>
        </div>

        <div className="mt-12 flex justify-center opacity-10">
           <div className="flex items-center gap-4">
             <div className="w-12 h-[1px] bg-gray-900"></div>
             <p className="text-[9px] font-black text-gray-900 uppercase tracking-[0.5em]">Ativa 2.5</p>
             <div className="w-12 h-[1px] bg-gray-900"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
