import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Tabs({ items, setItems }) {

    const history = useHistory();
    const [selected, setSelected] = useState(items);

    useEffect(() => {
        setSelected(items);
    }, [items]);

    useEffect(() => {
        if (setItems) setItems(selected)
    }, [selected]);

    const select = index => {
        setSelected(selected.map((item, i) => {
            item.current = index == i;
            return item;
        }))
    }

    const selectValue = value => {
        let newSelected = selected.map((item) => {
            item.current = value == item.name;
            return item;
        });
        let selectedItem = newSelected.find(item => item.current);
        if (selectedItem.href) history.push(selectedItem.href);
        setSelected(selected);
    }

    return (
        <div>
            <div className="lg:hidden">
                <label htmlFor="tabs" className='text-sm'>
                    Selecciona una pestaña
                </label>
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:border-v2-blue-text-login focus:ring-v2-blue-text-login"
                    value={selected.find((tab) => tab.current)?.name}
                    onChange={e => selectValue(e.target.value)}>
                    {selected.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                    ))}
                </select>
            </div>
            <div className="hidden lg:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {selected.map((item, i) => (
                            <div key={item.name}>
                                {item.href ? (
                                    <a
                                        href={item.href}
                                        onClick={() => select(i)}
                                        className={classNames(
                                            item.current
                                                ? 'border-v2-blue-text-login text-v2-blue-text-login'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                            'transition-all group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.icon && (
                                            <item.icon
                                                className={classNames(
                                                    item.current ? 'text-v2-blue-text-login' : 'text-gray-400 group-hover:text-gray-500',
                                                    '-ml-0.5 mr-2 h-5 w-5'
                                                )}
                                                aria-hidden="true"
                                            />
                                        )}
                                        <span>{item.name}</span>
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => select(i)}
                                        className={classNames(
                                            item.current
                                                ? 'border-v2-blue-text-login text-v2-blue-text-login'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                            'transition-all group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.icon && (
                                            <item.icon
                                                className={classNames(
                                                    item.current ? 'text-v2-blue-text-login' : 'text-gray-400 group-hover:text-gray-500',
                                                    '-ml-0.5 mr-2 h-5 w-5'
                                                )}
                                                aria-hidden="true"
                                            />
                                        )}
                                        <span>{item.name}</span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}

Tabs.propTypes = {
    items: PropTypes.array,
    setItems: PropTypes.func
}

export default Tabs;