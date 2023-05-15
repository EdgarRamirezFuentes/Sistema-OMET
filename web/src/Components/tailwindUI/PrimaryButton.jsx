import React from 'react';
import PropTypes from 'prop-types';

function PrimaryButton({ isFullWidth, isTransparent, disabled, children, ...rest  }) {
    let styles = isTransparent ? 'bg-transparent text-v2-blue-text-login border-v2-blue-text-login' : 'bg-v2-blue-text-login text-white border-transparent';
    if (disabled){
        styles = isTransparent ? 'border-v2-gray-border-tables text-v2-gray-border-tables' : 'bg-v2-gray-border-tables/50 border-v2-gray-border-tables text-v2-gray-border-tables'
    }
    return (
        <button 
            disabled={disabled}
            {...rest}
            className={`${isFullWidth && 'w-full'} ${styles} transition-all inline-flex items-center justify-center px-4 py-2 border shadow-sm text-base font-medium rounded-md`}>
            {children}
        </button>
    )
}


PrimaryButton.propTypes = {
    isFullWidth: PropTypes.bool,
    isTransparent: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.array
    ])
}

PrimaryButton.defaultProps = {
    isFullWidth: false,
    isTransparent: false,
    disabled: false
}

export default PrimaryButton