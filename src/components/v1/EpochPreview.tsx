import { useContractRead } from "wagmi"
import Sector3DAOPriority from '../../../abis/v1/Sector3DAOPriority.json'
import { useIsMounted } from "@/hooks/useIsMounted"
import Link from "next/link"

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

    if (!useIsMounted() || isLoading) {
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
            <div className='text-gray-400 mt-4'>Contributions: {epochContributions.length} ({epochHours}h)</div>
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
