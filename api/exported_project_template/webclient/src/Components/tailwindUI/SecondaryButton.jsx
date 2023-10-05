import React from 'react';
import PropTypes from 'prop-types';


function SecondaryButton({ isFullWidth, disabled, children, ...rest }) {
    return (
        <button {...rest}
            disabled={disabled}
            className={`${isFullWidth && 'w-full'} ${disabled ? 'bg-[#E5E7EB] border-[#D1D5DB] text-[#D1D5DB]' : 'bg-white  hover:bg-[#E5E7EB] text-[#6B7280] border-[#D1D5DB]'} transition-all inline-flex items-center justify-center px-4 py-2 border shadow-sm text-base font-medium rounded-md`}>
            {children}
        </button>
    )
}

SecondaryButton.propTypes = {
    isFullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.array
    ])
}

SecondaryButton.defaultProps = {
    isFullWidth: false,
    disabled: false
}

export default SecondaryButton