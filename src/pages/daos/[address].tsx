import Head from 'next/head'
import Image from 'next/image'
import { PT_Mono } from '@next/font/google'
import { config } from '@/utils/Config'
import { chainUtils } from '@/utils/ChainUtils'
import { configureChains, createClient, readContract, readContracts } from '@wagmi/core'
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

export default function DAO({ dao, priorities }: any) {
  console.log('DAO')

  console.log('dao:', dao)
  console.log('priorities:', priorities)

  const headTitle = 'Sector#3 / ' + dao.name
  const headDescription = 'Purpose: ' + dao.purpose

  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <video id="background-video" autoPlay loop muted poster="https://pbs.twimg.com/tweet_video_thumb/FpM9CcwagAIiRD7.jpg">
        {/* <source src="https://video.twimg.com/tweet_video/FpM9CcwagAIiRD7.mp4" type="video/mp4" /> */}
      </video>

      <main className='p-2 sm:p-4 md:p-8 lg:p-16 xl:p-32 2xl:p-64'>
        <div id='header' className='md:flex p-6 bg-black rounded-xl'>
          <div className='md:w-2/3 flex'>
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
          <div className='text-center md:text-right md:w-1/3'>
            <button className='rounded-xl text-xl font-bold bg-indigo-800 hover:bg-indigo-700 px-4 py-2'>
              ♦ Connect
            </button>
          </div>
        </div>

        <div className='container mt-4'>
          <Link href={`${config.etherscanDomain}/address/${dao.address}#writeContract#F1`} target='_blank'>
            <button className='float-right px-4 py-2 font-semibold text-indigo-200 bg-indigo-800 hover:bg-indigo-700 rounded-xl'>Add Priority</button>
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
      </main>
    </>
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

  const daoContract = {
    address: address,
    abi: Sector3DAO.abi
  }

  const daoData = await readContracts({
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

  let priorityAddresses: any[] = []

  const priorityCount: Number = Number(daoData[2])
  console.log('priorityCount:', priorityCount)
  let priorityIndex = 0;
  while (priorityIndex < priorityCount) {
    console.log('priorityIndex:', priorityIndex)

    const priorityData = await readContract({
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

    const priorityData = await readContracts({
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

  const dao = {
    name: daoData[0],
    purpose: daoData[1],
    address: address
  }

  return {
    props: {
      dao: dao,
      priorities: priorities
    },
    revalidate: 60
  }
}
