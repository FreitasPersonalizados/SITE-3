# Freitas - E-commerce Template (Vercel + Firebase)

Este repositório contém um template React (Vite) pronto para uso com Firebase (Firestore, Storage, Auth) e deploy na Vercel.
Substitua o arquivo `/public/logo.png` pela sua logo se desejar.

## Quickstart (local)
1. Copie o arquivo de ambiente:
   ```
   cp .env.example .env
   ```
   Preencha as variáveis com as chaves do seu projeto Firebase.

2. Instale dependências:
   ```
   npm install
   ```

3. Rode em dev:
   ```
   npm run dev
   ```

## Deploy na Vercel
1. Suba este repositório para o GitHub.
2. Crie um novo projeto no Vercel conectando ao repositório.
3. Configure as Environment Variables no Vercel (mesmas chaves de `.env.example`).
4. Build command: `npm run build`
5. Output directory: `dist`

## Firebase setup (básico)
- Crie um projeto no Firebase Console.
- Habilite Firestore, Storage e Authentication (Email/Password).
- Para criar um admin manualmente, crie o usuário no Auth e use um script com o Admin SDK para definir o custom claim `admin: true`.

## Estrutura importante
- `src/firebase.js` – inicializa Firebase usando variáveis de ambiente.
- `src/App.jsx` – app principal com catálogo, carrinho e painel admin.
- `public/logo.png` – logo usada pelo layout (coloque sua imagem aqui).

