import Head from 'next/head'
import Image from 'next/image'
import { PT_Mono } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { chainUtils } from '@/utils/ChainUtils'
import { configureChains, createClient, useAccount, useConnect, useContractRead, useContractReads, useDisconnect, WagmiConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from '@wagmi/core/providers/public'
import Sector3DAO from '../../../../../../abis/v1/Sector3DAO.json'
import Sector3DAOPriority from '../../../../../../abis/v1/Sector3DAOPriority.json'
import { ethers } from 'ethers'
import Link from 'next/link'
import { config } from '@/utils/Config'
import { useRouter } from 'next/router'
import { useIsMounted } from '@/hooks/useIsMounted'
import ContributionDialog from '@/components/v1/ContributionDialog'
import { useState } from 'react'
import DAO from '@/components/v1/DAO'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import ERC721Details from '@/components/v1/ERC721Details'
import ERC20Details from '@/components/v1/ERC20Details'
import Epoch from '@/components/v1/Epoch'

const font = PT_Mono({ subsets: ['latin'], weight: '400' })

const { provider } = configureChains(
  [chainUtils.chain],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider
})

export default function EpochPage() {
  console.log('EpochPage')

  const router = useRouter()
  const { address, epochNumber } = router.query
  console.log('address:', address)
  console.log('epochNumber:', epochNumber)

  return (
    <WagmiConfig client={client}>
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

        <div id='epoch' className='md:flex p-6 bg-black rounded-xl border-4 border-black border-l-gray-700 border-r-gray-700'>
          <Epoch priorityAddress={address} epochNumber={epochNumber} />
        </div>

        <div id='content' className='mt-8'>
          <Contributions priorityAddress={address} epochNumber={epochNumber} />
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
      title: data[0],
      rewardToken: data[1],
      startDate: new Date(Number(data[2]) * 1_000).toISOString().substring(0, 10),
      epochDuration: data[3],
      epochBudget: ethers.utils.formatUnits(String(data[4])),
      gatingNFT: data[5]
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

      {(priority.gatingNFT != ethers.constants.AddressZero) && (
        <div className='mt-4 border-2 border-amber-900 text-amber-600 rounded-lg p-2'>
          <ShieldCheckIcon className='inline h-10 w-10' /> <b>Note:</b>  To contribute to this priority, you need to be 
          the owner of an NFT: <ERC721Details address={priority.gatingNFT} />
        </div>
      )}
    </>
  )
}

function Contributions({ priorityAddress, epochNumber }: any) {
  console.log('Contributions')

  console.log('priorityAddress:', priorityAddress)
  console.log('epochNumber:', epochNumber)

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

  const { data: contributionsData, isError, isLoading } = useContractRead({
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
        <button disabled={!isConnected} 
                className='disabled:text-gray-600 disabled:bg-gray-400 float-right px-4 py-2 font-semibold bg-indigo-800 hover:bg-indigo-700 rounded-xl'
                onClick={() => setReportButtonClicked(true)}>
          + Report Contribution
        </button>

        {isReportButtonClicked && (
          <ContributionDialog priorityTitle={priorityTitle} />
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
            <div key={index} className={`md:flex md:space-x-6 p-6 mt-4 bg-gray-800 rounded-xl border-4 border-gray-800 ${alignmentBorderColors[contribution.alignmentPercentage / 20]}`}>
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
                  <span className={`font-bold ${alignmentTextColors[contribution.alignmentPercentage / 20]}`}>{alignmentValues[contribution.alignmentPercentage / 20]}</span><br />
                </div>

                <div className='mt-4'>
                  <label className='text-gray-400'>Contribution date</label><br />
                  {new Date(contribution.timestamp.toNumber() * 1000).toISOString().substring(0, 10)}
                  <br />
                </div>
              </div>

              <div className='md:w-1/2'>
                <div className='mt-4 md:mt-0'>
                  <label className='text-gray-400'>Description</label>
                  <blockquote className={`p-4 border-l-2 ${alignmentBorderColors[contribution.alignmentPercentage / 20]} bg-gray-700 rounded-lg`}>
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
          <Allocations priorityAddress={priorityAddress} epochNumber={epochNumber} contributions={contributions} />
        )}
      </div>
    </>
  )
}

function Allocations({ priorityAddress, epochNumber, contributions }: any) {
  console.log('Allocations')

  console.log('priorityAddress:', priorityAddress)
  console.log('epochNumber:', epochNumber)
  console.log('contributions:', contributions)

  const priorityContract = {
    address: priorityAddress,
    abi: Sector3DAOPriority.abi
  }

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
    console.log('epochNumber:', epochNumber)
    const contributor = allocationPercentagesKeys[i]
    console.log('contributor:', contributor)
    contracts[i] = {
      ...priorityContract,
      functionName: 'getAllocationPercentage',
      args: [epochNumber, contributor]
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
      const allocationPercentage = ethers.utils.formatUnits(String(data[i]))
      console.log('allocationPercentage:', allocationPercentage)
      allocationPercentages[contributor] = allocationPercentage
    }
    console.log('allocationPercentages (after contract call):', allocationPercentages)
  }

  const { data: priorityData } = useContractReads({
    contracts: [
      {
        ...priorityContract,
        functionName: 'epochBudget'
      },
      {
        ...priorityContract,
        functionName: 'rewardToken'
      }
    ]
  })
  console.log('priorityData:', priorityData)
  let priorityBudgetInEther: any = null;
  let priorityRewardToken: any = null;
  if (priorityData) {
    priorityBudgetInEther = ethers.utils.formatUnits(String(priorityData[0]));
    priorityRewardToken = priorityData[1];
  }
  console.log('priorityBudgetInEther:', priorityBudgetInEther)
  console.log('priorityRewardToken:', priorityRewardToken)

  if (!useIsMounted() || !allocationPercentages || !priorityBudgetInEther) {
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
            <div key={contributor} className='flex mb-4 text-center'>
              <div className='w-1/2 flex flex-col md:flex-row'>
                <div className='md:w-1/2 flex'>
                  <img
                    className="h-6 w-6 bg-gray-700 rounded-full"
                    src={`https://cdn.stamp.fyi/avatar/eth:${contributor}?s=128`}
                  />&nbsp;
                  <code>{contributor.substring(0, 6)}...{contributor.slice(-4)}</code>
                </div>
                <div className='md:w-1/2'>
                  <div className="h-6 bg-gray-900 rounded-full">
                    <div className={`w-[${Math.round(allocationPercentages[contributor])}%] h-full text-right px-2 bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-full`}>
                      {Number(allocationPercentages[contributor]).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-1/2 flex flex-col md:flex-row text-right'>
                <div className='md:w-1/2'>
                  {(allocationPercentages[contributor] * priorityBudgetInEther / 100).toFixed(2)} <ERC20Details address={priorityRewardToken} />
                </div>
                <div className='md:w-1/2'>
                  <button disabled={true} 
                    className='disabled:text-gray-600 disabled:bg-gray-400 px-3 py-1 text-sm font-bold bg-indigo-800 hover:bg-indigo-700 rounded-xl'>
                    Claim Reward
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
