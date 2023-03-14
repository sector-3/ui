import { useIsMounted } from '@/hooks/useIsMounted'
import { config } from '@/utils/Config'
import Link from 'next/link'
import { useContractReads } from 'wagmi'
import ERC721 from '../../../abis/v1/ERC721.json'

export default function ERC721Details({ address }: any) {
  console.log('ERC721Details')

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

  if (!useIsMounted()) {
    return (
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
    )
  }
  return (
    <Link
      href={`${config.etherscanDomain}/token/${address}`}
      target="_blank"
    >
      <span className='text-indigo-400 hover:text-indigo-300 bg-gray-800 hover:bg-gray-700 ring-1 ring-gray-700 hover:ring-gray-600 rounded-lg p-2'>
          <code>{data[1]}</code>
      </span>
    </Link>
  )
}
