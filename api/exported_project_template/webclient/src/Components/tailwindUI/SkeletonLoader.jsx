import React from 'react';
import PropTypes from 'prop-types'; PropTypes

const sizes = {
    'xs': 'h-4',
    'sm': 'h-5',
    'base': 'h-6',
    'lg': 'h-7',
    'xl': 'h-7',
    '2xl': 'h-8',
    '3xl': 'h-11'
}


function SkeletonLoader({ size }) {
    return (
        <div className={`${sizes[size] || 'h-4'} animate-pulse bg-gray-300 w-full rounded-full`} />
    )
}

SkeletonLoader.propTypes = {
    size: PropTypes.oneOf(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'])
};

SkeletonLoader.defaultProps = {
    size: 'xs'
}

export default SkeletonLoader;