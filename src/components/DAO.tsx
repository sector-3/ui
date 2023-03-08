import Sector3DAO from '../../abis/Sector3DAO.json'
import { configureChains, createClient, useAccount, useConnect, useContractRead, useContractReads, useDisconnect, WagmiConfig } from 'wagmi'
import { useIsMounted } from '@/hooks/useIsMounted'
import Image from 'next/image'

export default function DAO({ address }: any) {
  console.log('DAO')

  console.log('address:', address)

  const daoContract = {
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
    const name = daoData[0]
    const purpose = daoData[1]
    const token = daoData[2]
    dao = {
      address: address,
      name: name,
      purpose: purpose,
      token: token
    }
  }

  if (!useIsMounted() || !dao) {
    return (
      <div className="flex items-center justify-center text-gray-400 pb-6 md:pb-0">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  }

  const tokenLogoLoader = () => {
    let tokenLogoPath = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${dao.token}/logo.png`
    
    const customTokenLogos = [
      '0x610210AA5D51bf26CBce146A5992D2FEeBc27dB1' // Sector#3
    ]
    if (customTokenLogos.includes(dao.token)) {
      tokenLogoPath = `/token-logos/${dao.token}.png`
    }
    
    return tokenLogoPath
  }
  
  return (
    <div className='flex'>
      <div className='w-1/6'>
        <Image
          alt="DAO token logo"
          width={100}
          height={100}
          className='rounded-full'
          src={`/token-logos/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png`}
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
