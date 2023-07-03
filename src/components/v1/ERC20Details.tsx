import { useIsMounted } from '@/hooks/useIsMounted'
import { config } from '@/utils/Config'
import Image from 'next/image'
import Link from 'next/link'
import { useContractReads } from 'wagmi'
import ERC721 from '../../../abis/v1/ERC721.json'

export default function ERC20Details({ address }: any) {
  console.log('ERC20Details')

  const NFTContract: any = {
    address: address,
    abi: ERC721.abi
  }

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...NFTContract,
        functionName: 'symbol'
      },
      {
        ...NFTContract,
        functionName: 'name'
      }
    ]
  })
  console.log('data:', data)

  let tokenDetails: any = null
  if (data) {
    tokenDetails = {
      symbol: data[0].result,
      name: data[1].result
    }
  }
  console.log('tokenDetails:', tokenDetails)

  const tokenLogoLoader = () => {
    console.log('tokenLogoLoader')
    let tokenLogoPath = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
    
    let customTokenLogos = [
      '0x610210AA5D51bf26CBce146A5992D2FEeBc27dB1', // Sector#3
      '0x333A4823466879eeF910A04D473505da62142069' // Nation3
    ]
    if (config.chain == 'optimism') {
      customTokenLogos = [
        '0xe5eC44DD7D49E6edf31878E55DEc12eB79Bd10aE', // Sector#3
        '0x29FAF5905bfF9Cfcc7CF56a5ed91E0f091F8664B' // Bankless
      ]
    }
    if (customTokenLogos.includes(address)) {
      tokenLogoPath = `/token-logos/${config.chain}/${address}.png`
    }
    console.log('tokenLogoPath:', tokenLogoPath)
    
    return tokenLogoPath
  }

  if (!useIsMounted() || isLoading) {
    return (
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
    )
  }
  return (
    <Link
      href={`${config.etherscanDomain}/token/${address}`}
      target="_blank"
    >
      <span className='inline-flex text-indigo-400 hover:text-indigo-300 bg-gray-800 hover:bg-gray-700 ring-1 ring-gray-700 hover:ring-gray-600 rounded-lg'>
          {/* <div>
            <Image
              alt="Token logo"
              width={16}
              height={16}
              className='rounded-full bg-gray-800'
              src={`/token-logos/${config.chain}/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png`}
              loader={tokenLogoLoader}
            />
          </div> */}
          <div className='px-1'>
            <code>${tokenDetails.symbol ? tokenDetails.symbol : '<SYMBOL>'}</code>
          </div>
      </span>
    </Link>
  )
}
