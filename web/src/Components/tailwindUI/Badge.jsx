import React from 'react';
import PropTypes from 'prop-types'

function Badge({ text, type }) {
    
    const colorBadgeBy = {
        'Default': 'bg-blue-100 text-v2-blue-text-login',
        'Success': 'bg-green-100 text-green-800',
        'Warning': 'bg-orange-100 text-button-orange',
        'Error': 'bg-red-100 text-red-800',
        'Info': 'bg-gray-100 text-gray-800'
    }
    const colorBadge = {
        'pending': 'bg-orange-100 text-button-orange',
        'active': 'bg-green-100 text-green-800',
        'completed': 'bg-green-100 text-green-800',
        'paid': 'bg-green-100 text-green-800',
        'success': 'bg-green-100 text-green-800',
        'suspended': 'bg-indigo-100 text-indigo-800',
        'canceled': 'bg-red-100 text-red-800',
        'cancelled': 'bg-red-100 text-red-800',
        'failed': 'bg-red-100 text-red-800',
        'declined': 'bg-red-100 text-red-800',
        'pagado': 'bg-green-100 text-green-800',
        'fallido': 'bg-red-100 text-red-800',
        'expirado': 'bg-gray-100 text-gray-800',
        'cancelado': 'bg-red-100 text-red-800',
        'past_due': 'bg-red-100 text-red-800',
        'unpaid': 'bg-red-100 text-red-800'
    }
    const translateStatus = {
        'pending': 'Pendiente',
        'trial': 'En prueba',
        'in_trial': 'En prueba',
        'past_due': 'Vencida',
        'unpaid': 'Vencida',
        'active': 'Activo',
        'success': 'Exitoso',
        'suspended': 'Suspendido',
        'canceled': 'Cancelado',
        'cancelled': 'Cancelado',
        'failed': 'Fallido',
        'paid': 'Pagado',
        'declined': 'Fallido',
        'completed': 'Completado',
    }

    return (
        <span className={`inline-flex items-center rounded-full ${colorBadgeBy[type] || (colorBadge[text?.toLowerCase()] || 'bg-blue-100 text-v2-blue-text-login')} px-3 py-0.5 text-sm font-semibold min-w-[60px] text-center`}>
            {translateStatus[text?.toLowerCase()] || text}
        </span>
    )
}

Badge.propTypes = {
    text: PropTypes.string,
    type: PropTypes.oneOf(['Default', 'Success', 'Warning', 'Error', 'Info']),
}

export default Badge