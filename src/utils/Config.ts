const chain = process.env['NEXT_PUBLIC_CHAIN'] || 'localhost'
export const config = {
  chain: chain,
  etherscanDomain: (chain == 'mainnet') ? 'https://etherscan.io' : `https://${chain}.etherscan.io`,
  daoFactoryAddress: (chain == 'mainnet') ? '<address>' : ((chain == 'sepolia') ? '0x293aEF46130ca53868b27E3716D1DB653918d137' : '0xE6dc5d73B7E3764C42A4A71C408E4F8246f034f7'),
  discordWebhookContributions: process.env['NEXT_PUBLIC_DISCORD_WEBHOOK_CONTRIBUTIONS'],
  discordWebhookPriorities: process.env['NEXT_PUBLIC_DISCORD_WEBHOOK_PRIORITIES'],
  discordWebhookDAOs: process.env['NEXT_PUBLIC_DISCORD_WEBHOOK_DAOS'],
}
console.log('config:', config)
