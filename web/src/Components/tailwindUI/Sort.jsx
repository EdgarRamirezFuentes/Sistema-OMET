import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Sort({ options, title, setOptions }) {
    const handleUpdateOptions = id => {
        const newOptions = options.map(option => {
            if(option.id === id){
                return {
                    ...option,
                    active: true
                }
            } else {
                return {
                    ...option,
                    active: false
                }
            }
        });
        setOptions(newOptions);
    }
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    { title }
                    <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 mt-[1px] flex-shrink-0 text-gray-700 group-hover:text-gray-900" aria-hidden="true" />
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="w-full py-1">
                        {options.map((option) => (
                            <Menu.Item key={option.id}>
                                {({ active }) => (
                                    <button className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm font-medium text-gray-900 w-full text-left')} onClick={ () => handleUpdateOptions(option.id) }>
                                        {option.name}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

Sort.propTypes = {
    options: PropTypes.array,
    title: PropTypes.string,
    setOptions: PropTypes.func
}

Sort.defaultProps = {
    title: 'Ordenar'
}

export default Sort