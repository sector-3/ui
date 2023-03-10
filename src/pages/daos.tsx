import Head from 'next/head'
import { chainUtils } from '@/utils/ChainUtils'
import { configureChains, createClient, useContractRead, useContractReads, WagmiConfig } from 'wagmi'
import { publicProvider } from '@wagmi/core/providers/public'
import Sector3DAOFactory from '../../abis/Sector3DAOFactory.json'
import Sector3DAO from '../../abis/v0/Sector3DAO.json'
import { config } from '@/utils/Config'
import { useIsMounted } from '@/hooks/useIsMounted'
import Link from 'next/link'
import Image from 'next/image'

const { provider } = configureChains(
  [chainUtils.chain],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider
})

export default function DAOsPage() {
  console.log('DAOsPage')

  return (
    <WagmiConfig client={client}>
      <Head>
        <title>Sector#3</title>
        <meta name="description" content="Do DAOs Dream of Electric Sheep? ⚡️🐑" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <video id="background-video" autoPlay loop muted poster="https://pbs.twimg.com/tweet_video_thumb/FpM9CcwagAIiRD7.jpg">
        {/* <source src="https://video.twimg.com/tweet_video/FpM9CcwagAIiRD7.mp4" type="video/mp4" /> */}
      </video>

      <main className='p-2 sm:p-4 md:p-8 lg:p-16 xl:p-32 2xl:p-64'>

        <div id='content'>
          <div className='container'>
            <Link href={`${config.etherscanDomain}/address/${config.daoFactoryAddress}#writeContract#F1`} target='_blank'>
              <button
                className='disabled:text-gray-600 disabled:bg-gray-400 float-right px-4 py-2 text-sm font-semibold text-indigo-200 bg-indigo-800 hover:bg-indigo-700 rounded-xl'
              >
                🚀 Deploy a DAO
              </button>
            </Link>

            <h2 className="text-2xl text-gray-400">Explore DAOs</h2>
          </div>
          <DAOContainer />
        </div>
      </main>
    </WagmiConfig>
  )
}

function DAOContainer() {
  console.log('DAOContainer')

  const daoFactoryAddress: any = config.daoFactoryAddress;
  console.log('daoFactoryAddress:', daoFactoryAddress)

  const { data, isError, isLoading } = useContractRead({
    address: daoFactoryAddress,
    abi: Sector3DAOFactory.abi,
    functionName: 'getDAOs'
  })
  const daoAddresses = data as []
  console.log('daoAddresses:', daoAddresses)

  if (!useIsMounted() || isLoading) {
    return (
      <div className="container mt-4 flex items-center text-gray-400">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  } else if (daoAddresses.length == 0) {
    return (
      <div className='container mt-4'>
        No data
      </div>
    )
  } else {
    return (
      <div className='container mt-4 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-4'>
        {
          daoAddresses.map((daoAddress: any) => (
            <DAOPreview key={daoAddress} address={daoAddress} />
          ))
        }
      </div>
    )
  }
}

function DAOPreview({ address }: any) {
  console.log('DAOPreview')

  console.log('address:', address)

  const daoContract = {
    address: address,
    abi: Sector3DAO.abi
  }
  const { data, isError, isLoading } = useContractReads({
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
      },
      {
        ...daoContract,
        functionName: 'version'
      }
    ]
  })
  console.log('data:', data)
  console.log('isError:', isError)
  console.log('isLoading:', isLoading)

  let dao: any = null
  if (data != undefined) {
    const name = data[0]
    const purpose = data[1]
    const token = data[2]
    const version = data[3]
    dao = {
      address: address,
      protocolVersion: version,
      name: name,
      purpose: purpose,
      token: token
    }
  }
  console.log('dao:', dao)

  if (!useIsMounted() || isLoading) {
    return (
      <div className='p-6 bg-black rounded-xl border-4 border-black border-l-gray-700 border-r-gray-700'>
        <div className="container mt-4 flex items-center text-gray-400">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          &nbsp;Loading...
        </div>
      </div>
    )
  } else {
    const tokenLogoLoader = () => {
      let tokenLogoPath = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${dao.token}/logo.png`
      
      const customTokenLogos = [
        '0x610210AA5D51bf26CBce146A5992D2FEeBc27dB1' // Sector#3
      ]
      if (customTokenLogos.includes(dao.token)) {
        tokenLogoPath = `/token-logos/${dao.token}.png`
      }
      console.log('tokenLogoPath:', tokenLogoPath)
      
      return tokenLogoPath
    }

    return (
      <Link href={`/v${dao.protocolVersion}/daos/${dao.address}`}>
        <div className='p-6 bg-black rounded-xl border-4 border-black hover:border-gray-700 border-l-gray-700 border-r-gray-700'>
          <div className='flex'>
            <div className='w-1/6'>
              <Image
                alt="DAO token logo"
                width={100}
                height={100}
                className='rounded-full bg-gray-800'
                src={`/token-logos/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png`}
                loader={tokenLogoLoader}
              />
            </div>
            <div className='w-5/6 pl-6'>
                <h2 className='text-xl font-bold'>{dao.name}</h2>
              <p className='text-gray-400 pb-6 md:pb-0'>Purpose: {dao.purpose}</p>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}
