const chain = process.env['NEXT_PUBLIC_CHAIN'] || 'localhost'
export const config = {
  chain: chain,
  etherscanDomain: (chain == 'mainnet') ? 'https://etherscan.io' : `https://${chain}.etherscan.io`,
  daoFactoryAddress: (chain == 'mainnet') ? '<address>' : '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
}
console.log('config:', config)
