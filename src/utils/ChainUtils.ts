import { mainnet, goerli, localhost } from '@wagmi/chains'
import { config } from '@/utils/Config'

const chains = [mainnet, goerli, localhost]
let chainIndex = 0
if (config.chain == 'goerli') {
  chainIndex = 1
} else if (config.chain == 'localhost') {
  chainIndex = 2
}
const chain = chains[chainIndex]
console.log('chain:', chain)

export const chainUtils = {
  chain: chain
}
