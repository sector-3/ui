import Head from 'next/head'
import Image from 'next/image'
import { PT_Mono } from '@next/font/google'
import { config } from '@/utils/Config'
import { chainUtils } from '@/utils/ChainUtils'
import { configureChains, createClient, useAccount, useConnect, useContractRead, useContractReads, useDisconnect, WagmiConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from '@wagmi/core/providers/public'
import Sector3DAO from '../../../abis/Sector3DAO.json'
import Sector3DAOPriority from '../../../abis/Sector3DAOPriority.json'
import { ethers } from 'ethers'
import Link from 'next/link'

const font = PT_Mono({ subsets: ['latin'], weight: '400' })

const { provider } = configureChains(
  [chainUtils.chain],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider
})

export default function Page({ address }: any) {
  console.log('Page')

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
        <div id='header' className='md:flex p-6 bg-black rounded-xl'>
          <div className='md:w-2/3 flex'>
            <DAO address={address} />
          </div>
          <div className='text-center md:text-right md:w-1/3'>
            <EthereumAccount />
          </div>
        </div>

        <div id='content' className='mt-4'>
          <Priorities address={address} />
        </div>
      </main>
    </WagmiConfig>
  )
}

function DAO({ address }: any) {
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
        functionName: 'getPriorityCount'
      }
    ]
  })
  console.log('daoData:', daoData)
  console.log('isError:', isError)
  console.log('isLoading:', isLoading)

  let name = null
  let purpose = null
  if (daoData != undefined) {
    name = daoData[0]
    purpose = daoData[1]
  }
  
  const dao = {
    address: address,
    name: name,
    purpose: purpose
  }

  if (!dao.name) {
    return (
      <div className="flex items-center justify-center text-gray-400 pb-6 md:pb-0">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  }

  return (
    <div className='flex'>
      <div className='w-1/6'>
        <Image
          alt="DAO token"
          width={100}
          height={100}
          src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2d94AA3e47d9D5024503Ca8491fcE9A2fB4DA198/logo.png"
        />
      </div>
      <div className='w-5/6 pl-6'>
        <h2 className='text-xl font-bold'>{dao.name}</h2>
        <p className='text-gray-400 pb-6 md:pb-0'>Purpose: {dao.purpose}</p>
      </div>
    </div>
  )
}

function EthereumAccount() {
  console.log('EthereumAccount')

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector()
  })
  const { disconnect } = useDisconnect()

  if (!isConnected) {
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

function Priorities({ address }: any) {
  console.log('Priorities')

  console.log('address:', address)

  const { isConnected } = useAccount();
  console.log('isConnected:', isConnected)

  let priorityAddresses: any[] = []

  const priorityCount: Number = 3 // TODO
  console.log('priorityCount:', priorityCount)
  let priorityIndex = 0;
  while (priorityIndex < priorityCount) {
    console.log('priorityIndex:', priorityIndex)

    const { data: priorityData, isError, isLoading } = useContractRead({
      address: address,
      abi: Sector3DAO.abi,
      functionName: 'priorities',
      args: [priorityIndex]
    })
    console.log('priorityData:', priorityData)
    priorityAddresses[priorityIndex] = priorityData

    priorityIndex++
  }

  let priorities = []
  for (const priorityAddress of priorityAddresses) {
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

    
    if (priorityData != undefined) {
      const priority: any = {
        address: priorityAddress,
        title: priorityData[0],
        rewardToken: priorityData[1],
        startDate: new Date(Number(priorityData[2]) * 1_000).toISOString().substring(0, 10),
        epochDuration: priorityData[3],
        epochBudget: ethers.utils.formatUnits(String(priorityData[4]))
      }
      priorities[priorities.length] = priority
    }
  }


  if (priorities.length == 0) {
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
        <Link href={`${config.etherscanDomain}/address/${address}#writeContract#F1`} target='_blank'>
          <button className='float-right px-4 py-2 font-semibold text-indigo-200 bg-indigo-800 hover:bg-indigo-700 rounded-xl disabled:text-gray-600 disabled:bg-gray-400' disabled={!isConnected}>Add Priority</button>
        </Link>

        <h2 className="text-2xl text-gray-400">🎯 Priorities:</h2>
      </div>

      <div className='container'>
        {
          priorities.map((priority: any, index: number) => (
            <div key={index} className='mt-4 p-6 bg-gray-800 rounded-xl'>
              Title: <b>{priority.title}</b><br />
              Reward token: <code>{priority.rewardToken}</code><br />
              Epoch budget: {priority.epochBudget} per {priority.epochDuration} days<br />
              Start date: {priority.startDate}<br />

              <Link href={`/priorities/${priority.address}`}>
                <button className='mt-4 px-4 py-2 text-white font-semibold rounded-xl bg-gray-700 hover:bg-gray-600'>View Epochs ⏱️</button>
              </Link>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  console.log('getStaticPaths')

  return {
    paths: [
      // { params: { address: '0x66E6Aed398d2BD699214c4580EC6A5D65C223176' } }
    ],
    fallback: 'blocking'
  }
}

export async function getStaticProps(context: any) {
  console.log('getStaticProps')

  const address = context.params.address
  console.log('address:', address)

  return {
    props: {
      address: address
    },
    revalidate: 60
  }
}
