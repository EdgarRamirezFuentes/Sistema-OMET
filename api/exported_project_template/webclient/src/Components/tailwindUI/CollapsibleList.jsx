import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MenuButton from './MenuButton';
import { Transition } from '@headlessui/react';
import { EllipsisVerticalIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const CollapsibleList = ({ title, description, actions, children }) => {
    return (
        <div className="overflow-hidden bg-white shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6 flex flex-row gap-4 justify-between">
                <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
                </div>
                {actions && (
                    <MenuButton
                        items={actions}>
                        <EllipsisVerticalIcon className="min-w-[1.25rem] w-6 h-6 text-gray-900" />
                    </MenuButton>
                )}
            </div>
            <div className="border-t border-gray-200 divide-y divide-gray-200">
                {children}
            </div>
        </div>
    )
}

const Item = ({ title, children }) => {
    const [collapsed, setCollapsed] = useState(false)
    return (
        <div>
            <div className='py-5 px-4 sm:px-6 cursor-pointer flex gap-4 bg-gray-50'  onClick={() => setCollapsed(!collapsed)}>
                <ChevronRightIcon
                    className={`${!collapsed ? 'rotate-0' : 'rotate-90'} h-6 w-6 transform transition text-gray-700`}
                    aria-hidden="true"
                />
                <p className="font-medium text-gray-700 text-base">{title}</p>
            </div>
            <Transition
                show={collapsed}
                enter="transition-all ease-in duration-200"
                enterFrom="max-h-0 opacity-0"
                enterTo="max-h-[700rem] opacity-100"
                leave="transition-all ease-out duration-200"
                leaveFrom="max-h-[700rem] opacity-100"
                leaveTo="max-h-0 opacity-0">
                <div className='border-t border-gray-200'>
                    {children}
                </div>
            </Transition>
        </div>
    );
};
CollapsibleList.Item = Item;

Item.propTypes = {
    title: PropTypes.string,
    children: PropTypes.any
}

CollapsibleList.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.any
}

export default CollapsibleList;