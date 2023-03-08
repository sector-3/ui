import Head from 'next/head'
import Image from 'next/image'
import { PT_Mono } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { config } from '@/utils/Config'
import { chainUtils } from '@/utils/ChainUtils'
import { configureChains, createClient, useAccount, useConnect, useContractRead, useContractReads, useDisconnect, WagmiConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from '@wagmi/core/providers/public'
import Sector3DAO from '../../../../abis/v0/Sector3DAO.json'
import Sector3DAOPriority from '../../../../abis/v0/Sector3DAOPriority.json'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useIsMounted } from '@/hooks/useIsMounted'
import DAO from '@/components/v0/DAO'

const font = PT_Mono({ subsets: ['latin'], weight: '400' })

const { provider } = configureChains(
  [chainUtils.chain],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider
})

export default function PriorityPage() {
  console.log('PriorityPage')

  const router = useRouter()
  const address = router.query.address
  console.log('address:', address)

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
        <div id='header' className='md:flex p-6 bg-black rounded-xl border-4 border-black border-l-gray-700 border-r-gray-700'>
          <div className='md:w-2/3 flex'>
            <DAOAddress priorityAddress={address} />
          </div>
          <div className='text-center md:text-right md:w-1/3'>
            <EthereumAccount />
          </div>
        </div>

        <div id='priority' className='md:flex p-6 bg-black rounded-xl border-4 border-black border-l-gray-700 border-r-gray-700'>
          <Priority address={address} />
        </div>

        <div id='content' className='mt-4'>
          <EpochIndex priorityAddress={address} />
        </div>
      </main>
    </WagmiConfig>
  )
}

function DAOAddress({ priorityAddress }: any) {
  console.log('DAO')

  console.log('DAOAddress:', DAOAddress)

  const { data, isError, isLoading } = useContractRead({
    address: priorityAddress,
    abi: Sector3DAOPriority.abi,
    functionName: 'dao'
  })
  console.log('data:', data)

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
        &nbsp;<code>{address?.substring(0, 6)}...{address?.slice(-4)}</code>
      </div>
    </button>
  )
}

function Priority({ address }: any) {
  console.log('Priority')

  const priorityContract = {
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
      }
    ]
  })
  console.log('data:', data)

  let priority = null
  if (data) {
    priority = {
      title: data[0],
      rewardToken: data[1],
      startDate: new Date(Number(data[2]) * 1_000).toISOString().substring(0, 10),
      epochDuration: data[3],
      epochBudget: ethers.utils.formatUnits(String(data[4]))
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
        <>{priority.epochBudget} <code>$TOKEN_NAME</code> per {priority.epochDuration} days</>
      </div>
    </>
  )
}

function EpochIndex({ priorityAddress }: any) {
  console.log('EpochIndex')

  const { data: epochIndex, isError, isLoading } = useContractRead({
    address: priorityAddress,
    abi: Sector3DAOPriority.abi,
    functionName: 'getEpochIndex'
  })
  console.log('epochIndex:', epochIndex)

  if (!useIsMounted() || (epochIndex == undefined)) {
    return (
      <div className="flex items-center text-gray-400">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  }
  return <Epochs priorityAddress={priorityAddress} epochIndex={epochIndex} />
}

function Epochs({ priorityAddress, epochIndex }: any) {
  console.log('Epochs')

  console.log('priorityAddress:', priorityAddress)
  console.log('epochIndex:', epochIndex)

  const priorityContract = {
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
        functionName: 'getEpochIndex'
      }
    ]
  })
  console.log('data:', data)

  let priority: any = null
  if (data) {
    priority = {
      address: priorityAddress,
      title: data[0],
      rewardToken: data[1],
      startTime: Number(data[2]),
      startDate: new Date(Number(data[2]) * 1_000).toISOString().substring(0, 10),
      epochDuration: Number(data[3]),
      epochBudget: ethers.utils.formatUnits(String(data[4])),
      epochIndex: data[5]
    }
  }
  console.log('priority:', priority)

  let epochs: any[] = []
  if (priority) {
    const epochCount: Number = epochIndex + 1
    console.log('epochCount:', epochCount)
    let index = epochIndex;
    while (index >= 0) {
      console.log('index:', index)

      const epoch = {
        index: Number(index),
        startTime: priority.startTime + (index * priority.epochDuration * 24*60*60),
        startDate: new Date(Number(priority.startTime + (index * priority.epochDuration * 24*60*60)) * 1_000).toISOString().substring(0, 10),
        endTime: priority.startTime + ((index + 1) * priority.epochDuration * 24*60*60),
        endDate: new Date(Number(priority.startTime + ((index + 1) * priority.epochDuration * 24*60*60)) * 1_000).toISOString().substring(0, 10),
      }
      epochs[epochs.length] = epoch

      index--
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
        <h3 className='text-xl font-bold mb-2'>Epoch #{priority.epochIndex + 1}</h3>
          From <b>{epochs[0].startDate}</b> to <b>{epochs[0].endDate}</b><br />

          <Link href={`/v0/priorities/${priority.address}/epochs/${priority.epochIndex}`}>
            <button className='mt-4 px-4 py-2 text-white font-semibold rounded-xl bg-gray-700 hover:bg-gray-600'>⏳ Report Contributions</button>
          </Link>
        </div>
      </div>

      <div className='container mt-8'>
        <h2 className="text-2xl text-gray-400">Past Epochs</h2>
      </div>

      <div className='container'>
        {(epochs.length < 2) ? (
          <div className='text-gray-400'>
            No data
          </div>
        ) : (
          epochs.map((epoch: any, index: number) => (
            (index == 0) ? (
              // Skip current epoch
              null
            ) : (
              <div key={index} className='mt-4 p-6 bg-gray-800 rounded-xl'>
                <h3 className='text-xl font-bold mb-2'>Epoch #{priority.epochIndex + 1 - index}</h3>
                From <b>{epoch.startDate}</b> to <b>{epoch.endDate}</b><br />

                <Link href={`/v0/priorities/${priority.address}/epochs/${priority.epochIndex - index}`}>
                  <button className='mt-4 px-4 py-2 text-white font-semibold rounded-xl bg-gray-700 hover:bg-gray-600'>⌛️ View Contributions</button>
                </Link>
              </div>
            )
          ))
        )}
      </div>
    </div>
  )
}
