import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';


function Select({ value, setValue, listOptions, label, isDisabled, needed, error, name, id, ...rest }) {

    return (
        <>
            <div className='w-full'>
                {label && (
                    <label htmlFor={id} className='font-bold'>
                        {label}
                        {needed && <span className='text-red-400'> *</span>}
                    </label>
                )}
                <div className="mt-1 relative rounded-md shadow-sm">
                    <select
                        name={name}
                        id={id}
                        className={`${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 text-gray-800 placeholder:text-gray-300 focus:ring-v2-blue-text-login focus:border-v2-blue-text-login'} transition-all ${isDisabled && 'opacity-80 bg-gray-200 cursor-not-allowed'} block w-full sm:text-sm rounded-md`}
                        readOnly={isDisabled}
                        disabled={isDisabled}
                        value={value}
                        onChange={(e) => setValue && setValue(e.target.value)}
                        {...rest}>
                        <option key={null} value={null}>Selecciona una opción</option>
                        {listOptions.map((option, i) => (
                            <option key={i} value={option.id}>{option.name}</option>
                        ))}
                    </select>
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
        </>
    )
}

Select.propTypes = {
    value: PropTypes.string,
    setValue: PropTypes.func,
    listOptions: PropTypes.array,
    label: PropTypes.string,
    isDisabled: PropTypes.bool,
    needed: PropTypes.bool,
    error: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string
}

Select.defaultValue = {
    isDisabled: false,
    needed: true
}

export default Select;
