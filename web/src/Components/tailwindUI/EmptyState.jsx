import React from 'react';
import PropTypes from 'prop-types';

function EmptyState({ title, text, children }) {
    return (
        <div className='w-full bg-white py-16 border border-gray-200 px-4 text-center rounded-md'>
            <div>
                <img 
                alt='Botxi - crea una incidencia'
                src='https://cdn.fixat.mx/intranet/botxi.png'
                className='w-[105px] h-[132px] mx-auto'
                />
            </div>
            <div className='text-gray-900 font-medium text-2xl text-center mt-4'>
                { title }
            </div>
            <div className='text-gray-600 mt-2'>
                { text } 
            </div>
            { children }
        </div>
    )
}

EmptyState.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    children: PropTypes.any

}

export default EmptyState