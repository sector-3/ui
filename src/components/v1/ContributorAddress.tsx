import { useIsMounted } from '@/hooks/useIsMounted'
import { useEnsName } from 'wagmi'

export default function ContributorAddress({ address }: any) {
  console.log('ContributorAddress')

  const { data, isError, isLoading } = useEnsName({
    address: address
  })
  console.log('data:', data)

  if (!useIsMounted() || isLoading) {
    return (
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
    )
  }
  if (data) {
    return (
      <>
        {data}
      </>
    )
  }
  return (
    <>
      {address.substring(0, 6)}...{address.slice(-4)}
    </>
  )
}
