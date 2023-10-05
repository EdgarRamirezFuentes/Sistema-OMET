import React from 'react';
import PropTypes from 'prop-types';

function LinkButton({ disabled, children, ...rest }) {
    return (
        <button 
            disabled={disabled}
            {...rest}
            className={`${disabled ? 'text-gray-300' : 'text-button-orange'} underline rounded-md font-medium`}>
            {children}
        </button>
    )
}

LinkButton.propTypes = {
    disabled: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.array
    ])
}

LinkButton.defaultProps = {
    disabled: false
}

export default LinkButton;