import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

export default function Example() {
  const [open, setOpen] = useState(true)

  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form action="#" method="POST">
                  <div className="bg-black p-4">
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
                            This information will be displayed publicly, so be careful what you share.
                          </p>
                        </div>
                        
                        <div className='mt-4'>
                          <div>
                            <label htmlFor="about" className='font-bold text-indigo-200'>
                              Description
                            </label>
                            <textarea
                              id="about"
                              name="about"
                              rows={3}
                              className="mt-1 block w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 p-2"
                              placeholder="you@example.com"
                              defaultValue={''}
                            />
                          </div>
                        </div>
                        
                        {/* <div className='mt-4'>
                          <label htmlFor="company-website" className='font-bold text-indigo-200'>
                            Proof of contribution URL
                          </label>
                          <input
                            type="text"
                            name="company-website"
                            id="company-website"
                            className="block w-full flex-1 rounded-md border-0 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 p-2"
                            placeholder="https://github.com/org/repo/pull/123"
                          />
                        </div> */}

                        
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-xl bg-indigo-800 px-4 py-2 font-semibold text-indigo-200 shadow-sm hover:bg-indigo-700 sm:ml-3 sm:w-auto"
                        onClick={() => setOpen(false)}>
                      Confirm
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
