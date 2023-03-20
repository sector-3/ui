import Sector3DAO from '../../../abis/v1/Sector3DAO.json'
import Sector3DAOPriority from '../../../abis/v1/Sector3DAOPriority.json'
import { configureChains, createClient, useAccount, useConnect, useContractRead, useContractReads, useDisconnect, WagmiConfig } from 'wagmi'
import { useIsMounted } from '@/hooks/useIsMounted'
import Image from 'next/image'

export default function Epoch({ priorityAddress, epochNumber }: any) {
  console.log('Epoch')

  console.log('priorityAddress:', priorityAddress)
  console.log('epochNumber:', epochNumber)

  const priorityContract = {
    address: priorityAddress,
    abi: Sector3DAOPriority.abi
  }

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...priorityContract,
        functionName: 'startTime'
      },
      {
        ...priorityContract,
        functionName: 'epochDuration'
      }
    ]
  })
  console.log('data:', data)
  console.log('isError:', isError)
  console.log('isLoading:', isLoading)

  let epoch: any = null
  if (data != undefined) {
    const startTime: number = Number(data[0])
    const epochDuration: number = Number(data[1])
    epoch = {
      number: epochNumber,
      startDate: new Date(Number(startTime + ((epochNumber - 1) * epochDuration * 24*60*60)) * 1_000).toISOString().substring(0, 10),
      endDate: new Date(Number(startTime + (epochNumber * epochDuration * 24*60*60)) * 1_000).toISOString().substring(0, 10)
    }
  }

  if (!useIsMounted() || !epoch) {
    return (
      <div className="flex items-center text-gray-400">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-gray-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        &nbsp;Loading...
      </div>
    )
  }
  
  return (
    <div>
      <b>Epoch #{epoch.number}</b> (from <b>{epoch.startDate}</b> to <b>{epoch.endDate}</b>)
    </div>
  )
}
