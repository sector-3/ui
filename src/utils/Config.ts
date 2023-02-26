const chain = process.env['NEXT_PUBLIC_CHAIN'] || 'localhost'
export const config = {
  chain: chain,
  etherscanDomain: (chain == 'mainnet') ? 'https://etherscan.io' : `https://${chain}.etherscan.io`
}
console.log('config:', config)
