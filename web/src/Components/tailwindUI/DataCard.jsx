import React from 'react';
import PropTypes from 'prop-types';

function DataCard({ title, primaryText, secondaryText }) {
    return (
        <div className='w-full rounded-lg border border-gray-300 shadow-sm bg-white px-4 py-2 md:py-3.5 flex items-center'>
            <span className='w-full block text-sm font-normal text-gray-900 '>
                {title}: 
                    <span className='pl-1.5 text-sm font-medium text-gray-900 pt-4'>
                        {primaryText} / 
                            <span className='text-sm text-gray-900 font-medium pl-[5px]'>
                                {secondaryText}
                            </span>
                    </span>
            </span>
        </div>
    )
}

DataCard.propTypes = {
    title: PropTypes.string,
    primaryText: PropTypes.string,
    secondaryText: PropTypes.string
}

DataCard.defaultProps = {
    title: 'Contribuyente',
    primaryText: 'Nombre',
    secondaryText: 'RFC'
}

export default DataCard

/*
<div className='w-full rounded-lg border border-gray-300 shadow-sm bg-white p-4'>
    <span className='w-full block text-sm font-medium text-gray-900 '>
        Contratante
    </span>
    <span className='w-full block text-sm font-medium text-gray-900 pt-4'>
        Angel Suárez Ballato
    </span>
    <span className='w-full block text-sm text-gray-500 pt-2'>
        {data.map(item => item).join(' / ')}
    </span>
</div>
*/