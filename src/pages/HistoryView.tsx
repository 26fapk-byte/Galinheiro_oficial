
import React, { useState } from 'react';
import { Requisition, StockMovement, UserRole } from '../types';
import { ICONS } from '../constants';

interface HistoryViewProps {
  requisitions: Requisition[];
  movements: StockMovement[];
  userRole: UserRole;
}

const HistoryView: React.FC<HistoryViewProps> = ({ requisitions, movements, userRole }) => {
  const [activeTab, setActiveTab] = useState<'reqs' | 'movements'>(userRole === UserRole.ADMIN ? 'reqs' : 'reqs');

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-ativa-400 font-black italic text-2xl uppercase leading-none">Atividades</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Histórico de Registros</p>
          </div>
          <div className="bg-ativa-50 p-2 rounded-2xl text-ativa-400">
            {ICONS.History}
          </div>
        </div>
        
        {userRole === UserRole.ADMIN && (
          <div className="flex bg-gray-100 p-1.5 rounded-[1.5rem] shadow-inner">
            <button 
              onClick={() => setActiveTab('reqs')}
              className={`flex-1 py-3 text-[10px] font-black uppercase rounded-2xl transition-all italic tracking-widest ${activeTab === 'reqs' ? 'bg-white text-ativa-500 shadow-md' : 'text-gray-400'}`}
            >
              Requisições
            </button>
            <button 
              onClick={() => setActiveTab('movements')}
              className={`flex-1 py-3 text-[10px] font-black uppercase rounded-2xl transition-all italic tracking-widest ${activeTab === 'movements' ? 'bg-white text-ativa-500 shadow-md' : 'text-gray-400'}`}
            >
              Fluxo Estoque
            </button>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {activeTab === 'reqs' ? (
          requisitions.length > 0 ? (
            requisitions.map(req => (
              <div key={req.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-5 relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="bg-ativa-50 p-3 rounded-2xl text-ativa-400 h-fit">
                      {ICONS.Package}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-none">{req.userName}</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">
                        {new Date(req.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-gray-50 text-gray-400 px-3 py-1.5 rounded-full font-black italic uppercase tracking-tighter">
                    #{req.id}
                  </span>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-gray-50">
                   <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2 italic">Itens Solicitados</p>
                  {req.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50/50 p-2 rounded-xl">
                      <span className="text-[11px] text-gray-600 font-medium">{item.productName}</span>
                      <span className="text-[10px] font-black text-ativa-500 italic uppercase">{item.quantity} {item.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <EmptyState message="Nenhuma requisição encontrada." />
          )
        ) : (
          movements.length > 0 ? (
            movements.map(mov => (
              <div key={mov.id} className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl transition-colors ${mov.type === 'IN' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-400'}`}>
                    {mov.type === 'IN' ? ICONS.Plus : ICONS.ArrowRight}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-ativa-500 transition-colors">{mov.productName}</h4>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest italic mt-0.5">
                      {mov.userName} • {new Date(mov.timestamp).toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-base font-black italic ${mov.type === 'IN' ? 'text-green-500' : 'text-red-400'}`}>
                    {mov.type === 'IN' ? '+' : '-'}{mov.quantity}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState message="Sem movimentações registradas." />
          )
        )}
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="py-24 text-center space-y-6">
    <div className="text-gray-100 bg-gray-50 inline-block p-10 rounded-[4rem]">
      {/* Fix: Cast to React.ReactElement<any> to allow the 'size' property which is not present in the default React.ReactElement type */}
      {React.cloneElement(ICONS.History as React.ReactElement<any>, { size: 80 })}
    </div>
    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] italic">{message}</p>
  </div>
);

export default HistoryView;