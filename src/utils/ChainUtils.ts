import { mainnet, sepolia, goerli, localhost } from 'wagmi/chains'
import { config } from '@/utils/Config'

const chains = [mainnet, sepolia, goerli, localhost]
let chainIndex = 0
if (config.chain == 'sepolia') {
  chainIndex = 1
} else if (config.chain == 'goerli') {
  chainIndex = 2
} else if (config.chain == 'localhost') {
  chainIndex = 3
}
const chain = chains[chainIndex]
console.log('chain:', chain)

export const chainUtils = {
  chain: chain
}
