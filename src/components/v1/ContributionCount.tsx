import { useContractRead } from "wagmi"
import Sector3DAOPriority from '../../../abis/v1/Sector3DAOPriority.json'
import { useIsMounted } from "@/hooks/useIsMounted"

export function ContributionCount({ priorityAddress, epochNumber }: any) {
    console.log('ContributionCount')

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

    return <>{epochContributions.length}</>
}
