import { supabase } from './supabase';

/**
 * StorageService - Gerenciamento de upload de imagens no Supabase Storage
 */
export const StorageService = {
    /**
     * Faz upload de uma imagem de produto para o Supabase Storage
     * @param file - Arquivo de imagem
     * @param productId - ID do produto (usado para nomear o arquivo)
     * @returns URL pública da imagem ou null em caso de erro
     */
    async uploadProductImage(file: File, productId: string): Promise<string | null> {
        try {
            // Validar tipo de arquivo
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                console.error('Tipo de arquivo inválido. Use JPEG, PNG ou WebP.');
                return null;
            }

            // Validar tamanho (5MB)
            if (file.size > 5 * 1024 * 1024) {
                console.error('Arquivo muito grande. Máximo 5MB.');
                return null;
            }

            // Gerar nome único com timestamp
            const timestamp = Date.now();
            const extension = file.name.split('.').pop();
            const fileName = `${productId}_${timestamp}.${extension}`;
            const filePath = `products/${fileName}`;

            // Upload para o Supabase Storage
            const { data, error } = await supabase.storage
                .from('product-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Erro ao fazer upload:', error);
                return null;
            }

            // Obter URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Erro no upload:', error);
            return null;
        }
    },

    /**
     * Remove uma imagem do Supabase Storage
     * @param imageUrl - URL completa da imagem
     */
    async deleteProductImage(imageUrl: string): Promise<boolean> {
        try {
            if (!imageUrl) return true;

            // Extrair o caminho do arquivo da URL
            const urlParts = imageUrl.split('/product-images/');
            if (urlParts.length < 2) return false;

            const filePath = urlParts[1];

            const { error } = await supabase.storage
                .from('product-images')
                .remove([filePath]);

            if (error) {
                console.error('Erro ao deletar imagem:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Erro ao deletar:', error);
            return false;
        }
    },

    /**
     * Comprime e redimensiona uma imagem antes do upload
     * @param file - Arquivo original
     * @param maxWidth - Largura máxima
     * @param maxHeight - Altura máxima
     * @returns Arquivo comprimido
     */
    async compressImage(file: File, maxWidth: number = 800, maxHeight: number = 800): Promise<File> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calcular novas dimensões mantendo aspect ratio
                    if (width > height) {
                        if (width > maxWidth) {
                            height = height * (maxWidth / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = width * (maxHeight / height);
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const compressedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now(),
                                });
                                resolve(compressedFile);
                            } else {
                                resolve(file);
                            }
                        },
                        'image/jpeg',
                        0.85 // Qualidade 85%
                    );
                };
            };
        });
    }
};
