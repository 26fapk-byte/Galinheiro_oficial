import React, { useState, useRef, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    currentImage?: string;
    onImageSelect: (file: File) => void;
    onImageRemove: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageSelect, onImageRemove }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | undefined>(currentImage);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        // Validar tipo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Por favor, selecione uma imagem válida (JPEG, PNG ou WebP)');
            return;
        }

        // Validar tamanho (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 5MB');
            return;
        }

        // Criar preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Notificar pai
        onImageSelect(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(undefined);
        onImageRemove();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Foto do Produto
            </label>

            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-3xl overflow-hidden cursor-pointer
          transition-all duration-300 group
          ${isDragging
                        ? 'border-ativa-400 bg-ativa-50/50 scale-[1.02]'
                        : preview
                            ? 'border-transparent bg-gray-50'
                            : 'border-gray-200 bg-gray-50 hover:border-ativa-300 hover:bg-ativa-50/30'
                    }
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                    className="hidden"
                />

                {preview ? (
                    <div className="relative aspect-[4/3] w-full">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Botão de remover */}
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-3 right-3 p-2.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
                        >
                            <X size={18} />
                        </button>

                        {/* Overlay de troca */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                                <p className="text-sm font-bold text-ativa-400 flex items-center gap-2">
                                    <Upload size={16} />
                                    Clique para trocar
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="aspect-[4/3] w-full flex flex-col items-center justify-center p-8 text-center">
                        <div className={`
              p-5 rounded-full mb-4 transition-all duration-300
              ${isDragging ? 'bg-ativa-400 text-white scale-110' : 'bg-ativa-100 text-ativa-400'}
            `}>
                            {isDragging ? <Upload size={32} /> : <ImageIcon size={32} />}
                        </div>

                        <p className="text-sm font-bold text-gray-700 mb-1">
                            {isDragging ? 'Solte a imagem aqui' : 'Adicionar foto do produto'}
                        </p>

                        <p className="text-xs text-gray-400 mb-3">
                            Arraste e solte ou clique para selecionar
                        </p>

                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <span className="px-2 py-1 bg-white rounded-full font-medium">JPEG</span>
                            <span className="px-2 py-1 bg-white rounded-full font-medium">PNG</span>
                            <span className="px-2 py-1 bg-white rounded-full font-medium">WebP</span>
                        </div>

                        <p className="text-[10px] text-gray-400 mt-2">Máximo 5MB</p>
                    </div>
                )}
            </div>

            {preview && (
                <p className="text-[10px] text-center text-gray-400 italic">
                    ✓ Imagem selecionada • Será enviada ao salvar o produto
                </p>
            )}
        </div>
    );
};

export default ImageUpload;
