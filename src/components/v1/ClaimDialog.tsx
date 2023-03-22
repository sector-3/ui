import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { InformationCircleIcon, CheckBadgeIcon, ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useAccount, Address } from 'wagmi'
import { useRouter } from 'next/router'
import Sector3DAOPriority from '../../../abis/v1/Sector3DAOPriority.json'
import Link from 'next/link'
import { config } from '@/utils/Config'
import { ethers } from 'ethers'
import ERC20Details from './ERC20Details'

export default function ClaimDialog({ contributorAddress, amount, rewardToken }: any) {
  console.log('ClaimDialog')

  console.log('contributorAddress:', contributorAddress)
  console.log('amount:', amount)
  console.log('rewardToken:', rewardToken)

  const router = useRouter()
  const { address, epochNumber } = router.query
  console.log('address:', address)
  console.log('epochNumber:', epochNumber)

  const [open, setOpen] = useState(true)
  console.log('open:', open)
  
  const priorityContract = {
    address: address,
    abi: Sector3DAOPriority.abi
  }

  const { config: writeConfig, error } = usePrepareContractWrite({
    address: address as Address,
    abi: Sector3DAOPriority.abi,
    functionName: 'claimReward',
    args: [epochNumber],
    // overrides: {
    //   gasLimit: 160_000
    // }
  })
  console.log('writeConfig:', writeConfig)
  console.log('error:', error)

  const { data: transactionData, isLoading, isSuccess, write } = useContractWrite(writeConfig)
  console.log('transactionData:', transactionData)
  console.log('isLoading:', isLoading)
  console.log('isSuccess:', isSuccess)
  console.log('write:', write)

  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = useWaitForTransaction({
    hash: transactionData?.hash
  })
  console.log('isTransactionLoading:', isTransactionLoading)
  console.log('isTransactionSuccess:', isTransactionSuccess)

  const handleSubmit = (event: any) => {
    console.log('handleSubmit')
    event.preventDefault()
    if (write != undefined) {
      write()
    }
  }

  const [discordNotificationSent, setDiscordNotificationSent] = useState(false)
  if (isSuccess && isTransactionSuccess) {
    if (!discordNotificationSent) {
      sendDiscordNotification({ priorityAddress: address, epochNumber: epochNumber })
      setDiscordNotificationSent(true)
    }
  }
  console.log('discordNotificationSent:', discordNotificationSent)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="sm:text-left p-6 relative transform overflow-hidden rounded-xl bg-black shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                {isSuccess ? (
                  <div className='p-12 text-center'>
                    {isTransactionLoading ? (
                      <>
                        <div className='text-5xl animate-bounce'>
                          🐑
                        </div>
                        <div>
                          <div className="inline-block h-16 w-16 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        </div>
                        <p className='mt-4'>
                          Confirming transaction...
                        </p>
                        <p className='mt-4'>
                          <Link href={`${config.etherscanDomain}/tx/${transactionData?.hash}`} target='_blank'>
                            View on Etherscan
                          </Link>
                        </p>
                      </>
                    ) : (
                      !isTransactionSuccess ? (
                        <>
                          <p className='flex justify-center'>
                            <ExclamationTriangleIcon className="h-16 w-16 text-orange-400" />
                          </p>
                          <p className='mt-4 text-orange-400'>
                            Transaction failed
                          </p>
                          <p className='mt-4'>
                            <Link href={`${config.etherscanDomain}/tx/${transactionData?.hash}`} target='_blank'>
                              View on Etherscan
                            </Link>
                          </p>
                          <button
                            type="button"
                            className="mt-4 inline-flex w-full justify-center rounded-xl bg-indigo-800 px-4 py-2 font-semibold text-indigo-200 shadow-sm hover:bg-indigo-700 sm:w-auto"
                            onClick={() => setOpen(false)}
                          >
                            Close
                          </button>
                        </>
                      ) : (
                        <>
                          <p className='flex justify-center'>
                            <CheckBadgeIcon className="h-16 w-16 text-green-400" />
                          </p>
                          <p className='mt-4'>
                            Successfully claimed your reward allocation!
                          </p>
                          <p className='mt-4'>
                            <Link href={`${config.etherscanDomain}/tx/${transactionData?.hash}`} target='_blank'
                              className='text-indigo-400'
                            >
                              View transaction on Etherscan
                            </Link>
                          </p>
                          <button
                            type="button"
                            className="mt-4 inline-flex w-full justify-center rounded-xl bg-indigo-800 px-4 py-2 font-semibold text-indigo-200 shadow-sm hover:bg-indigo-700 sm:w-auto"
                            onClick={() => setOpen(false)}
                          >
                            Close
                          </button>
                        </>
                      )
                    )}
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-bold">
                      Claim Reward (Epoch #{epochNumber})
                    </h3>
                    <div className='mt-4'>
                      <p className="text-gray-400">
                        Contributor
                      </p>
                      <div className='md:w-1/2 flex'>
                        <img
                          className="h-6 w-6 bg-gray-700 rounded-full"
                          src={`https://cdn.stamp.fyi/avatar/eth:${contributorAddress}?s=128`}
                        />&nbsp;
                        <code>{contributorAddress.substring(0, 6)}...{contributorAddress.slice(-4)}</code>
                      </div>
                    </div>
                    <div className='mt-4'>
                      <p className="text-gray-400">
                        Claimable amount
                      </p>
                      <p className='mt-0 text-2xl'>
                        {amount} <ERC20Details address={rewardToken} />
                      </p>
                    </div>
                    {error && (
                      <div className='mt-4 border-2 border-amber-900 text-amber-600 rounded-lg p-2 truncate'>
                        <span className='mr-2 inline-flex bg-amber-900 text-amber-500 font-bold uppercase rounded-lg px-2 py-1'>
                          <ExclamationTriangleIcon className='h-5 w-5 mr-2' /> {error.name}
                        </span>
                        {error.message}
                      </div>
                    )}
                    <button
                        type="submit"
                        disabled={!write || isLoading}
                        onClick={handleSubmit}
                        className="disabled:text-gray-600 disabled:bg-gray-400 mt-4 inline-flex w-full justify-center rounded-xl bg-indigo-800 px-4 py-2 font-semibold text-indigo-200 shadow-sm hover:bg-indigo-700 sm:w-auto"
                    >
                      {!isLoading ? (
                        <>
                          Claim
                        </>
                      ) : (
                        <>
                          <div className="mr-2 inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                          Claiming...
                        </>
                      )}
                    </button>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

function sendDiscordNotification({ priorityAddress, epochNumber }: any) {
  console.log('sendDiscordNotification')
  
  const content: String = `A reward allocation was claimed: ${config.sector3Domain}/v1/priorities/${priorityAddress}/epochs/${epochNumber}`
  console.log('content:', content)

  if (config.discordWebhookPriorities) {
    console.log('Sending...')
    fetch(config.discordWebhookPriorities, {
      body: JSON.stringify({
        content: content
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then((res) => {
      console.log('then, res:', res)
    }).catch((res) => {
      console.log('catch, res:', res)
    })
  }
}
