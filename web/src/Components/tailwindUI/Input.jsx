import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

function Input({ label, labelDescription, needed, leftIcon, type, name, id, placeholder, rightIcon, rightIconAction, error, disabledInput, register, ...rest }) {
    return (
        <div>
            {label && (
                <label htmlFor={id} className='font-bold'>
                    {label}
                    {labelDescription && <span className='ml-1 text-xs text-gray-400'>{labelDescription}</span>}
                    {needed && <span className='text-red-400'> *</span>}
                </label>
            )}
            <div className='mb-10 w-full flex flex-row justify-center'>
                {leftIcon && (
                    <div className="absolute inset-y-0 max-w-[1.25rem] left-0 ml-3 flex items-center pointer-events-none overflow-hidden">
                        {leftIcon}
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    id={id}
                    className={'w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600'}
                    placeholder={placeholder}
                    readOnly={disabledInput}
                    disabled={disabledInput}
                    {...register}
                    {...rest}
                />
                {rightIcon ? (
                    <div onClick={() => rightIconAction && rightIconAction()} className={`${rightIconAction ? 'cursor-pointer' : ''} absolute inset-y-0 max-w-[1.25rem] right-0 mr-3 flex items-center overflow-hidden`}>
                        {rightIcon}
                    </div>
                ) : (
                    <Transition
                        show={error != null}
                        enter="transition-all ease-in"
                        enterFrom="opacity-0 scale-0"
                        enterTo="opacity-100 scale-100"
                        leave="transition-all ease-out"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-0"
                        className="absolute inset-y-0 right-0 mr-3 flex items-center">
                        <ExclamationCircleIcon className='w-4 h-4 text-red-500' />
                    </Transition>
                )}
            </div>
            <Transition
                show={error != null}
                enter="transition-all ease-in"
                enterFrom="max-h-0 opacity-0"
                enterTo="max-h-[3rem] opacity-100"
                leave="transition-all ease-out"
                leaveFrom="max-h-[3rem] opacity-100"
                leaveTo="max-h-0 opacity-0">
                <span className='text-sm text-red-600'>{error}</span>
            </Transition>
        </div>
    )
}

Input.propTypes = {
    label: PropTypes.string,
    labelDescription: PropTypes.string,
    needed: PropTypes.bool,
    leftIcon: PropTypes.element,
    type: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    placeholder: PropTypes.string,
    rightIcon: PropTypes.element,
    rightIconAction: PropTypes.func,
    error: PropTypes.string,
    disabledInput: PropTypes.bool,
    register: PropTypes.any
}

Input.defaultProps = {
    needed: false,
    type: 'text',
    disabledInput: false
}

export default Input;