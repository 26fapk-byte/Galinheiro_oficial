import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    plugins: [
      tailwindcss(),
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Galinheiro - Ativa Hospitalar',
          short_name: 'Galinheiro',
          description: 'Sistema de Controle de Estoque e Requisições - Ativa Hospitalar',
          theme_color: '#54c5d0',
          icons: [
            {
              src: 'icon-192.svg',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: 'icon-512.svg',
              sizes: '512x512',
              type: 'image/svg+xml'
            }
          ],
          shortcuts: [
            {
              name: "Catálogo",
              short_name: "Catálogo",
              description: "Ver produtos disponíveis",
              url: "/?view=catalog",
              icons: [{ src: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" }]
            },
            {
              name: "Carrinho",
              short_name: "Carrinho",
              description: "Ver itens no carrinho",
              url: "/?view=cart",
              icons: [{ src: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" }]
            }
          ]
        },
        devOptions: {
          enabled: true
        }
      })
    ]
  };
});

