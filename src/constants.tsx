
import React from 'react';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  User as UserIcon,
  ShieldCheck,
  History,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Check,
  Smartphone
} from 'lucide-react';
import { ProductUnit, ProductStatus, UserRole } from './types';

// Logo Customizado "Galinheiro" - Design Minimalista Hospitalar
export const Logo = ({ size = 40, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M50 5L15 25V75L50 95L85 75V25L50 5Z" 
      stroke="currentColor" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M50 50V95M15 25L50 50L85 25M50 50H85V75L50 95" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      opacity="0.6"
    />
    <path 
      d="M35 45H50H65M50 30V45V60" 
      stroke="currentColor" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-white"
    />
  </svg>
);

export const ICONS = {
  Home: <Home size={20} />,
  Package: <Package size={20} />,
  Cart: <ShoppingCart size={20} />,
  Requests: <ClipboardList size={20} />,
  Settings: <Settings size={20} />,
  Logout: <LogOut size={20} />,
  Plus: <Plus size={20} />,
  Search: <Search size={18} />,
  Filter: <Filter size={18} />,
  ArrowRight: <ArrowRight size={18} />,
  ChevronRight: <ChevronRight size={18} />,
  User: <UserIcon size={20} />,
  Admin: <ShieldCheck size={20} />,
  History: <History size={20} />,
  Trash: <Trash2 size={18} />,
  Edit: <Edit size={18} />,
  Success: <CheckCircle2 size={24} className="text-green-500" />,
  Error: <XCircle size={24} className="text-red-500" />,
  Warning: <AlertTriangle size={24} className="text-amber-500" />,
  Loading: <Loader2 size={20} className="animate-spin" />,
  Check: <Check size={18} />,
  Smartphone: <Smartphone size={18} />
};

export const WHATSAPP_NUMBER = "553221040257";

export const INITIAL_CATEGORIES = [
  "Cofee-Break",
  "Descartáveis",
  "Higiene",
  "Instrumental",
  "Medicação",
  "Limpeza",
  "Escritório"
];

export const UNITS = Object.values(ProductUnit);
