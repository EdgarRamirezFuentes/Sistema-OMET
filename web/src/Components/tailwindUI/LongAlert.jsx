import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

function LongAlert({ type, show, title, description, onClose }) {

    const [showAlert, setShowAlert] = useState(show);

    const bgColorFor = {
        'success': 'bg-green-50',
        'warning': 'bg-yellow-50',
        'error': 'bg-red-50',
        'info': 'bg-blue-50'
    }

    const titleColorFor = {
        'success': 'text-green-800',
        'warning': 'text-yellow-800',
        'error': 'text-red-800',
        'info': 'text-blue-800'
    }

    const descriptionColorFor = {
        'success': 'text-green-700',
        'warning': 'text-yellow-700',
        'error': 'text-red-700',
        'info': 'text-blue-700'
    }

    const closeButtonColorFor = {
        'success': ' bg-green-50 text-green-500 hover:bg-green-100',
        'warning': 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100',
        'error': 'bg-red-50 text-red-500 hover:bg-red-100',
        'info': 'bg-blue-50 text-blue-500 hover:bg-blue-100'
    }

    const iconFor = {
        'success': <CheckCircleIcon className="bg-green-50 text-green-500 hover:bg-green-100 h-5 w-5" aria-hidden="true" />,
        'warning': <ExclamationCircleIcon className="bg-yellow-50 text-yellow-500 hover:bg-yellow-100 h-5 w-5" aria-hidden="true" />,
        'error': <XCircleIcon className="bg-red-50 text-red-500 hover:bg-red-100 h-5 w-5" aria-hidden="true" />,
        'info': <InformationCircleIcon className="bg-blue-50 text-blue-500 hover:bg-blue-100' h-5 w-5" aria-hidden="true" />
    }

    useEffect(() => {
        setShowAlert(show)
    }, [show]);

    useEffect(() => {
        if(showAlert){
            setTimeout(() => {
                setShowAlert(false);
            }, 6000);
        }
    }, [showAlert])
    

    return (
        <div className='absolute w-full px-4'>
            <Transition
                show={showAlert}
                enter="transition-all ease-in"
                enterFrom="max-h-0 opacity-0"
                enterTo="max-h-screen opacity-100"
                leave="transition-all ease-out"
                leaveFrom="max-h-screen opacity-100"
                leaveTo="max-h-0 opacity-0"
                afterLeave={() => onClose && onClose()}>
                <div className={`${bgColorFor[type.toLowerCase()]} rounded-md p-4 shadow-md`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {iconFor[type.toLowerCase()]}
                        </div>
                        <div className="ml-3">
                            <h3 className={`${titleColorFor[type.toLowerCase()]} text-sm font-medium`}>{title}</h3>
                            {description && (
                                <p className={`${descriptionColorFor[type.toLowerCase()]} mt-2 text-sm`}>
                                    {description}
                                </p>
                            )}
                        </div>
                        <div className="ml-auto pl-3">
                            <div className="-mx-1.5 -my-1.5">
                                <button
                                    onClick={() => setShowAlert(false)}
                                    type="button"
                                    className={`${closeButtonColorFor[type.toLowerCase()]} transition-all inline-flex rounded-md p-1.5 focus:outline-none`}>
                                    <span className="sr-only">Cerrar</span>
                                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    )
}

LongAlert.propTypes = {
    type: PropTypes.string,
    show: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    onClose: PropTypes.func
}

LongAlert.defaultProps = {
    type: 'Error',
    show: false
}

export default LongAlert;