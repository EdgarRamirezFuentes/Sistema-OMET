import React, { Fragment, useState, useEffect } from 'react';
import { Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faClose } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

function Notification({ show, message }) {
    const [showNotification, setShowNotification] = useState(show);

    useEffect(() => {
        setShowNotification(show);
    }, [show]);
    
    return (
        <>
            {/* Global notification live region, render this permanently at the end of the document */}
            <div
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 pt-20 flex items-start px-4 py-6 md:items-start md:p-6 z-[55]"
            >
                <div className="flex w-full flex-col items-center space-y-4 md:items-end">
                {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                <Transition
                    show={showNotification}
                    as={Fragment}
                    enter="transform ease-out duration-300 transition"
                    enterFrom="translate-y-2 opacity-0 md:translate-y-0 md:translate-x-2"
                    enterTo="translate-y-0 opacity-100 md:translate-x-0"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="p-4">
                        <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <FontAwesomeIcon icon={ faCircleCheck } className="text-base text-[#22C55E] pt-1" aria-hidden="true" />
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="font-medium text-[#111827]">{message}</p>
                        </div>
                        <div className="ml-4 flex flex-shrink-0">
                            <button
                            type="button"
                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => {
                                setShowNotification(false)
                            }}
                            >
                            <span className="sr-only">Close</span>
                            <FontAwesomeIcon icon={ faClose } className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                </Transition>
                </div>
            </div>
        </>
    )
}

Notification.propTypes = {
    show: PropTypes.bool,
    message: PropTypes.string
}

Notification.defaultProps = {
    show: false,
    message: 'notification message'
}

export default Notification