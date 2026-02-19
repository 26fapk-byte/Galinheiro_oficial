import React from 'react';
import { Package } from 'lucide-react';

interface ProductPlaceholderProps {
    category?: string;
    size?: 'small' | 'medium' | 'large';
}

const ProductPlaceholder: React.FC<ProductPlaceholderProps> = ({
    category = 'default',
    size = 'medium'
}) => {
    // Gradientes diferentes por categoria
    const gradients: Record<string, string> = {
        'Químicos': 'from-blue-400 to-blue-600',
        'Descartáveis': 'from-green-400 to-green-600',
        'Equipamentos': 'from-purple-400 to-purple-600',
        'Limpeza': 'from-cyan-400 to-cyan-600',
        'default': 'from-ativa-400 to-ativa-600'
    };

    const gradient = gradients[category] || gradients.default;

    const sizeClasses = {
        small: 'w-12 h-12',
        medium: 'w-20 h-20',
        large: 'w-full h-full'
    };

    const iconSizes = {
        small: 20,
        medium: 32,
        large: 48
    };

    return (
        <div className={`
      ${sizeClasses[size]}
      bg-gradient-to-br ${gradient}
      rounded-2xl
      flex items-center justify-center
      relative overflow-hidden
      group
    `}>
            {/* Pattern de fundo */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 20px
          )`
                }} />
            </div>

            {/* Ícone */}
            <div className="relative z-10 text-white/90 group-hover:scale-110 transition-transform duration-300">
                <Package size={iconSizes[size]} strokeWidth={1.5} />
            </div>

            {/* Brilho sutil */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
};

export default ProductPlaceholder;
