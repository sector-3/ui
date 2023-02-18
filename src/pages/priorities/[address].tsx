import Head from 'next/head'
import Image from 'next/image'
import { PT_Mono } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { configureChains, goerli, createClient, readContract, readContracts, Address } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import Sector3DAO from '../../../abis/Sector3DAO.json'
import Sector3DAOPriority from '../../../abis/Sector3DAOPriority.json'
import { ethers } from 'ethers'
import Link from 'next/link'

const font = PT_Mono({ subsets: ['latin'], weight: '400' })

const { provider } = configureChains(
  [goerli],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider
})

export default function Priority({ dao, priority, epochs }: any) {
  console.log('Priority')

  console.log('dao:', dao)
  console.log('priority:', priority)
  console.log('epochs:', epochs)

  const headTitle = 'Sector#3 / ' + dao.name + ' / ' + priority.title
  const headDescription = priority.title

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

      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            <Image
              alt="Logo"
              width={64}
              height={64}
              src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
            /> <b>{dao.name}</b> {dao.purpose}
          </p>
          <p>
            Priority: <b>{priority.title}</b><br />
            Reward token: <code>{priority.rewardToken}</code><br />
            Epoch budget: {priority.epochBudget} per {priority.epochDuration} days<br />
            Start date: {priority.startDate}
          </p>
        </div>

        <div className='container mt-4'>
          <h2 className="text-2xl text-gray-400">⏳ Current Epoch:</h2>
        </div>

        <div className='container'>
          <div className='mt-4 p-6 bg-gray-800 rounded-xl'>
            From <b>{epochs[0].startDate}</b> to <b>{epochs[0].endDate}</b><br />

            <Link href={`/priorities/${priority.address}/0`}>
              <button className='mt-4 px-4 py-2 text-white font-semibold rounded-xl bg-gray-700 hover:bg-gray-600'>View Contributions 😅</button>
            </Link>
          </div>
        </div>

        <div className='container mt-4'>
          <h2 className="text-2xl text-gray-400">⌛️ Past Epochs:</h2>
        </div>

        <div className='container'>
          {(epochs.length < 2) ? (
            <div className='text-gray-400'>
              Zero, zip, nil...
            </div>
          ) : (
            epochs.map((epoch: any, index: number) => (
              (index == 0) ? (
                // Skip current epoch
                null
              ) : (
                <div key={index} className='mt-4 p-6 bg-gray-800 rounded-xl'>
                  From <b>{epoch.startDate}</b> to <b>{epoch.endDate}</b><br />

                  <Link href={`/priorities/${priority.address}/${index}`}>
                    <button className='mt-4 px-4 py-2 text-white font-semibold rounded-xl bg-gray-700 hover:bg-gray-600'>View Contributions 😴</button>
                  </Link>
                </div>
              )
            ))
          )}
        </div>
      </main>
    </>
  )
}

export async function getStaticPaths() {
  console.log('getStaticPaths')

  return {
    paths: [
      { params: { address: '0x90568B9Ba334b992707E0580505260BFdA4F8C67' } },
      { params: { address: '0xd7aC7a02F171DDA4435Df9d4556AC92F388130Cb' } }
    ],
    fallback: 'blocking'
  }
}

export async function getStaticProps(context: any) {
  console.log('getStaticProps')

  const address = context.params.address
  console.log('address:', address)

  const priorityContract = {
    address: address,
    abi: Sector3DAOPriority.abi
  }

  const priorityData = await readContracts({
    contracts: [
      {
        ...priorityContract,
        functionName: 'dao'
      },
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
  console.log('priorityData:', priorityData)

  const priority: any = {
    address: address,
    dao: priorityData[0],
    title: priorityData[1],
    rewardToken: priorityData[2],
    startTime: Number(priorityData[3]),
    startDate: new Date(Number(priorityData[3]) * 1_000).toISOString().substring(0, 10),
    epochDuration: priorityData[4],
    epochBudget: ethers.utils.formatUnits(String(priorityData[5])),
    epochIndex: priorityData[6]
  }

  const daoContract = {
    address: priority.dao,
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

  const dao = {
    name: daoData[0],
    purpose: daoData[1],
    address: address
  }

  let epochs: any[] = []
  const epochCount: Number = priority.epochIndex + 1
  console.log('epochCount:', epochCount)
  let epochIndex = priority.epochIndex;
  while (epochIndex >= 0) {
    console.log('epochIndex:', epochIndex)

    const epoch = {
      startTime: priority.startTime + (epochIndex * priority.epochDuration * 24*60*60),
      startDate: new Date(Number(priority.startTime + (epochIndex * priority.epochDuration * 24*60*60)) * 1_000).toISOString().substring(0, 10),
      endTime: priority.startTime + ((epochIndex + 1) * priority.epochDuration * 24*60*60),
      endDate: new Date(Number(priority.startTime + ((epochIndex + 1) * priority.epochDuration * 24*60*60)) * 1_000).toISOString().substring(0, 10),
    }
    epochs[epochs.length] = epoch

    epochIndex--
  }

  return {
    props: {
      dao: dao,
      priority: priority,
      epochs: epochs
    }
  }
}
