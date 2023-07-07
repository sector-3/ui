import Sector3DAO from '../../../abis/v1/Sector3DAO.json'
import { useContractReads } from 'wagmi'
import { useIsMounted } from '@/hooks/useIsMounted'
import Image from 'next/image'
import { config } from '@/utils/Config'

export default function DAO({ address }: any) {
  console.log('DAO')

  console.log('address:', address)

  const daoContract: any = {
    address: address,
    abi: Sector3DAO.abi
  }

  const { data: daoData, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...daoContract,
        functionName: 'name'
      },
      {
        ...daoContract,
        functionName: 'purpose'
      },
      {
        ...daoContract,
        functionName: 'token'
      }
    ]
  })
  console.log('daoData:', daoData)
  console.log('isError:', isError)
  console.log('isLoading:', isLoading)

  let dao: any = null
  if (daoData != undefined) {
    const name = daoData[0].result
    const purpose = daoData[1].result
    const token = daoData[2].result
    dao = {
      address: address,
      name: name,
      purpose: purpose,
      token: token
    }
  }
  console.log('dao:', dao)

  if (!useIsMounted() || !dao) {
    return (
      <div className="flex items-center justify-center text-gray-400 pb-6 md:pb-0">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  }

  const tokenLogoLoader = () => {
    console.log('tokenLogoLoader')
    let tokenLogoPath = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${dao.token}/logo.png`
    
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
    if (customTokenLogos.includes(dao.token)) {
      tokenLogoPath = `/token-logos/${config.chain}/${dao.token}.png`
    }
    console.log('tokenLogoPath:', tokenLogoPath)
    
    return tokenLogoPath
  }
  
  return (
    <div className='flex'>
      <div className='w-1/6'>
        <Image
          alt="DAO token logo"
          width={100}
          height={100}
          className='rounded-full bg-gray-800'
          src={`/token-logos/${config.chain}/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png`}
          loader={tokenLogoLoader}
        />
      </div>
      <div className='w-5/6 pl-6'>
        <h2 className='text-xl font-bold'><>{dao.name}</></h2>
        <p className='text-gray-400 pb-6 md:pb-0'><>Purpose: {dao.purpose}</></p>
      </div>
    </div>
  )
}
