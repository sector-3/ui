import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { usePrepareContractWrite, useContractWrite, useAccount, Address } from 'wagmi'
import { useRouter } from 'next/router'
import Sector3DAOPriority from '../../abis/Sector3DAOPriority.json'

export default function ContributionDialog({ priorityTitle }: any) {
  console.log('ContributionDialog')

  console.log('priorityTitle:', priorityTitle)

  const router = useRouter()
  const { address, epochIndex } = router.query
  console.log('address:', address)
  console.log('epochIndex:', epochIndex)

  const [open, setOpen] = useState(true)

  const [description, setDescription] = useState('')
  const handleDescriptionChange = (event: any) => {
    console.log('handleDescriptionChange')
    setDescription(event.target.value)
  }

  const [proofURL, setProofURL] = useState('')
  const handleProofURLChange = (event: any) => {
    console.log('handleProofURLChange')
    setProofURL(event.target.value)
  }

  const [hoursSpent, setHoursSpent] = useState(0)
  const handleHoursSpentChange = (event: any) => {
    console.log('handleHoursSpentChange')
    setHoursSpent(event.target.value)
  }

  const [alignment, setAlignment] = useState(0)
  const handleAlignmentChange = (event: any) => {
    console.log('handleAlignmentChange')
    setAlignment(event.target.value)
  }

  const { address: contributorAddress, isConnected } = useAccount()

  const contribution = {
    epochIndex: Number(epochIndex),
    contributor: contributorAddress,
    description: description,
    alignment: Number(alignment),
    hoursSpent: Number(hoursSpent)
  }

  const { config, error } = usePrepareContractWrite({
    address: address as Address,
    abi: Sector3DAOPriority.abi,
    functionName: 'addContribution',
    args: [contribution]
  })
  console.log('config:', config)
  console.log('error:', error)
  const { data: transactionData, isLoading, isSuccess, write } = useContractWrite(config)
  console.log('transactionData:', transactionData)
  console.log('isLoading:', isLoading)
  console.log('isSuccess:', isSuccess)
  console.log('write:', write)

  const handleSubmit = (event: any) => {
    console.log('handleSubmit')
    event.preventDefault()
    console.log('contribution:', contribution)
    if (write != undefined) {
      write()
    }
  }

  // if (isSuccess) {
  //   setOpen(false)
  // }

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
                <form action="#" method="POST" onSubmit={handleSubmit}>
                  <div className="bg-black p-6">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 sm:mx-0 sm:h-10 sm:w-10">
                        <InformationCircleIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title as="h3" className="text-lg font-semibold leading-6">
                          Report DAO Contribution
                        </Dialog.Title>
                        
                        <div className="mt-2">
                          <p className="text-sm text-gray-400">
                            Report a contribution that you made during this <i>current epoch</i>.
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            This information will be displayed <i>publicly</i>, so be careful what you share.
                          </p>
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
                          <fieldset onChange={handleAlignmentChange}>
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
                                  value="1"
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
                                  value="2"
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
                                  value="3"
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
                                  value="4"
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
                                  value="5"
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
                    </div>
                  </div>
                  <div className="bg-gray-900 p-6 sm:flex sm:flex-row-reverse">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="disabled:text-gray-600 disabled:bg-gray-400 inline-flex w-full justify-center rounded-xl bg-indigo-800 px-4 py-2 font-semibold text-indigo-200 shadow-sm hover:bg-indigo-700 sm:ml-3 sm:w-auto"
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
