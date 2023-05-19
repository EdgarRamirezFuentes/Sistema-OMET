import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

function SlideOver({ open, setOpen, title, children, className }) {

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-[30] h-screen" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity h-screen" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-hidden h-screen">
                    <div className="absolute inset-0 overflow-hidden h-screen">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full h-screen">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full">
                                <Dialog.Panel className={`pointer-events-auto w-screen h-screen max-w-lg ${className}`}>
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white pt-6 shadow-xl">
                                        <div className="px-4 sm:px-6">
                                            <div className="flex items-start justify-between mt-6">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">{title}</Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="transition-all rounded-md bg-white text-gray-400 hover:text-gray-500"
                                                        onClick={() => setOpen(false)}>
                                                        <span className="sr-only">Cerrar</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <div className="absolute inset-0 px-4 sm:px-6">
                                                {children}
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

SlideOver.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    title: PropTypes.string,
    children: PropTypes.any,
    className: PropTypes.string
}

SlideOver.defaultProps = {
    open: false,
    className: ''
}

export default SlideOver;