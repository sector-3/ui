import { mainnet, optimism, sepolia, goerli, localhost } from 'wagmi/chains'
import { config } from '@/utils/Config'

const chains = [mainnet, optimism, sepolia, goerli, localhost]
let chainIndex = 0
if (config.chain == 'optimism') {
  chainIndex = 1
} else if (config.chain == 'sepolia') {
  chainIndex = 2
} else if (config.chain == 'goerli') {
  chainIndex = 3
} else if (config.chain == 'localhost') {
  chainIndex = 4
}
const chain = chains[chainIndex]
console.log('chain:', chain)

export const chainUtils = {
  chain: chain
}
