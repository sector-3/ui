import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { InformationCircleIcon, CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useAccount, Address } from 'wagmi'
import { useRouter } from 'next/router'
import Sector3DAO from '../../../abis/v1/Sector3DAO.json'
import Link from 'next/link'
import { config } from '@/utils/Config'
import { ethers } from 'ethers'

export default function PriorityDialog() {
  console.log('PriorityDialog')

  const router = useRouter()
  const { address } = router.query
  console.log('address:', address)

  const [open, setOpen] = useState(true)

  const [title, setTitle] = useState('')
  const handleTitleChange = (event: any) => {
    console.log('handleTitleChange')
    setTitle(event.target.value)
  }
  console.log('title:', title)

  const [rewardToken, setRewardToken] = useState('')
  const handleRewardTokenChange = (event: any) => {
    console.log('handleRewardTokenChange')
    setRewardToken(event.target.value)
  }
  console.log('rewardToken:', rewardToken)

  const [epochDuration, setEpochDuration] = useState(0)
  const handleEpochDurationChange = (event: any) => {
    console.log('handleEpochDurationChange')
    setEpochDuration(event.target.value)
  }
  console.log('epochDuration:', epochDuration)

  const [epochBudget, setEpochBudget] = useState(0)
  const [epochBudgetWei, setEpochBudgetWei] = useState('0')
  const handleEpochBudgetChange = (event: any) => {
    console.log('handleEpochBudgetChange')
    console.log('event.target.value:', event.target.value)
    setEpochBudget(event.target.value)
    if (event.target.value > 0) {
      const wei = ethers.utils.parseEther(event.target.value)
      console.log('wei.toString():', wei.toString())
      setEpochBudgetWei(wei.toString())
    } else {
      setEpochBudgetWei('0')
    }
  }
  console.log('epochBudget:', epochBudget)
  console.log('epochBudgetWei:', epochBudgetWei)

  const [gatingNFT, setGatingNFT] = useState(ethers.constants.AddressZero)
  const handleGatingNFTChange = (event: any) => {
    console.log('handleGatingNFTChange')
    setGatingNFT(event.target.value)
  }
  console.log('gatingNFT:', gatingNFT)

  const { config: writeConfig, error } = usePrepareContractWrite({
    address: address as Address,
    abi: Sector3DAO.abi,
    functionName: 'deployPriority',
    args: [title, rewardToken, epochDuration, epochBudgetWei, gatingNFT]
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
      sendDiscordNotification({ priorityTitle: title, daoAddress: address })
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
                            Successfully added your DAO priority!
                          </p>
                          <p className='mt-4'>
                            <Link href={`${config.etherscanDomain}/tx/${transactionData?.hash}`} target='_blank'
                              className='text-indigo-400'
                            >
                              View transaction on Etherscan
                            </Link>
                          </p>
                          <p className='mt-4 border-t-2 border-gray-800 pt-4'>
                            To fund the priority, make a token transfer to its smart contract address.
                          </p>
                          <p className='mt-2 text-sm text-gray-400'>
                            (You can find the address in the URL by clicking the priority: <code>/v1/priorities/&lt;address&gt;</code>)
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
                      Add DAO Priority
                    </h3>
                    <div className='flex mt-2'>
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 sm:mx-0 sm:h-10 sm:w-10">
                        <InformationCircleIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                      </div>
                      <p className="ml-2 text-sm text-gray-400">
                        Add a priority that aligns well with this <i>DAO purpose</i>.
                      </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className='mt-4'>
                        <label htmlFor="description" className='font-bold text-indigo-200'>
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          onChange={handleTitleChange}
                          className="w-full p-2 bg-stone-700 rounded-md ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                          placeholder="E.g. 'Develop new app UI'"
                          required
                        />
                      </div>

                      <div className='mt-4'>
                        <label htmlFor="rewardToken" className='font-bold text-indigo-200'>
                          Reward token (ERC-20)
                        </label>
                        <input
                          type="text"
                          id="rewardToken"
                          name="rewardToken"
                          onChange={handleRewardTokenChange}
                          className="w-full p-2 bg-stone-700 rounded-md ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                          placeholder="E.g. '0x942d6e75465C3c248Eb8775472c853d2b56139fE'"
                          required
                        />
                      </div>

                      <div className='mt-4'>
                        <label htmlFor="epochDuration" className='font-bold text-indigo-200'>
                          Epoch duration (in days)
                        </label><br />
                        <input
                          type="number"
                          id="epochDuration"
                          name="epochDuration"
                          onChange={handleEpochDurationChange}
                          className="w-1/4 p-2 bg-stone-700 rounded-md ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                          placeholder="E.g. '7'"
                          defaultValue={''}
                          required
                          min={0}
                        />
                      </div>

                      <div className='mt-4'>
                        <label htmlFor="epochBudget" className='font-bold text-indigo-200'>
                          Epoch budget
                        </label><br />
                        <input
                          type="number"
                          step={0.00001}
                          id="epochBudget"
                          name="epochBudget"
                          onChange={handleEpochBudgetChange}
                          className="w-1/2 p-2 bg-stone-700 rounded-md ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                          placeholder="E.g. '2,049'"
                          defaultValue={0}
                          required
                          min={0}
                        />
                        <p className="mt-2 text-sm text-gray-400">
                          {new Intl.NumberFormat().format(epochBudget / epochDuration * 7)} tokens per week<br />
                          {new Intl.NumberFormat().format(epochBudget / epochDuration * 365 / 12)} tokens per month<br />
                          {new Intl.NumberFormat().format(epochBudget / epochDuration * 365 / 4)} tokens per quarter<br />
                          {new Intl.NumberFormat().format(epochBudget / epochDuration * 365)} tokens per year<br />
                        </p>
                      </div>

                      <div className='mt-4'>
                        <label htmlFor="gatingNFT" className='font-bold text-indigo-200'>
                          Gating NFT (ERC-721)
                        </label>
                        <input
                          type="text"
                          id="gatingNFT"
                          name="gatingNFT"
                          onChange={handleGatingNFTChange}
                          className="w-full p-2 bg-stone-700 rounded-md ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                          placeholder="E.g. '0x84277bf3c0c8e1176c99f2b624d67041de885fc9'"
                          defaultValue={ethers.constants.AddressZero}
                          required
                        />
                      </div>

                      <button
                          type="submit"
                          disabled={!write || isLoading}
                          className="disabled:text-gray-600 disabled:bg-gray-400 mt-4 inline-flex w-full justify-center rounded-xl bg-indigo-800 px-4 py-2 font-semibold text-indigo-200 shadow-sm hover:bg-indigo-700 sm:w-auto"
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
                    </form>
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

function sendDiscordNotification({ priorityTitle, daoAddress }: any) {
  console.log('sendDiscordNotification')
  
  const content: String = `A new DAO Priority was added: ${config.sector3Domain}/v1/daos/${daoAddress}\n\`\`\`${priorityTitle}\`\`\``
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
