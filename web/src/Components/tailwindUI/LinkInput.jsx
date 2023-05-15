import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import Notification from './Notification';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';

function LinkInput({ label, name, id, placeholder, link, shortLink, disabled, ...rest }) {

    const [currentLink, setCurrentLink] = useState(link || shortLink);
    const [linkCopied, copy] = useCopyToClipboard();

    return (
        <>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="flex rounded-md shadow-sm">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                    {link && shortLink &&
                        <div className="absolute inset-y-0 left-0 flex items-center">
                            <label htmlFor="country" className="sr-only">
                                Link
                            </label>
                            <select
                                id="link"
                                name="link"
                                disabled={disabled}
                                onChange={(e) => setCurrentLink(e.target.value)}
                                className="cursor-pointer transition-all h-full rounded-md border-transparent bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:border-transparent focus:ring-transparent sm:text-sm">
                                <option value={link}>Original</option>
                                <option value={shortLink}>Corto</option>
                            </select>
                        </div>
                    }
                    <input
                        type="text"
                        name={name}
                        id={id}
                        placeholder={placeholder}
                        value={currentLink}
                        className={`${!link || !shortLink ? 'pl-3' : 'pl-[5.5rem] sm:pl-[5.25rem]'} ${disabled && 'opacity-80 bg-gray-200 select-none'} transition-all block w-full rounded-none rounded-l-md border-gray-300 focus:border-v2-blue-text-login focus:ring-v2-blue-text-login sm:text-sm`}
                        readOnly
                        disabled={disabled}
                        {...rest}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => (currentLink && !disabled) && copy(currentLink)}
                    className={`${linkCopied ? 'bg-green-500 border-green-500' : 'bg-button-orange border-button-orange'} ${disabled && 'opacity-80 bg-gray-500 border-gray-500 cursor-default'} transition-all relative w-14 -ml-px inline-flex items-center justify-center space-x-2 rounded-r-md border px-4 py-2 text-sm font-medium text-white`}>
                    <div className='relative w-full h-full'>
                        <ClipboardDocumentIcon className={`${!linkCopied ? 'opacity-100' : 'opacity-0'} inset-0 absolute transition-all h-5 w-5 text-white`} aria-hidden="true" />
                        <ClipboardDocumentCheckIcon className={`${linkCopied ? 'opacity-100' : 'opacity-0'} inset-0 absolute transition-all h-5 w-5 text-white`} aria-hidden="true" />
                        {/*<span className={`${linkCopied ? 'opacity-100' : 'opacity-0'} inset-0 absolute transition-all`}>Copiado</span>
                        <span className={`${linkCopied ? 'opacity-0' : 'opacity-100'} inset-0 absolute transition-all`}>Copiar</span>*/}
                    </div>
                </button>
            </div>
            <Notification show={linkCopied != null} message='¡Link copiado con éxito!' />
        </>
    )
}

LinkInput.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    placeholder: PropTypes.string,
    link: PropTypes.string,
    shortLink: PropTypes.string,
    disabled: PropTypes.bool
}

export default LinkInput;