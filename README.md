# Sector#3 UI

- Goerli: https://goerli.sector3.xyz
- Mainnet: https://sector3.xyz

## Getting Started

Install the dependencies:

```bash
npm install
```

Set environment variables:

```shell
cp .env.sample .env
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note: Chain `localhost` does not support multicall.  Until fixed, use `goerli` or `mainnet` instead.

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
