import React, { useState, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Group({ items, horizontal, selectedItem, setSelectedItem, ...rest }) {

    const [selected, setSelected] = useState(selectedItem || items[0]);
    const gridCols = horizontal ? `grid-cols-${items.length}` : 'grid-cols-1';

    const onChange = value => {
        if (setSelectedItem) setSelectedItem(value);
        else setSelected(value);
    }

    useEffect(() => {
        setSelected(selectedItem);
    }, [selectedItem])


    return (
        <RadioGroup value={selected} onChange={onChange} {...rest}>
            <div className={`grid gap-4 ${gridCols}`}>
                {items.map((item) => (
                    <RadioGroup.Option
                        key={item.id}
                        value={item}
                        className='w-full relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm outline-none transition-all'>
                        {({ checked }) => (
                            <>
                                <span className="flex flex-1">
                                    <span className="flex flex-col">
                                        <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                                            {item.title}
                                        </RadioGroup.Label>
                                        <RadioGroup.Description as="span" className="mt-1 flex items-center text-sm text-gray-500">
                                            {item.description}
                                        </RadioGroup.Description>
                                    </span>
                                </span>
                                <CheckCircleIcon
                                    className={classNames(!checked ? 'opacity-0' : 'opacity-100', 'h-5 w-5 text-v2-blue-text-login transition-all')}
                                    aria-hidden="true" />
                                <span
                                    className={classNames(
                                        checked ? 'border-v2-blue-text-login ring-1 ring-v2-blue-text-login' : 'border-transparent',
                                        'border-2 transition-all pointer-events-none absolute -inset-px rounded-lg'
                                    )}
                                    aria-hidden="true" />
                            </>
                        )}
                    </RadioGroup.Option>
                ))}
            </div>
        </RadioGroup>
    )
}

Group.propTypes = {
    items: PropTypes.array,
    horizontal: PropTypes.bool,
    selectedItem: PropTypes.object,
    setSelectedItem: PropTypes.func
}

Group.defaultProps = {
    items: [],
    horizontal: false
}

export default Group;