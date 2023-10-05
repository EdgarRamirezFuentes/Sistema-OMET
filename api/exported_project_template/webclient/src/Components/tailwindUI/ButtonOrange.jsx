import React from 'react';
import PropTypes from 'prop-types';

function ButtonOrange({ isFullWidth, isTransparent, disabled, children, ...rest  }) {
    let styles = isTransparent ? 'bg-transparent hover:bg-button-orange text-button-orange hover:text-white border-button-orange' : 'bg-button-orange hover:bg-hover-orange text-white border-transparent';
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

ButtonOrange.propTypes = {
    isFullWidth: PropTypes.bool,
    isTransparent: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.array
    ])
}

ButtonOrange.defaultProps = {
    isFullWidth: false,
    isTransparent: false,
    disabled: false
}

export default ButtonOrange