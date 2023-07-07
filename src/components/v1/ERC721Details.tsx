import { useIsMounted } from '@/hooks/useIsMounted'
import { config } from '@/utils/Config'
import Link from 'next/link'
import { useContractReads } from 'wagmi'
import ERC721 from '../../../abis/v1/ERC721.json'

export default function ERC721Details({ address }: any) {
  console.log('ERC721Details')

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
      <span className='inline-flex text-indigo-400 hover:text-indigo-300 bg-gray-800 hover:bg-gray-700 ring-1 ring-gray-700 hover:ring-gray-600 rounded-lg px-2 py-1'>
        <code>{tokenDetails.name}</code>
      </span>
    </Link>
  )
}
