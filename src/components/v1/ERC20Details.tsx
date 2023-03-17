import { useIsMounted } from '@/hooks/useIsMounted'
import { config } from '@/utils/Config'
import Image from 'next/image'
import Link from 'next/link'
import { useContractReads } from 'wagmi'
import ERC721 from '../../../abis/v1/ERC721.json'

export default function ERC20Details({ address }: any) {
  console.log('ERC20Details')

  const NFTContract = {
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
      symbol: data[0],
      name: data[1]
    }
  }

  const tokenLogoLoader = () => {
    console.log('tokenLogoLoader')
    let tokenLogoPath = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
    
    const customTokenLogos = [
      '0x610210AA5D51bf26CBce146A5992D2FEeBc27dB1', // Sector#3
      '0x333A4823466879eeF910A04D473505da62142069' // Nation3
    ]
    if (customTokenLogos.includes(address)) {
      tokenLogoPath = `/token-logos/${address}.png`
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
              src={`/token-logos/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png`}
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
