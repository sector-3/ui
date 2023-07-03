import Head from 'next/head'
import Image from 'next/image'
import { PT_Mono } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { config } from '@/utils/Config'
import { chainUtils } from '@/utils/ChainUtils'
import { configureChains, createConfig, useAccount, useConnect, useContractRead, useContractReads, useDisconnect, WagmiConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from '@wagmi/core/providers/public'
import Sector3DAO from '../../../../abis/v1/Sector3DAO.json'
import Sector3DAOPriority from '../../../../abis/v1/Sector3DAOPriority.json'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useIsMounted } from '@/hooks/useIsMounted'
import DAO from '@/components/v1/DAO'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import ERC721Details from '@/components/v1/ERC721Details'
import ERC20Details from '@/components/v1/ERC20Details'
import ContributorAddress from '@/components/v1/ContributorAddress'

const font = PT_Mono({ subsets: ['latin'], weight: '400' })

const { publicClient } = configureChains(
  [chainUtils.chain],
  [publicProvider()]
)

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient
})

export default function PriorityPage() {
  console.log('PriorityPage')

  const router = useRouter()
  const address = router.query.address
  console.log('address:', address)

  return (
    <WagmiConfig config={wagmiConfig}>
      <Head>
        <title>Sector#3</title>
        <meta name="description" content="Do DAOs Dream of Electric Sheep? ⚡️🐑" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="background-image"></div>

      <main className='p-2 sm:p-4 md:p-8 lg:p-16 xl:p-32 2xl:p-64'>
        <button className='py-5' onClick={()=>router.back()}>
          <Image alt='back' src='/arrow-left.svg' width={48} height={48} />
        </button>
        <div id='header' className='md:flex p-6 bg-black rounded-xl border-4 border-black border-l-gray-700 border-r-gray-700'>
          <div className='md:w-2/3 flex'>
            <DAOAddress priorityAddress={address} />
          </div>
          <div className='text-center md:text-right md:w-1/3'>
            <EthereumAccount />
          </div>
        </div>

        <div id='priority' className='p-6 bg-black rounded-xl border-4 border-black border-l-gray-700 border-r-gray-700'>
          <Priority address={address} />
        </div>

        <div id='content' className='mt-4'>
          <EpochNumber priorityAddress={address} />
        </div>
      </main>
    </WagmiConfig>
  )
}

function DAOAddress({ priorityAddress }: any) {
  console.log('DAOAddress')

  console.log('priorityAddress:', priorityAddress)

  const { data, isError, isLoading } = useContractRead({
    address: priorityAddress,
    abi: Sector3DAOPriority.abi,
    functionName: 'dao'
  })
  console.log('data:', data)
  console.log('isError:', isError)
  console.log('isLoading:', isLoading)

  let daoAddress = null
  if (data) {
    daoAddress = data
  }

  if (!useIsMounted() || !daoAddress) {
    return (
      <div className="flex items-center text-gray-400">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  }
  return <DAO address={daoAddress} />
}

function EthereumAccount() {
  console.log('EthereumAccount')

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector()
  })
  const { disconnect } = useDisconnect()

  if (!useIsMounted() || !isConnected) {
    return (
      <button onClick={() => connect()} className='rounded-xl text-xl font-bold bg-indigo-800 hover:bg-indigo-700 px-4 py-2'>
        <div className='flex'>
          <Image alt='Ethereum' src='/ethereum.svg' width={24} height={24} />
          &nbsp;Connect
        </div>
      </button>
    )
  }

  return (
    <button onClick={() => disconnect()} className='rounded-xl text-xl font-bold bg-gray-800 hover:bg-gray-700 px-4 py-2'>
      <div className='flex'>
        <img src={`https://cdn.stamp.fyi/avatar/eth:${address}?s=128`} className="h-7 w-7 bg-gray-700 rounded-full" />
        &nbsp;<code><ContributorAddress address={address} /></code>
      </div>
    </button>
  )
}

function Priority({ address }: any) {
  console.log('Priority')

  const priorityContract: any = {
    address: address,
    abi: Sector3DAOPriority.abi
  }

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...priorityContract,
        functionName: 'title'
      },
      {
        ...priorityContract,
        functionName: 'rewardToken'
      },
      {
        ...priorityContract,
        functionName: 'startTime'
      },
      {
        ...priorityContract,
        functionName: 'epochDuration'
      },
      {
        ...priorityContract,
        functionName: 'epochBudget'
      },
      {
        ...priorityContract,
        functionName: 'gatingNFT'
      }
    ]
  })
  console.log('data:', data)

  let priority = null
  if (data) {
    priority = {
      title: data[0].result,
      rewardToken: data[1].result,
      startDate: new Date(Number(data[2].result) * 1_000).toISOString().substring(0, 10),
      epochDuration: data[3].result,
      epochBudget: ethers.utils.formatUnits(String(data[4].result)),
      gatingNFT: data[5].result
    }
  }
  console.log('priority:', priority)

  if (!useIsMounted() || !priority) {
    return (
      <div className="flex items-center text-gray-400">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  }
  return (
    <>
      <div className='md:flex'>
        <div className='md:w-1/3'>
          <label className='text-gray-400'>Priority</label><br />
          <>{priority.title}</>
        </div>
        <div className='md:w-1/3 pt-4 md:pt-0 md:px-4'>
          <label className='text-gray-400'>Start date</label><br />
          {priority.startDate}
        </div>
        <div className='md:w-1/3 pt-4 md:pt-0'>
          <label className='text-gray-400'>Budget</label><br />
          <>{priority.epochBudget} <ERC20Details address={priority.rewardToken} /> per {priority.epochDuration} days</>
        </div>
      </div>

      {/* {(priority.gatingNFT != ethers.constants.AddressZero) && (
        <div className='mt-4 border-2 border-amber-900 text-amber-600 rounded-lg p-2'>
          <span className='mr-2 inline-flex bg-amber-900 text-amber-500 font-bold uppercase rounded-lg px-2 py-1'>
            <ShieldCheckIcon className='h-5 w-5' /> NFT-gated
          </span>
          Contributing to this priority requires NFT ownership: <ERC721Details address={priority.gatingNFT} />
        </div>
      )} */}
    </>
  )
}

