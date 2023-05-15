import React, { Fragment, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';
import PrimaryButton from './PrimaryButton';

function Filters({ filters, openSlide, setFilters, setOpenSlide, setFiltersApplied }) {
    const handleGetFilters = () => {
        const newFilters = filters.map(filter => {
            const newOptions = filter.options.map(option => {
                return {
                    ...option,
                    checked: option.applied
                }
            });
            return {
                ...filter,
                options: newOptions
            }
        });
        setFilters(newFilters);
    }

    const handleOpenResume = (id) => {
        const newFilters = filters.map(filter => {
            if(filter.id === id){
                return {
                    ...filter,
                    open: !filter.open
                }
            }
            return filter
        })
        setFilters(newFilters);
    }

    const handleUpdateChecked = (sectionId, optionId) => {
        const newFilters = filters.map(filter => {
            const newOptions = filter.options.map(option => {
                if(filter.id === sectionId && optionId === option.id){
                    return {
                        ...option,
                        checked: !option.checked
                    }
                }
                return option
            });
            return {
                ...filter,
                options: newOptions
            }
        });
        setFilters(newFilters);
    }

    const handleUpdateFilters = (sectionId, optionId, value) => {
        let objRet;
        filters.forEach(filter => {
            filter.options.forEach(option => {
                if(filter.id === sectionId && optionId == option.value){
                    objRet = {
                        ...option,
                        applied: value == 'true' ? true : false
                    }
                }
            });
        });
        return objRet
    }

    const onSubmit = (e, sectionId) => {
        e.preventDefault();
        const arrInputs = Array.from(e.target.elements).filter(item => item.type == 'checkbox');
        const arrOptions = arrInputs.map(item => {
            const box = handleUpdateFilters(sectionId, item.id, item.value);
            return box
        });
        const newFilters = filters.filter(fil => fil.id === sectionId)[0];
        const otherFilters = filters.filter(fil => fil.id !== sectionId);
        const final = [...otherFilters, ...[{ ...newFilters, options: arrOptions }]];
        setFilters(final);
        setFiltersApplied(true);
    }

    const onSubmitMobile = (e) => {
        e.preventDefault();
        let val;
        const arrInputs = Array.from(e.target.elements).filter(item => item.type == 'checkbox');
        const newFilters = filters.map(filter => {
            const newOptions = filter.options.map(option => {
                if(filter.id == option.filter_id){
                    arrInputs.forEach(el => {
                        if(el.id == option.value){
                            val = el.value == 'true' ? true : false
                        }
                        return val
                    })
                    return {
                        ...option,
                        applied: val
                    }
                }
            });
            return {
                ...filter,
                options: newOptions
            }
        });
        setFilters(newFilters);
        setOpenSlide(false);
        setFiltersApplied(true);
    }

    useEffect(() => {
    handleGetFilters();
    }, []);

    return (
        <>
            <Popover.Group className="hidden md:flex md:items-baseline md:space-x-6">
                {filters.sort((a,b) => Number(a.id) - Number(b.id)).map((section, sectionIdx) => (
                    <Popover as="div" key={section.name} id={`desktop-menu-${sectionIdx}`} className="relative inline-block text-left">
                        <div>
                            <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900" onClick={handleGetFilters}>
                            <span>{section.name}</span>
                            <span className="ml-1.5 rounded bg-gray-200 py-0.5 px-1.5 text-xs font-semibold tabular-nums text-gray-700">
                                { section.options.filter(opt => opt.applied).length }
                            </span>
                            <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            </Popover.Button>
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
                            <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {({ close }) => (
                                <form className="space-y-4" onSubmit={(e) => onSubmit(e, section.id)}>
                                    {section.options.map((option) => (
                                        <div key={option.value} className="flex items-center">
                                            <input
                                            id={option.value}
                                            name={option.value}
                                            defaultValue={option.checked}
                                            type="checkbox"
                                            checked={ option.checked }
                                            onChange={ () => handleUpdateChecked(section.id, option.id) }
                                            className="h-4 w-4 rounded border-gray-300 text-v2-blue-text-login focus:ring-transparent cursor-pointer"
                                            />
                                            <label htmlFor={option.value} className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                    <button className={`w-full py-1.5 px-3 text-white text-sm rounded-md ${(!section.options.some(fil => fil.checked) && section.options.every(fil => !fil.applied)) ? 'bg-gray-300 cursor-not-allowed' : 'bg-v2-blue-text-login cursor-pointer'}`} disabled={ (!section.options.some(fil => fil.checked) && section.options.every(fil => !fil.applied) )} onClick={ () => close() }>
                                        Aplicar
                                    </button>
                                </form>
                                )}
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                ))}
            </Popover.Group>
            {openSlide &&
                <form className="w-full mt-4 md:hidden absolute -ml-4 sm:-ml-6" onSubmit={onSubmitMobile}>
                    <div className='w-full h-[calc(100vh-18rem)] overflow-y-scroll pb-12'>
                        {filters.map((section) => (
                            <ul role="list" key={section.name} className="w-full divide-y divide-gray-200 text-sm text-gray-900">
                                <div className='w-full border-t border-gray-200 px-4 py-4'>
                                    <div className='w-full flex justify-between'>
                                        <div>
                                            <span className="font-medium text-gray-900">{section.name}</span>
                                            <span className="ml-1.5 rounded bg-gray-200 py-0.5 px-1.5 text-xs font-semibold tabular-nums text-gray-700">
                                                { section.options.filter(opt => opt.applied).length }
                                            </span>
                                        </div>
                                        <span className="ml-6 flex items-center text-gray-400">
                                            <ChevronDownIcon className={`${ section.open ? '-rotate-180' : 'rotate-0'} 'h-5 w-5 transform duration-200`} onClick={ () => handleOpenResume(section.id) } />
                                        </span>
                                    </div>
                                    <div className={`${section.open ? 'block' : 'hidden'} space-y-6 mt-4`}>
                                    {section.options.map((option) => (
                                        <div key={option.value} className="flex items-center">
                                            <input
                                                id={option.value}
                                                name={option.value}
                                                defaultValue={option.checked}
                                                type="checkbox"
                                                checked={ option.checked }
                                                onChange={ () => handleUpdateChecked(section.id, option.id) }
                                                className="h-4 w-4 rounded border-gray-300 text-v2-blue-text-login focus:ring-transparent"
                                            />
                                            <label htmlFor={option.value} className="ml-3 text-sm text-gray-500">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </ul>
                        ))}
                    </div>
                    <div className='w-full pt-2 bg-white px-4'>
                        <PrimaryButton isFullWidth={true} disabled={ !filters.map(fil => fil.options).flatMap(opt => opt).some(item => item.checked) && filters.map(fil => fil.options).flatMap(opt => opt).every(item => !item.applied)}>
                            Aplicar
                        </PrimaryButton>
                    </div>
                </form>
            }
        </>
    )
}

Filters.propTypes = {
    filters: PropTypes.array,
    openSlide: PropTypes.bool,
    setFilters: PropTypes.func,
    setOpenSlide: PropTypes.func,
    setFiltersApplied: PropTypes.func
}

Filters.defaultProps = {
    openSlide: false
}

export default Filters