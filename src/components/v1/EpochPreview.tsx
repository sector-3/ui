import { useContractRead } from "wagmi"
import Sector3DAOPriority from '../../../abis/v1/Sector3DAOPriority.json'
import { useIsMounted } from "@/hooks/useIsMounted"
import Link from "next/link"
import { CircleStackIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"

export function EpochPreview({ priorityAddress, currentEpochNumber, epochNumber }: any) {
    console.log('EpochPreview')

    console.log('priorityAddress:', priorityAddress)
    console.log('epochNumber:', epochNumber)

    const { data, isError, isLoading } = useContractRead({
        address: priorityAddress,
        abi: Sector3DAOPriority.abi,
        functionName: 'getEpochContributions',
        args: [ epochNumber ]
    })
    console.log('data:', data)

    let epochContributions: any = null
    if (data) {
        epochContributions = data
    }

    const { data: isEpochFundedData, isError: isEpochFundedError, isLoading: isEpochFundedLoading } = useContractRead({
        address: priorityAddress,
        abi: Sector3DAOPriority.abi,
        functionName: 'isEpochFunded',
        args: [ epochNumber ]
    })
    console.log('isEpochFundedData:', isEpochFundedData)

    if (!useIsMounted() || isLoading || isEpochFundedLoading) {
        return (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
        )
    }

    const epochContributors: any = {}
    for (const contribution of epochContributions) {
        epochContributors[contribution.contributor] = true
    }
    console.log('epochContributors:', epochContributors)

    let epochHours: number = 0
    for (const contribution of epochContributions) {
        epochHours += contribution.hoursSpent
    }
    console.log('epochHours:', epochHours)

    return (
        <>
            {((epochContributions.length > 0)  && (epochNumber != currentEpochNumber)) && (
                !isEpochFundedData ? (
                    <span className='float-right inline-flex bg-amber-900 text-amber-500 font-bold uppercase text-sm rounded-lg px-2 py-1'>
                        <ExclamationCircleIcon className='h-5 w-5' /> Not yet funded
                    </span>
                ) : (
                    <span className='float-right inline-flex bg-emerald-900 text-emerald-500 font-bold uppercase text-sm rounded-lg px-2 py-1'>
                        <CircleStackIcon className='h-5 w-5' /> Funded
                    </span>
                )
            )}

            <div className='text-gray-400 mt-4'>Contributions: {epochContributions.length} (⏱️{epochHours}h)</div>
            {(epochContributions.length > 0) && (
                <>
                    <div>
                        <div className="mt-3 flex -space-x-2">
                            {Object.keys(epochContributors).map((contributor) => (
                                <img key={contributor} className="inline-block h-8 w-8 rounded-full ring-2 ring" src={`https://cdn.stamp.fyi/avatar/eth:${contributor}?s=128`} alt=""/>
                            ))}
                        </div>
                    </div>
                </>
            )}
            {(currentEpochNumber == epochNumber) ? (
                <Link href={`/v1/priorities/${priorityAddress}/epochs/${epochNumber}`}>
                    <button className='mt-4 px-4 py-2 font-semibold rounded-xl bg-indigo-900 hover:bg-indigo-800'>
                        ⏳ Report Contributions
                    </button>
                </Link>
            ) : (
                (epochContributions.length > 0) && (
                    <Link href={`/v1/priorities/${priorityAddress}/epochs/${epochNumber}`}>
                        <button className='mt-4 px-4 py-2 font-semibold rounded-xl bg-indigo-900 hover:bg-indigo-800'>
                            ⌛ View Contributions
                        </button>
                    </Link>
                )
            )}
        </>
    )
}
