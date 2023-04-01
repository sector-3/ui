import { Fragment, useRef, useState } from 'react'
import { ethers } from "ethers";
import { Dialog, Transition } from '@headlessui/react'
import { InformationCircleIcon, CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useAccount, Address } from 'wagmi'
import { useRouter } from 'next/router'
import Sector3DAOPriority from '../../../abis/v1/Sector3DAOPriority.json'
import Link from 'next/link'
import { config } from '@/utils/Config'

export default function ContributionDialog({ priorityTitle, refetchContributions }: any) {
  console.log('ContributionDialog')

  console.log('priorityTitle:', priorityTitle)

  const router = useRouter()
  const { address, epochNumber } = router.query
  console.log('address:', address)
  console.log('epochNumber:', epochNumber)

  const [open, setOpen] = useState(true)

  const [description, setDescription] = useState('')
  const handleDescriptionChange = (event: any) => {
    console.log('handleDescriptionChange')
    setDescription(event.target.value)
  }
  console.log('description:', description)

  const [proofURL, setProofURL] = useState('')
  const handleProofURLChange = (event: any) => {
    console.log('handleProofURLChange')
    setProofURL(event.target.value)
  }
  console.log('proofURL:', proofURL)

  const [hoursSpent, setHoursSpent] = useState(0)
  const handleHoursSpentChange = (event: any) => {
    console.log('handleHoursSpentChange')
    setHoursSpent(event.target.value)
  }
  console.log('hoursSpent:', hoursSpent)

  const [alignmentPercentage, setAlignmentPercentage] = useState(0)
  const handleAlignmentPercentageChange = (event: any) => {
    console.log('handleAlignmentPercentageChange')
    setAlignmentPercentage(event.target.value)
  }
  console.log('alignmentPercentage:', alignmentPercentage)

  const { config: writeConfig, error } = usePrepareContractWrite({
    address: address as Address,
    abi: Sector3DAOPriority.abi,
    functionName: 'addContribution',
    args: [description, proofURL, Number(hoursSpent), Number(alignmentPercentage)]
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
      sendDiscordNotification({ priorityTitle: priorityTitle, address: address, epochNumber: epochNumber, description: description })
      setDiscordNotificationSent(true)
    }

    refetchContributions().then((res: ethers.utils.Result)=> console.log('refetchContributions:', res.status))
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-black text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
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
                          <Link href={`${config.etherscanDomain}/tx/${transactionData?.hash}`} target='_blank'
                            className='text-indigo-400'
                          >
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
                            Successfully added your DAO contribution!
                          </p>
                          <p className='mt-4'>
                            <Link href={`${config.etherscanDomain}/tx/${transactionData?.hash}`} target='_blank'>
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
                  <form action="#" method="POST" onSubmit={handleSubmit}>
                    <div className="bg-black p-6">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6">
                        Report DAO Contribution
                      </Dialog.Title>
                      
                      <div className="mt-2 flex">
                        <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gray-800">
                          <InformationCircleIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
                        </div>
                        <div className='ml-2'>
                          <p className="text-sm text-gray-400">
                            Report a contribution that you made during this <i>current epoch</i>.
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            This information will be displayed publicly, so be careful what you share.
                          </p>
                        </div>
                      </div>
                      
                      <div className='mt-4'>
                        <div>
                          <label htmlFor="description" className='font-bold text-indigo-200'>
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            onChange={handleDescriptionChange}
                            rows={3}
                            className="block w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 p-2"
                            placeholder="E.g. 'Implemented a bug fix'"
                            defaultValue={''}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className='mt-4'>
                        <label htmlFor="proofUrl" className='font-bold text-indigo-200'>
                          Proof of contribution URL
                        </label>
                        <input
                          type="url"
                          name="proofUrl"
                          id="proofUrl"
                          onChange={handleProofURLChange}
                          className="block w-full flex-1 rounded-md border-0 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 p-2"
                          placeholder="E.g. 'https://github.com/org/repo/pull/123'"
                          required
                        />
                      </div>

                      <div className='mt-4'>
                        <label htmlFor="hoursSpent" className='font-bold text-indigo-200'>
                          Hours spent
                        </label><br />
                        <input
                          type="number"
                          name="hoursSpent"
                          id="hoursSpent"
                          onChange={handleHoursSpentChange}
                          className="w-1/4 flex-1 rounded-md border-0 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 p-2"
                          placeholder="E.g. '8'"
                          required
                          min={0}
                        />
                      </div>

                      <div className='mt-4'>
                        <fieldset onChange={handleAlignmentPercentageChange}>
                          <legend className="font-bold text-indigo-200">
                            Priority alignment
                          </legend>
                          <p className="text-sm text-gray-400">
                            How well does your contribution align with this DAO priority (&quot;{priorityTitle}&quot;)?
                          </p>
                          <div className="mt-2">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="alignment"
                                id="alignment-none"
                                value="0"
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                required
                              />
                              <label
                                htmlFor="alignment-none"
                                className="ml-3 block text-sm font-medium leading-6 text-red-400"
                              >
                                ☆☆☆☆☆ None
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="alignment"
                                id="alignment-barely"
                                value="20"
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <label
                                htmlFor="alignment-barely"
                                className="ml-3 block text-sm font-medium leading-6 text-orange-400"
                              >
                                ★☆☆☆☆ Barely
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="alignment"
                                id="alignment-moderately"
                                value="40"
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <label
                                htmlFor="alignment-moderately"
                                className="ml-3 block text-sm font-medium leading-6 text-amber-400"
                              >
                                ★★☆☆☆ Moderately
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="alignment"
                                id="alignment-mostly"
                                value="60"
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <label
                                htmlFor="alignment-mostly"
                                className="ml-3 block text-sm font-medium leading-6 text-lime-400"
                              >
                                ★★★☆☆ Mostly
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="alignment"
                                id="alignment-highly"
                                value="80"
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <label
                                htmlFor="alignment-highly"
                                className="ml-3 block text-sm font-medium leading-6 text-emerald-400"
                              >
                                ★★★★☆ Highly
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="alignment"
                                id="alignment-perfectly"
                                value="100"
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <label
                                htmlFor="alignment-perfectly"
                                className="ml-3 block text-sm font-medium leading-6 text-cyan-400"
                              >
                                ★★★★★ Perfectly
                              </label>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                    <div className="bg-gray-900 p-6">
                      {error && (
                        <div className='mb-4 border-2 border-amber-900 text-amber-600 rounded-lg p-2 truncate'>
                          <span className='mr-2 inline-flex bg-amber-900 text-amber-500 font-bold uppercase rounded-lg px-2 py-1'>
                            <ExclamationTriangleIcon className='h-5 w-5 mr-2' /> {error.name}
                          </span>
                          {error.message}
                        </div>
                      )}
                      <button
                          type="submit"
                          disabled={!write || isLoading}
                          className="disabled:text-gray-600 disabled:bg-gray-400 inline-flex w-full justify-center rounded-xl bg-indigo-800 px-4 py-2 font-semibold text-indigo-200 shadow-sm hover:bg-indigo-700 sm:w-auto"
                      >
                        {!isLoading ? (
                          <>
                            Confirm
                          </>
                        ) : (
                          <>
                            <div className="mr-2 inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                            Confirming...
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

function sendDiscordNotification({ priorityTitle, address, epochNumber, description }: any) {
  console.log('sendDiscordNotification')
  
  const content: String = `A new DAO contribution was added: ${config.sector3Domain}/v1/priorities/${address}/epochs/${epochNumber}\n\`\`\`${description}\`\`\``
  console.log('content:', content)

  if (config.discordWebhookContributions) {
    console.log('Sending...')
    fetch(config.discordWebhookContributions, {
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
