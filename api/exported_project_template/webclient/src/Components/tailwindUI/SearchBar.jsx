import React, { useState, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

function SearchBar({ value, setValue, placeholder_mobile, placeholder_desktop, ...rest }) {
    const [error, setError] = useState(null);
    const windowSize = useRef(window.innerWidth);
    const onSubmit = (e) => {
        e.preventDefault();
        let err = {}
        const searchValue = e.target.elements.search.value;
        if((value === null && searchValue === '') || (value == '' && searchValue === '')){
            err.name = 'Ingresa el valor que deseas buscar'
        }
        if(Object.keys(err).length === 0){
            setValue(e.target.elements.search.value);
        } else {
            setError(err);
        }
    }
    return (
        <div className="w-full">
            <div className="flex items-center">
                <div className="w-full">
                    <label htmlFor="search" className="sr-only">
                        Buscar
                    </label>
                    <form className="relative" onSubmit={onSubmit}>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            id="search"
                            name="search"
                            defaultValue={value}
                            className={`block w-full rounded-md border ${error !== null ? 'border-red-500 focus:ring-transparent focus:border-red-500' : 'border-gray-300 focus:ring-1 focus:ring-v2-blue-text-login focus:border-v2-blue-text-login'} bg-white py-2.5 pl-9 pr-4 text-base placeholder-gray-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none`}
                            placeholder={ (windowSize.current < 768 ? placeholder_mobile : placeholder_desktop) || placeholder_mobile}
                            type="search"
                            {...rest}
                        />
                        <button type="submit" className="text-white absolute right-0 bottom-0 bg-v2-blue-text-login focus:ring-4 focus:outline-none focus:ring-transparent font-medium rounded-r-md text-sm px-4 py-[13px]">Buscar</button>
                    </form>
                    {error !== null && <span className='w-full text-red-500 text-sm'>{ error.name }</span>}
                </div>
            </div>
        </div>
    )
}

SearchBar.propTypes = {
    value: PropTypes.string,
    setValue: PropTypes.func,
    placeholder_mobile: PropTypes.string,
    placeholder_desktop: PropTypes.string
}

SearchBar.defaultProps = {
    placeholder_mobile: 'Buscar',
    placeholder_desktop: 'Buscar'
}

export default SearchBar