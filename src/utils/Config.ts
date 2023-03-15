const chain = process.env['NEXT_PUBLIC_CHAIN'] || 'localhost'
export const config = {
  chain: chain,
  etherscanDomain: (chain == 'mainnet') ? 'https://etherscan.io' : `https://${chain}.etherscan.io`,
  daoFactoryAddress: (chain == 'mainnet') ? '<address>' : ((chain == 'sepolia') ? '0x610210AA5D51bf26CBce146A5992D2FEeBc27dB1' : '0xE6dc5d73B7E3764C42A4A71C408E4F8246f034f7'),
  discordWebhookContributions: process.env['DISCORD_WEBHOOK_CONTRIBUTIONS'],
  discordWebhookPriorities: process.env['DISCORD_WEBHOOK_PRIORITIES'],
  discordWebhookDAOs: process.env['DISCORD_WEBHOOK_DAOS'],
}
console.log('config:', config)
