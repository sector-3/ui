const chain = process.env['NEXT_PUBLIC_CHAIN'] || 'optimism'
export const config = {
  chain: chain,
  providerEndpoint: getProviderEndpoint(chain),
  etherscanDomain: (chain == 'mainnet') ? 'https://etherscan.io' : ((chain == 'optimism') ? `https://optimistic.etherscan.io` : `https://${chain}.etherscan.io`),
  sector3Domain: (chain == 'mainnet') ? 'https://sector3.xyz' : `https://${chain}.sector3.xyz`,
  daoFactoryAddress: (chain == 'mainnet') ? '0x7d480f3a2B5F8f45CbAbe8c0833924549dd1eB12' : ((chain == 'sepolia') ? '0x293aEF46130ca53868b27E3716D1DB653918d137' : ((chain == 'optimism') ? '0x942d6e75465C3c248Eb8775472c853d2b56139fE' : '0x5FbDB2315678afecb367f032d93F642f64180aa3')),
  discordWebhookContributions: process.env['NEXT_PUBLIC_DISCORD_WEBHOOK_CONTRIBUTIONS'],
  discordWebhookPriorities: process.env['NEXT_PUBLIC_DISCORD_WEBHOOK_PRIORITIES'],
  discordWebhookDAOs: process.env['NEXT_PUBLIC_DISCORD_WEBHOOK_DAOS'],
}
console.log('config:', config)

/**
 * @param chain localhost|goerli|sepolia|optimism|mainnet
 */
function getProviderEndpoint(chain: String): string {
  switch(chain) {
    case 'mainnet':
      return 'https://rpc.ankr.com/eth'
    case 'optimism':
      return 'https://rpc.ankr.com/optimism'
    case 'sepolia':
      return 'https://rpc.ankr.com/eth_sepolia'
    case 'goerli':
      return 'https://rpc.ankr.com/eth_goerli'
  }
  return 'http://127.0.0.1:8545'
}
