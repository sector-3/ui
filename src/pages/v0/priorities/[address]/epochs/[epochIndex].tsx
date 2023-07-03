import Head from 'next/head'
import Image from 'next/image'
import { PT_Mono } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { chainUtils } from '@/utils/ChainUtils'
import { configureChains, createConfig, useAccount, useConnect, useContractRead, useContractReads, useDisconnect, WagmiConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from '@wagmi/core/providers/public'
import Sector3DAO from '../../../../../../abis/v0/Sector3DAO.json'
import Sector3DAOPriority from '../../../../../../abis/v0/Sector3DAOPriority.json'
import { ethers } from 'ethers'
import Link from 'next/link'
import { config } from '@/utils/Config'
import { useRouter } from 'next/router'
import { useIsMounted } from '@/hooks/useIsMounted'
import ContributionDialog from '@/components/v0/ContributionDialog'
import { useState } from 'react'
import DAO from '@/components/v0/DAO'

const font = PT_Mono({ subsets: ['latin'], weight: '400' })

const { publicClient } = configureChains(
  [chainUtils.chain],
  [publicProvider()]
)

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient
})

export default function EpochPage() {
  console.log('EpochPage')

  const router = useRouter()
  const { address, epochIndex } = router.query
  console.log('address:', address)
  console.log('epochIndex:', epochIndex)

  return (
    <WagmiConfig config={wagmiConfig}>
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

        <div id='priority' className='md:flex p-6 bg-black rounded-xl border-4 border-black border-l-gray-700 border-r-gray-700'>
          <Priority address={address} />
        </div>

        <div id='epoch' className='md:flex p-6 bg-black rounded-xl border-4 border-black border-l-gray-700 border-r-gray-700'>
          Epoch #{Number(epochIndex) + 1}
        </div>

        <div id='content' className='mt-8'>
          <Contributions priorityAddress={address} epochIndex={epochIndex} />
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

  const { address, isConnected } = useAccount()
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
      epochBudget: ethers.utils.formatUnits(String(data[4].result))
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

function Contributions({ priorityAddress, epochIndex }: any) {
  console.log('Contributions')

  console.log('priorityAddress:', priorityAddress)
  console.log('epochIndex:', epochIndex)

  const { isConnected } = useAccount()
  console.log('isConnected:', isConnected)

  const [isReportButtonClicked, setReportButtonClicked] = useState(false)
  console.log('isReportButtonClicked:', isReportButtonClicked)

  const priorityContract = {
    address: priorityAddress,
    abi: Sector3DAOPriority.abi
  }

  const { data: priorityTitleData } = useContractRead({
    ...priorityContract,
    functionName: 'title'
  })
  console.log('priorityTitleData:', priorityTitleData)
  let priorityTitle: any = null
  if (priorityTitleData != undefined) {
    priorityTitle = priorityTitleData
  }
  console.log('priorityTitle:', priorityTitle)

  const { data: contributionsData, refetch: refetchContributions, isError, isLoading } = useContractRead({
    ...priorityContract,
    functionName: 'getContributions'
  })
  console.log('contributionsData:', contributionsData)

  let contributions: any = null
  if (contributionsData != undefined) {
    contributions = contributionsData
  }
  console.log('contributions:', contributions)

  if (!useIsMounted() || !contributions || !priorityTitle) {
    return (
      <div className="flex items-center text-gray-400">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  }

  const alignmentValues = ['☆☆☆☆☆ None', '★☆☆☆☆ Barely', '★★☆☆☆ Moderately', '★★★☆☆ Mostly', '★★★★☆ Highly', '★★★★★ Perfectly']
  const alignmentTextColors = ['text-red-400', 'text-orange-400', 'text-amber-400', 'text-lime-400', 'text-emerald-400', 'text-cyan-400' ]
  const alignmentBorderColors = ['border-l-red-400', 'border-l-orange-400', 'border-l-amber-400', 'border-l-lime-400', 'border-l-emerald-400', 'border-l-cyan-400' ]
  return (
    <>
      <div className='container mt-8'>
        {/* {(epoch.index == priority.epochIndex) ? ( */}
          {/* <Link href={`${config.etherscanDomain}/address/${priorityAddress}#writeContract#F1`} target='_blank'> */}
            <button disabled={!isConnected} 
                    className='disabled:text-gray-600 disabled:bg-gray-400 float-right px-4 py-2 font-semibold text-indigo-200 bg-indigo-800 hover:bg-indigo-700 rounded-xl'
                    onClick={() => setReportButtonClicked(true)}>
              + Report Contribution
            </button>
          {/* </Link> */}
        {/* ) : null} */}

        {isReportButtonClicked && (
          <ContributionDialog priorityTitle={priorityTitle} refetchContributions={refetchContributions} />
        )}

        <h2 className="text-2xl text-gray-400">Contributions</h2>
      </div>

      <div className='container'>
        {(contributions.length == 0) ? (
          <div className='text-gray-400 mt-4'>
            No data
          </div>
        ) : (
          contributions.slice(0).reverse().map((contribution: any, index: number) => (
            <div key={index} className={`md:flex md:space-x-6 p-6 mt-4 bg-gray-800 rounded-xl border-4 border-gray-800 ${alignmentBorderColors[contribution.alignment]}`}>
              <div className='md:w-1/2'>
                <div>
                  <label className='text-gray-400'>Contributor</label>
                  <div className='flex'>
                    <img
                      className="h-6 w-6 bg-gray-700 rounded-full"
                      src={`https://cdn.stamp.fyi/avatar/eth:${contribution.contributor}?s=128`}
                    />&nbsp;
                    <code>{contribution.contributor.substring(0, 6)}...{contribution.contributor.slice(-4)}</code><br />
                  </div>
                </div>

                <div className='mt-4 text-ellipsis overflow-hidden'>
                  <label className='text-gray-400'>Proof of contribution URL</label><br />
                  <Link href={contribution.proofURL} target='_blank' className='text-indigo-400'>
                    {contribution.proofURL}
                  </Link>
                </div>

                <div className='mt-4'>
                  <label className='text-gray-400'>Alignment with priority</label><br />
                  <span className={`font-bold ${alignmentTextColors[contribution.alignment]}`}>{alignmentValues[contribution.alignment]}</span><br />
                </div>
                <div className='mt-4'>
                  <label className='text-gray-400'>Contribution date</label>
                  <br />
                  <span className='font-bold'>
                    {new Date(contribution.timestamp.toNumber() * 1000).toISOString().substring(0, 10)}
                  </span>
                  <br />
                </div>
              </div>
              <div className='md:w-1/2'>
                <div className='mt-4 md:mt-0'>
                  <label className='text-gray-400'>Description</label>
                  <blockquote className={`p-4 border-l-2 ${alignmentBorderColors[contribution.alignment]} bg-gray-700 rounded-lg`}>
                    {contribution.description}
                  </blockquote>
                </div>

                <div className='mt-4'>
                  <label className='text-gray-400'>Hours spent</label><br />
                  <code>{contribution.hoursSpent}h</code>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className='container mt-8'>
        <h2 className="text-2xl text-gray-400">Reward Allocation per Contributor</h2>
      </div>

      <div className='container'>
        {(contributions.length == 0) ? (
          <div className='text-gray-400 mt-4'>
            No data
          </div>
        ) : (
          <Allocations priorityAddress={priorityAddress} epochIndex={epochIndex} contributions={contributions} />
        )}
      </div>
    </>
  )
}

function Allocations({ priorityAddress, epochIndex, contributions }: any) {
  console.log('Allocations')

  console.log('priorityAddress:', priorityAddress)
  console.log('epochIndex:', epochIndex)
  console.log('contributions:', contributions)

  let allocationPercentages: any = null

  // Add unique contributors
  if (contributions.length > 0) {
    allocationPercentages = {}
    for (const contribution of contributions) {
      if (!allocationPercentages[contribution.contributor]) {
        allocationPercentages[contribution.contributor] = 0
      }
    }
  }
  console.log('allocationPercentages:', allocationPercentages)
  const allocationPercentagesKeys = Object.keys(allocationPercentages)
  console.log('allocationPercentagesKeys:', allocationPercentagesKeys)

  let contracts: any = [allocationPercentagesKeys.length]
  for (let i = 0; i < allocationPercentagesKeys.length; i++) {
    console.log('i:', i)
    console.log('epochIndex:', epochIndex)
    const contributor = allocationPercentagesKeys[i]
    console.log('contributor:', contributor)
    const priorityContract = {
      address: priorityAddress,
      abi: Sector3DAOPriority.abi
    }
    contracts[i] = {
      ...priorityContract,
      functionName: 'getAllocationPercentage',
      args: [epochIndex, contributor]
    }
  }
  console.log('contracts:', contracts)

  const { data, isError, isLoading } = useContractReads({
    contracts: contracts
  })
  console.log('data:', data)

  if (data != undefined) {
    for (let i = 0; i < allocationPercentagesKeys.length; i++) {
      const contributor = allocationPercentagesKeys[i]
      console.log('contributor:', contributor)
      const allocationPercentage = data[i]
      console.log('allocationPercentage:', allocationPercentage)
      allocationPercentages[contributor] = allocationPercentage
    }
    console.log('allocationPercentages (after contract call):', allocationPercentages)
  }

  if (!useIsMounted() || !allocationPercentages) {
    return (
      <div className="flex items-center text-gray-400">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  }

  return (
    <div className='container'>
      {(Object.keys(allocationPercentages).length == 0) ? (
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
                  {/* {(allocationPercentages[contributor] * priority.epochBudget / 100).toFixed(2)} <code>$TOKEN_NAME</code> */}
                </div>
              </div>&nbsp;
              <div className='w-1/6 text-right'>{(allocationPercentages[contributor]).toFixed(2)}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
