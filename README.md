# 🐔 Galinheiro - Sistema de Controle de Estoque

Sistema profissional de controle de estoque e requisições para Ativa Hospitalar, com interface moderna inspirada em apps de delivery e integração completa com Supabase.

![Status](https://img.shields.io/badge/status-production--ready-success)
![Supabase](https://img.shields.io/badge/database-supabase-green)
![React](https://img.shields.io/badge/react-19.2.4-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.8.2-blue)

---

## ✨ Funcionalidades

### 👤 Para Usuários
- 📦 **Catálogo Visual** - Grid com imagens grandes dos produtos
- 🛒 **Carrinho Inteligente** - Controles +/- para ajustar quantidades
- 📋 **Lista Detalhada** - Revise itens antes de enviar
- 📱 **Envio WhatsApp** - Finalização automática via WhatsApp
- 🔍 **Busca e Filtros** - Encontre produtos rapidamente
- 📊 **Histórico** - Veja suas requisições anteriores

### 🔐 Para Administradores
- ➕ **Cadastro de Produtos** - Com upload de imagens
- 📸 **Gestão de Imagens** - Drag & drop, compressão automática
- 👥 **Gestão de Usuários** - Controle de acesso
- 📈 **Movimentações** - Entrada e saída de estoque
- 🏷️ **Categorias** - Organização por tipo de produto

### 📱 PWA
- 🚀 **Instalável** - Funciona como app nativo
- 🎨 **Ícone Personalizado** - Logo profissional
- ⚡ **Performance** - Carregamento rápido
- 📴 **Offline Ready** - Preparado para modo offline

---

## 🛠️ Tecnologias

- **Frontend:** React 19 + TypeScript + Vite
- **Estilização:** TailwindCSS + Lucide Icons
- **Backend:** Supabase (PostgreSQL + Storage)
- **Autenticação:** Sistema próprio (localStorage)
- **Imagens:** Supabase Storage com compressão
- **PWA:** Manifest + Service Worker ready

---

## 🚀 Instalação Local

### Pré-requisitos
- Node.js 18+ instalado
- Conta Supabase (gratuita)

### Passo 1: Clone o Projeto
```bash
git clone <seu-repositorio>
cd galinheiro---controle-interno
```

### Passo 2: Instale Dependências
```bash
npm install
```

### Passo 3: Configure Variáveis de Ambiente
Edite o arquivo `.env.local`:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### Passo 4: Execute Localmente
```bash
npm run dev
```

Acesse: `http://localhost:5173`

**Login padrão:**
- Usuário: `admin`
- Senha: `123`

---

## 📦 Deploy em Produção

### Opção 1: Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Opção 2: Netlify
```bash
npm run build
# Faça upload da pasta dist/
```

### Opção 3: Build Manual
```bash
npm run build
# Arquivos em dist/ prontos para servir
```

---

## 🗄️ Estrutura do Banco Supabase

### Tabelas Necessárias

Execute os seguintes SQLs no Supabase SQL Editor:

```sql
-- Tabela de usuários
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'USER')),
  status TEXT NOT NULL CHECK (status IN ('ativo', 'pendente', 'inativo'))
);

-- Tabela de produtos
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL,
  internal_code TEXT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL CHECK (unit IN ('un', 'kg', 'cx', 'pç', 'mt', 'lt')),
  conversion_factor NUMERIC,
  status TEXT NOT NULL CHECK (status IN ('ativo', 'inativo')),
  image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de requisições
CREATE TABLE requisitions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  items JSONB NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de movimentações
CREATE TABLE stock_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
  quantity NUMERIC NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

### Storage Bucket

1. Vá em **Storage** no Supabase
2. Crie bucket chamado `product-images`
3. Marque como **Público**
4. Configure políticas:

```sql
-- Permitir upload
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'product-images');

-- Permitir leitura
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'product-images');

-- Permitir atualização
CREATE POLICY "Allow public updates" ON storage.objects
FOR UPDATE TO public
USING (bucket_id = 'product-images');

-- Permitir deleção
CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE TO public
USING (bucket_id = 'product-images');
```

---

## 📁 Estrutura do Projeto

```
galinheiro/
├── components/          # Componentes reutilizáveis
│   ├── ImageUpload.tsx
│   ├── Navbar.tsx
│   ├── ProductPlaceholder.tsx
│   └── TabBar.tsx
├── services/           # Serviços de integração
│   ├── api.ts         # API Supabase
│   ├── storage.ts     # Upload de imagens
│   └── supabase.ts    # Cliente Supabase
├── views/             # Telas principais
│   ├── AdminPanel.tsx
│   ├── Catalog.tsx
│   ├── CartView.tsx
│   ├── HistoryView.tsx
│   ├── Login.tsx
│   └── UserManagement.tsx
├── public/            # Arquivos estáticos
│   ├── manifest.json  # PWA manifest
│   ├── icon-192.svg
│   └── icon-512.svg
├── App.tsx            # Componente principal
├── types.ts           # Tipos TypeScript
├── constants.tsx      # Constantes e ícones
└── index.html         # HTML principal
```

---

## 🎨 Customização

### Alterar Cores da Marca
Edite `index.html`:
```javascript
colors: {
  'ativa': {
    50: '#e0f7f9',
    400: '#54c5d0',  // Cor principal
    500: '#3da8b3',
  }
}
```

### Alterar Número WhatsApp
Edite `constants.tsx`:
```typescript
export const WHATSAPP_NUMBER = "553221040257";
```

### Adicionar Categorias
Edite `constants.tsx`:
```typescript
export const INITIAL_CATEGORIES = [
  "Cofee-Break",
  "Descartáveis",
  // Adicione mais aqui
];
```

---

## 🔒 Segurança

- ✅ Senhas armazenadas no Supabase
- ✅ Chaves API em variáveis de ambiente
- ✅ Políticas RLS no Storage
- ✅ Validação de tipos TypeScript
- ⚠️ **Importante:** Para produção, considere implementar Supabase Auth

---

## 📱 Instalando como PWA

### Android
1. Abra no Chrome
2. Menu → "Adicionar à tela inicial"
3. Confirme

### iOS
1. Abra no Safari
2. Botão compartilhar
3. "Adicionar à Tela de Início"

### Desktop
1. Abra no Chrome/Edge
2. Ícone de instalação na barra
3. Clique em "Instalar"

---

## 🐛 Troubleshooting

### Imagens não aparecem
- Verifique se o bucket `product-images` está público
- Confirme que as políticas de Storage estão configuradas
- Veja o console do navegador (F12) para erros

### Erro ao fazer login
- Verifique se a tabela `users` existe
- Confirme que há um usuário admin cadastrado

### Produtos não salvam
- Verifique conexão com Supabase
- Confirme variáveis de ambiente em `.env.local`
- Veja logs no console

---

## 📄 Licença

Projeto desenvolvido para Ativa Hospitalar.

---

## 🙏 Agradecimentos

Desenvolvido com ❤️ usando:
- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Vite](https://vitejs.dev/)

---

**🚀 Pronto para produção!**
