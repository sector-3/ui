import Head from 'next/head'
import Image from 'next/image'
import { PT_Mono } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { configureChains, goerli, createClient, readContract, readContracts, Address } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import Sector3DAO from '../../../../../abis/Sector3DAO.json'
import Sector3DAOPriority from '../../../../../abis/Sector3DAOPriority.json'
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

export default function Priority({ dao, priority, epoch, contributions, allocationPercentages }: any) {
  console.log('Priority')

  console.log('dao:', dao)
  console.log('priority:', priority)
  console.log('epoch:', epoch)
  console.log('contributions:', contributions)
  console.log('allocationPercentages:', allocationPercentages)

  const headTitle = 'Sector#3 / ' + dao.name + ' / ' + priority.title + ' / Epoch ' + epoch.index
  const headDescription = 'Epoch ' + epoch.index

  const alignmentValues = ['None ☆☆☆☆☆', 'Barely ★☆☆☆☆', 'Moderately ★★☆☆☆', 'Mostly ★★★☆☆', 'Perfectly ★★★★★']
  const alignmentTextColors = ['text-red-400', 'text-orange-400', 'text-amber-400', 'text-lime-400', 'text-emerald-400' ]
  const alignmentBorderColors = ['border-l-red-400', 'border-l-orange-400', 'border-l-amber-400', 'border-l-lime-400', 'border-l-emerald-400' ]
  
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
          {(epoch.index == priority.epochIndex) ? (
            <p>
              Current Epoch: From <b>{epoch.startDate}</b> to <b>{epoch.endDate}</b>
            </p>
          ) : (
            <p>
              Past Epoch: From <b>{epoch.startDate}</b> to <b>{epoch.endDate}</b>
            </p>
          )}
        </div>

        <div className='container mt-4'>
          {(epoch.index == priority.epochIndex) ? (
            <Link href={`https://goerli.etherscan.io/address/${priority.address}#writeContract#F1`} target='_blank'>
              <button className='float-right px-4 py-2 font-semibold text-indigo-200 bg-indigo-800 hover:bg-indigo-700 rounded-xl'>Add Contribution</button>
            </Link>
          ) : null}

          <h2 className="text-2xl text-gray-400">Contributions:</h2>
        </div>

        <div className='container'>
          {(contributions.length == 0) ? (
            <div className='text-gray-400'>
              No data
            </div>
          ) : (
            contributions.map((contribution: any, index: number) => (
              <div key={index} className={`mt-4 p-6 bg-gray-800 rounded-xl border-4 border-gray-800 ${alignmentBorderColors[contribution.alignment]}`}>
                <div className='flex'>
                  Contributor:&nbsp;
                  <img
                    className="h-6 w-6 bg-gray-700 rounded-full"
                    src={`https://cdn.stamp.fyi/avatar/eth:${contribution.contributor}?s=128`}
                  />&nbsp;
                  <code>{contribution.contributor.substring(0, 6)}...{contribution.contributor.slice(-4)}</code><br />
                </div>
                Description: <b>&quot;{contribution.description}&quot;</b><br />
                Alignment with priority: <span className={`font-bold ${alignmentTextColors[contribution.alignment]}`}>{alignmentValues[contribution.alignment]}</span><br />
                Hours spent: <code>{contribution.hoursSpent}h</code>
              </div>
            ))
          )}
        </div>

        <div className='container mt-8'>
          <h2 className="text-2xl text-gray-400">Reward Allocation per Contributor:</h2>
        </div>

        <div className='container'>
          { (Object.keys(allocationPercentages).length == 0) ? (
            <div className='text-gray-400'>
              No data
            </div>
          ) : (
            <div className='mt-4 p-6 pb-2 bg-gray-800 rounded-xl'>
              {Object.keys(allocationPercentages).map((contributor) => (
                <div key={contributor} className='flex mb-4'>
                  <img
                    className="h-6 w-6 bg-gray-700 rounded-full"
                    src={`https://cdn.stamp.fyi/avatar/eth:${contributor}?s=128`}
                  />&nbsp;
                  <code>{contributor.substring(0, 6)}...{contributor.slice(-4)}</code>&nbsp;
                  <div className="ml-10 h-6 w-full bg-indigo-400 rounded-full">
                    <div className={`w-[${allocationPercentages[contributor]}%] h-full text-center text-white bg-indigo-600 rounded-full`}>
                      {(allocationPercentages[contributor] * priority.epochBudget / 100).toFixed(2)} {/*<code>$TOKEN_NAME</code>*/}
                    </div>
                  </div>&nbsp;
                  <div className='w-1/6 text-right'>{(allocationPercentages[contributor]).toFixed(2)}%</div>
                </div>
              ))}
            </div>
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
      { params: { address: '0x90568B9Ba334b992707E0580505260BFdA4F8C67', epochIndex: '0' } },
      { params: { address: '0x90568B9Ba334b992707E0580505260BFdA4F8C67', epochIndex: '1' } },
      { params: { address: '0x90568B9Ba334b992707E0580505260BFdA4F8C67', epochIndex: '2' } },
      { params: { address: '0xd7aC7a02F171DDA4435Df9d4556AC92F388130Cb', epochIndex: '0' } }
    ],
    fallback: 'blocking'
  }
}

export async function getStaticProps(context: any) {
  console.log('getStaticProps')

  const address = context.params.address
  console.log('address:', address)

  const epochIndex = context.params.epochIndex
  console.log('epochIndex:', epochIndex)

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
      },
      {
        ...priorityContract,
        functionName: 'getContributionCount'
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
    epochIndex: priorityData[6],
    contributionCount: priorityData[7]
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

  const epoch = {
    index: Number(epochIndex),
    startTime: priority.startTime + (epochIndex * priority.epochDuration * 24*60*60),
    startDate: new Date(Number(priority.startTime + (epochIndex * priority.epochDuration * 24*60*60)) * 1_000).toISOString().substring(0, 10),
    endTime: priority.startTime + ((epochIndex + 1) * priority.epochDuration * 24*60*60),
    endDate: new Date(Number(priority.startTime + ((epochIndex + 1) * priority.epochDuration * 24*60*60)) * 1_000).toISOString().substring(0, 10),
  }

  let contributions: any[] = []
  let contributionIndex = priority.contributionCount - 1
  while (contributionIndex >= 0) {
    console.log('contributionIndex:', contributionIndex)

    const contributionData: any = await readContract({
      address: address,
      abi: Sector3DAOPriority.abi,
      functionName: 'getContribution',
      args: [contributionIndex]
    })
    console.log('contributionData:', contributionData)
    if (contributionData.epochIndex == epochIndex) {
      const contribution = {
        contributor: contributionData.contributor,
        description: contributionData.description,
        alignment: contributionData.alignment,
        hoursSpent: contributionData.hoursSpent
      }
      contributions[contributions.length] = contribution
    }

    contributionIndex--
  }

  let allocationPercentages: any = {}
  for (const contribution of contributions) {
    if (!allocationPercentages[contribution.contributor]) {
      allocationPercentages[contribution.contributor] = 0
    }
  }
  for (const contributor in allocationPercentages) {
    console.log('contributor:', contributor)
    const allocationPercentageData = await readContract({
      address: address,
      abi: Sector3DAOPriority.abi,
      functionName: 'getAllocationPercentage',
      args: [epochIndex, contributor]
    })
    console.log('allocationPercentageData:', allocationPercentageData)
    allocationPercentages[contributor] = allocationPercentageData
  }

  return {
    props: {
      dao: dao,
      priority: priority,
      epoch: epoch,
      contributions: contributions,
      allocationPercentages: allocationPercentages
    }
  }
}
