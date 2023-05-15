import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function BreadCrumb({ roadMap }) {
    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2">
                {roadMap.map((page) => (
                    <>
                        <li key={page.name}>
                            <div className="flex items-center">
                                {page.current ?
                                    <span className='text-sm font-medium text-gray-500 hover:text-gray-700'>
                                        { page.name }
                                    </span>
                                    :
                                    <Link className='text-sm font-medium text-gray-500 hover:text-gray-700' to={page.url}>
                                        {page.name}
                                    </Link>
                                }
                            </div>
                        </li>
                        <li className='last:hidden'>
                            <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        </li>
                    </>
                ))}
            </ol>
        </nav>
    )
}

BreadCrumb.propTypes = {
    roadMap: PropTypes.arrayOf(PropTypes.object)
}

export default BreadCrumb