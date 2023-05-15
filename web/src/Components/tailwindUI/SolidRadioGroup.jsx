import React, { useState, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react';
import PropTypes from 'prop-types';


function SolidRadioGroup({ items, horizontal, selectedItem, setSelectedItem, label, needed, ...rest }) {

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
                {label && (
                    <RadioGroup.Label className="block text-sm font-medium text-gray-700">
                        {label}
                        {needed && <span className='text-red-400'> *</span>}
                    </RadioGroup.Label>
                )}
                {items.map((item) => (
                    <RadioGroup.Option
                        key={item.id}
                        value={item}
                        className={({ checked }) =>
                            `${checked ? 'bg-v2-blue-text-login border-transparent' : 'bg-white'} w-full relative flex cursor-pointer rounded-lg border p-2 shadow-sm transition-all`
                        }>
                        {({ checked }) => (
                            <>
                                <span className="flex flex-1 justify-center">
                                    <span className="flex flex-col">
                                        <RadioGroup.Label as="span" className={`${checked ? 'text-gray-100' : 'text-gray-900'} block text-sm font-medium transition-all`}>
                                            {item.title}
                                        </RadioGroup.Label>
                                    </span>
                                </span>
                            </>
                        )}
                    </RadioGroup.Option>
                ))}
            </div>
        </RadioGroup>
    )
}

SolidRadioGroup.propTypes = {
    items: PropTypes.array,
    horizontal: PropTypes.bool,
    selectedItem: PropTypes.object,
    setSelectedItem: PropTypes.func,
    label: PropTypes.string,
    needed: PropTypes.bool
}

SolidRadioGroup.defaultProps = {
    items: [],
    horizontal: false
}

export default SolidRadioGroup;