# Sector#3 UI

- Goerli: https://goerli.sector3.xyz
- Mainnet: https://sector3.xyz

## Getting Started

Install the dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Lint

Run lint check:

```bash
npm run lint
```

## Build

```bash
npm run build
```

## Routes

- DAO: `/daos/<address>`
- Priority: `/priorities/<address>`
- Epoch: `/priorities/<address>/epochs/<epochIndex>`
