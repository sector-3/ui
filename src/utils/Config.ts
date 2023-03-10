const chain = process.env['NEXT_PUBLIC_CHAIN'] || 'localhost'
export const config = {
  chain: chain,
  etherscanDomain: (chain == 'mainnet') ? 'https://etherscan.io' : `https://${chain}.etherscan.io`,
  daoFactoryAddress: (chain == 'mainnet') ? '<address>' : '0xE6dc5d73B7E3764C42A4A71C408E4F8246f034f7'
}
console.log('config:', config)
