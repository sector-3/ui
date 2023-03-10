import Head from 'next/head'
import Image from 'next/image'
import { PT_Mono } from '@next/font/google'
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
import { useState } from 'react'
import PriorityDialog from '@/components/v0/PriorityDialog'

const font = PT_Mono({ subsets: ['latin'], weight: '400' })

const { provider } = configureChains(
  [chainUtils.chain],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider
})

export default function DaoPage() {
  console.log('DaoPage')

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
            <DAO address={address} />
          </div>
          <div className='text-center md:text-right md:w-1/3'>
            <EthereumAccount />
          </div>
        </div>

        <div id='content' className='mt-8'>
          <PriorityCount daoAddress={address} />
        </div>
      </main>
    </WagmiConfig>
  )
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

function PriorityCount({ daoAddress }: any) {
  console.log('PriorityCount')

  const { isConnected } = useAccount()
  console.log('isConnected:', isConnected)

  const [isPriorityButtonClicked, setPriorityButtonClicked] = useState(false)
  console.log('isPriorityButtonClicked:', isPriorityButtonClicked)

  const { data: priorityCount, isError, isLoading } = useContractRead({
    address: daoAddress,
    abi: Sector3DAO.abi,
    functionName: 'getPriorityCount'
  })
  console.log('priorityCount:', priorityCount)

  if (!useIsMounted() || (priorityCount == undefined)) {
    return (
      <div className="flex items-center text-gray-400">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  } else if (priorityCount == 0) {
    return (
      <>
        <div className='container'>
          {/* <Link href={`${config.etherscanDomain}/address/${daoAddress}#writeContract#F1`} target='_blank'> */}
            <button disabled={!isConnected} 
              className='disabled:text-gray-600 disabled:bg-gray-400 float-right px-4 py-2 font-semibold text-indigo-200 bg-indigo-800 hover:bg-indigo-700 rounded-xl'
              onClick={() => setPriorityButtonClicked(true)}
            >
              + Add Priority
            </button>
          {/* </Link> */}


          {isPriorityButtonClicked && (
            <PriorityDialog />
          )}

          <h2 className="text-2xl text-gray-400">Priorities</h2>
        </div>

        <div className='container'>
          <div className='text-gray-400 mt-4'>
            No data
          </div>
        </div>
      </>
    )
  }
  return <Priorities daoAddress={daoAddress} priorityCount={priorityCount} />
}

function Priorities({ daoAddress, priorityCount }: any) {
  console.log('Priorities')

  console.log('daoAddress:', daoAddress)
  console.log('priorityCount:', priorityCount)

  const { isConnected } = useAccount()
  console.log('isConnected:', isConnected)

  const [isPriorityButtonClicked, setPriorityButtonClicked] = useState(false)
  console.log('isPriorityButtonClicked:', isPriorityButtonClicked)

  let contracts: any = [priorityCount]
  for (let i = 0; i < Number(priorityCount); i++) {
    console.log('i:', i)
    const daoContract = {
      address: daoAddress,
      abi: Sector3DAO.abi
    }
    contracts[i] = {
      ...daoContract,
      functionName: 'priorities',
      args: [i]
    }
  }
  console.log('contracts:', contracts)

  const { data, isError, isLoading } = useContractReads({
    contracts: contracts
  })
  console.log('data:', data)

  let priorityAddresses: any = null
  if (data != undefined) {
    priorityAddresses = data
  }
  console.log('priorityAddresses:', priorityAddresses)

  if (!useIsMounted() || !priorityAddresses) {
    return (
      <div className="flex items-center text-gray-400">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  }

  return (
    <div>
      <div className='container'>
        {/* <Link href={`${config.etherscanDomain}/address/${daoAddress}#writeContract#F1`} target='_blank'> */}
          <button disabled={!isConnected} 
            className='disabled:text-gray-600 disabled:bg-gray-400 float-right px-4 py-2 font-semibold text-indigo-200 bg-indigo-800 hover:bg-indigo-700 rounded-xl'
            onClick={() => setPriorityButtonClicked(true)}
          >
            + Add Priority
          </button>
        {/* </Link> */}


        {isPriorityButtonClicked && (
          <PriorityDialog />
        )}

        <h2 className="text-2xl text-gray-400">Priorities</h2>
      </div>

      <div className='container'>
        {
          priorityAddresses.slice(0).reverse().map((priorityAddress: any) => (
            <div key={priorityAddress}>
              <Priority priorityAddress={priorityAddress} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

function Priority({ priorityAddress }: any ) {
  console.log('Priority')

  console.log('priorityAddress:', priorityAddress)

  const priorityContract = {
    address: priorityAddress,
    abi: Sector3DAOPriority.abi
  }

  const { data: priorityData, isError, isLoading } = useContractReads({
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
  console.log('priorityData:', priorityData)
  console.log('isError:', isError)
  console.log('isLoading:', isLoading)

  if (!useIsMounted() || (priorityData == undefined)) {
    return (
      <div className="mt-4 p-6 bg-gray-800 flex items-center text-gray-400">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  }
  
  const priority: any = {
    address: priorityAddress,
    title: priorityData[0],
    rewardToken: priorityData[1],
    startDate: new Date(Number(priorityData[2]) * 1_000).toISOString().substring(0, 10),
    epochDuration: priorityData[3],
    epochBudget: ethers.utils.formatUnits(String(priorityData[4]))
  }
  return (
    <div className='mt-4 p-6 bg-gray-800 rounded-xl'>
      <h3 className='text-xl font-bold mb-2'>{priority.title}</h3>
      Reward token: <code>{priority.rewardToken}</code><br />
      Epoch budget: {priority.epochBudget} <code>$TOKEN_NAME</code> per {priority.epochDuration} days<br />
      Start date: {priority.startDate}<br />

      <Link href={`/v0/priorities/${priority.address}`}>
        <button className='mt-4 px-4 py-2 text-gray-200 font-semibold rounded-xl bg-gray-700 hover:bg-gray-600'>⏱️ View Epochs</button>
      </Link>
    </div>
  )
}
