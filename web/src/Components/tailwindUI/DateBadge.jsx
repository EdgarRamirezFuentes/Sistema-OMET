import React from 'react';
import useGetStatusExpired from '../hooks/useGetStatusExpired';
import useFormatDate from '../hooks/useFormatDate';
import PropTypes from 'prop-types';

function DateBadge({ date }) {
    const { getStatusExpired } = useGetStatusExpired();
    const { formatDate } = useFormatDate();
    const colorStates = {
        'expires-soon': 'bg-orange-100 text-button-orange',
        'up-to-date': 'bg-green-100 text-green-800',
        'expired': 'bg-red-100 text-red-800',
    }
    return (
        <span className={`inline-flex items-center rounded-full ${colorStates[getStatusExpired(date)] === undefined ? 'bg-blue-100 text-v2-blue-text-login' : colorStates[getStatusExpired(date)]} px-3 py-0.5 text-sm font-semibold min-w-[60px] text-center`}>
            { formatDate(date, 'DD MMMM YYYY') || date }
        </span>
    )
}

DateBadge.propTypes = {
    date: PropTypes.number
}

export default DateBadge