function EpochNumber({ priorityAddress }: any) {
  console.log('EpochNumber')

  const { data: epochNumber, isError, isLoading } = useContractRead({
    address: priorityAddress,
    abi: Sector3DAOPriority.abi,
    functionName: 'getEpochNumber'
  })
  console.log('epochNumber:', epochNumber)

  if (!useIsMounted() || (epochNumber == undefined)) {
    return (
      <div className="flex items-center text-gray-400">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  }
  return <Epochs priorityAddress={priorityAddress} epochNumber={epochNumber} />
}

function Epochs({ priorityAddress, epochNumber }: any) {
  console.log('Epochs')

  console.log('priorityAddress:', priorityAddress)
  console.log('epochNumber:', epochNumber)

  const priorityContract: any = {
    address: priorityAddress,
    abi: Sector3DAOPriority.abi
  }

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...priorityContract,
        functionName: 'title'
      },
      {
        ...priorityContract,
        functionName: 'rewardToken'
      },
      {
        ...priorityContract,
        functionName: 'startTime'
      },
      {
        ...priorityContract,
        functionName: 'epochDuration'
      },
      {
        ...priorityContract,
        functionName: 'epochBudget'
      },
      {
        ...priorityContract,
        functionName: 'getEpochNumber'
      }
    ]
  })
  console.log('data:', data)

  let priority: any = null
  if (data) {
    priority = {
      address: priorityAddress,
      title: data[0].result,
      rewardToken: data[1].result,
      startTime: Number(data[2].result),
      startDate: new Date(Number(data[2].result) * 1_000).toISOString().substring(0, 10),
      epochDuration: Number(data[3].result),
      epochBudget: ethers.utils.formatUnits(String(data[4].result)),
      epochNumber: data[5].result
    }
  }
  console.log('priority:', priority)

  let epochs: any[] = []
  if (priority) {
    let i = epochNumber - 1;
    while (i >= 0) {
      console.log('i:', i)

      const epoch = {
        i: Number(i),
        startDate: new Date(Number(priority.startTime + (i * priority.epochDuration * 24*60*60)) * 1_000).toISOString().substring(0, 10),
        endDate: new Date(Number(priority.startTime + ((i + 1) * priority.epochDuration * 24*60*60)) * 1_000).toISOString().substring(0, 10)
      }
      epochs[epochs.length] = epoch

      i--
    }
  }
  console.log('epochs:', epochs)

  if (!useIsMounted() || (epochs.length == 0)) {
    return (
      <div className="flex items-center text-gray-400">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  }

  return (
    <div>
      <div className='container mt-8'>
        <h2 className="text-2xl text-gray-400">Current Epoch</h2>
      </div>

      <div className='container'>
        <div className='mt-4 p-6 bg-gray-800 rounded-xl'>
          <h3 className='text-xl font-bold mb-2'>Epoch #{priority.epochNumber}</h3>
          From <b>{epochs[0].startDate}</b> to <b>{epochs[0].endDate}</b><br />

          <Link href={`/v1/priorities/${priority.address}/epochs/${priority.epochNumber}`}>
            <button className='mt-4 px-4 py-2 font-semibold rounded-xl bg-indigo-900 hover:bg-indigo-800'>⏳ Report Contributions</button>
          </Link>
        </div>
      </div>

      <div className='container mt-8'>
        <h2 className="text-2xl text-gray-400">Past Epochs</h2>
      </div>

      <div className='container'>
        {(epochs.length < 2) ? (
          <div className='mt-4 text-gray-400'>
            No data
          </div>
        ) : (
          epochs.map((epoch: any, index: number) => (
            (index == 0) ? (
              // Skip current epoch
              null
            ) : (
              <div key={index} className='mt-4 p-6 bg-gray-800 rounded-xl'>
                <h3 className='text-xl font-bold mb-2'>Epoch #{priority.epochNumber - index}</h3>
                From <b>{epoch.startDate}</b> to <b>{epoch.endDate}</b><br />

                <Link href={`/v1/priorities/${priority.address}/epochs/${priority.epochNumber - index}`}>
                  <button className='mt-4 px-4 py-2 font-semibold rounded-xl bg-indigo-900 hover:bg-indigo-800'>⌛️ View Contributions</button>
                </Link>
              </div>
            )
          ))
        )}
      </div>
    </div>
  )
}
