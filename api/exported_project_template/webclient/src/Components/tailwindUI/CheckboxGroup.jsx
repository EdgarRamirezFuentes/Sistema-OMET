import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { Transition } from '@headlessui/react';
import PropTypes from 'prop-types';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function CheckboxGroup({ items, horizontal, selectedItems, setSelectedItems, label, needed, error, setSelectedIds }) {

    const [selected, setSelected] = useState(selectedItems);
    const gridCols = horizontal ? `flex-row` : 'flex-col';

    const onCheckItem = (item, isSelected) => {
        if (item.disabled) return;
        let items = selected || [];
        if (isSelected) {
            items = items.filter(currentItem => currentItem.id != item.id);
        } else {
            items = [
                ...items,
                item
            ];
        }
        if (setSelectedItems) setSelectedItems(items);
        else setSelected(items);
        const newSelectedIds = items.filter(i => items.includes(i)).map(i => i.id);
        if (setSelectedIds) setSelectedIds(newSelectedIds);
    }

    useEffect(() => {
        setSelected(selectedItems);
    }, [selectedItems])

    useEffect(() => {
        const newSelected = selectedItems.filter(selected =>
            items.find(item => item.disabled && selected.id == item.id) == null
        );
        if (setSelectedItems) setSelectedItems(newSelected);
        else setSelected(newSelected);
    }, [items])

    return (
        <div className='w-full'>
            {label && (
                <label className='font-bold'>
                    {label}
                    {needed && <span className='text-red-400'> *</span>}
                </label>
            )}
            <div className={`flex gap-4 ${gridCols}`}>
                {items.map((item) => {
                    let isSelected = selected && selected?.find(currentItem => currentItem.id == item.id) != null;
                    return (
                        <div
                            key={item.id}
                            onClick={() => onCheckItem(item, isSelected)}
                            className={`${item.disabled ? 'opacity-80 bg-gray-200 select-none' : 'opacity-100 cursor-pointer'} w-full relative flex gap-2 rounded-lg border bg-white p-2 shadow-sm focus:outline-none transition-all`}>
                            <span className="flex flex-1 justify-center">
                                <span className="flex flex-col items-center">
                                    {item.icon && (
                                        <span className="block text-2xl w-7 h-7 text-gray-700 text-center mb-1">
                                            {item.icon}
                                        </span>
                                    )}
                                    <span className="block text-sm font-medium text-gray-900">
                                        {item.value}
                                    </span>
                                    {item.description && (
                                        <span className="mt-1 flex text-sm text-gray-500">
                                            {item.description}
                                        </span>
                                    )}
                                </span>
                            </span>
                            <CheckCircleIcon
                                className={classNames(!isSelected ? 'opacity-0' : 'opacity-100', 'absolute top-1 right-1 h-5 w-5 text-v2-blue-text-login transition-all')}
                                aria-hidden="true" />
                            <span
                                className={classNames(
                                    isSelected ? 'border-v2-blue-text-login ring-1 ring-v2-blue-text-login' : 'border-transparent',
                                    error != null ? 'border-red-300 ring-1 ring-red-300' : 'border-transparent',
                                    'border transition-all pointer-events-none absolute -inset-px rounded-lg'
                                )}
                                aria-hidden="true" />
                        </div>
                    )
                })}
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

CheckboxGroup.propTypes = {
    items: PropTypes.array,
    horizontal: PropTypes.bool,
    selectedItems: PropTypes.array,
    setSelectedItems: PropTypes.func,
    label: PropTypes.string,
    needed: PropTypes.bool,
    error: PropTypes.string
}

CheckboxGroup.defaultProps = {
    items: [],
    horizontal: true,
    selectedItems: []
}

export default CheckboxGroup;
