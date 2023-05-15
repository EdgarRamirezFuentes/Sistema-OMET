import React from 'react';
import useFormatterCurrency from '../hooks/useFormatterCurrency';
import useFormatDate from '../hooks/useFormatDate';
import { ChevronDownIcon, TagIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import Badge from './Badge';
import PropTypes from 'prop-types';
import LinkButton from './LinkButton';
import LinkInput from './LinkInput';

const paymentInterval = {
    'week': {
        1: 'Semanal'
    },
    'half_month': {
        1: 'Quincenal'
    },
    'month': {
        1: 'Mensual',
        2: 'Bimestral',
        3: 'Trimestral',
        6: 'Semestral',
        12: 'Anual',
    },
    'year': {
        1: 'Anual'
    }
}

function PaymentInstruction({ data, setData, setDeleteId, setOpenModal, setEditId, setOpenEditModal, servicesDisplay, viewOnly }) {
    const { formatterCurrency } = useFormatterCurrency();
    const { formatDate } = useFormatDate();

    const handleOpenResumeServices = (sku, status) => {
        const modifiedOpen = data.map(x => {
            const ser = x.services.map(y => {
                if (y.sku == sku) {
                    return {
                        ...y,
                        resume_open: !status
                    }
                } else {
                    return {
                        ...y,
                        resume_open: false
                    }
                }
            })
            return {
                ...x,
                services: ser
            }
        });
        if (setData) setData(modifiedOpen);
    }

    const handleDeleteModal = id => {
        setDeleteId(id);
        setOpenModal(true);
    }

    const handleEditModal = id => {
        setEditId(id);
        setOpenEditModal(true);
    }

    const updateInstructionsNotes = (id, value) => {
        const newInstructions = data.map(instruction => {
            if (instruction.id === id) {
                return {
                    ...instruction,
                    notes: value
                }
            }
            return instruction
        });
        setData(newInstructions);
    }

    return (
        <>
            {data.map((item, i) => (
                <div className='w-full mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden' key={i}>
                    <div className='w-full border-b border-gray-200 px-4 py-5 sm:px-6 flex items-center gap-4 justify-between'>
                        <div className='text-gray-900 font-medium block sm:flex items-center gap-4'>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Acuerdo de pago</h3>
                            <span className='block mt-1 sm:mt-0'>
                                <Badge text={item.payment_type == 'unique' ? 'Cobro único' : item.payment_type == 'partial' ? 'Cobros diferidos' : item.payment_type == 'subscription' ? 'Suscripción' : ''} />
                            </span>
                        </div>
                        {!viewOnly &&
                            <div className='flex flex-col gap-2 sm:flex-row sm:gap-4 items-end'>
                                <LinkButton onClick={() => handleEditModal(item.id)}>
                                    Editar
                                </LinkButton>
                                <LinkButton onClick={() => handleDeleteModal(item.id)}>
                                    Eliminar
                                </LinkButton>
                            </div>
                        }
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="px-4 py-4 lg:px-6">
                            <div className='text-gray-900 font-medium text-base'>
                                Condiciones de cobro
                            </div>
                            <div className='w-full text-sm text-gray-600 pt-4'>
                                <span className='block pb-0.5'>Métodos de pago: </span>
                                {item.allowed_payment_methods.map((method, i) => (
                                    <div key={i} className='pl-3 text-gray-900 font-medium flex items-center gap-2 pt-1'>
                                        <FontAwesomeIcon icon={faCircle} className='text-[6px] mt-[-1px] leading-none text-gray-300' />
                                        <div>
                                            {(() => {
                                                switch (method) {
                                                    case 'card':
                                                        return <span>Tarjeta de crédito/débito</span>
                                                    case 'paypal':
                                                        return <span>Paypal</span>
                                                    case 'cash':
                                                        return <span>Efectivo</span>
                                                    case 'transfer':
                                                        return <span>Transferencia (SPEI)</span>
                                                    default:
                                                        return ''
                                                }
                                            })()}
                                        </div>
                                    </div>
                                ))
                                }
                            </div>
                            {item.payment_type == 'unique' &&
                                <>
                                    <div className='w-full text-sm text-gray-600 pt-4'>
                                        {item.monthly_installments_enabled ?
                                            <span className='block'>Número de cobros: <span className='text-gray-900 font-medium'>{`Hasta ${item.monthly_installments_options.at(-1)} MSI`}</span></span>
                                            :
                                            <span className='block'>Número de cobros: <span className='text-gray-900 font-medium'>1 sola exhibición</span></span>
                                        }
                                    </div>
                                </>
                            }
                            {item.payment_type == 'partial' &&
                                <>
                                    <div className='w-full text-sm text-gray-600 pt-4'>
                                        <span className='block pb-0.5'>Fechas de pago:</span>
                                        {item.payment_dates.map((pay, i) => (
                                            <div key={i} className='pl-3 text-gray-900 font-medium flex items-center gap-2 pt-1'>
                                                <FontAwesomeIcon icon={faCircle} className='text-[6px] leading-none mt-[-1px] text-gray-300' />
                                                <div className='flex'>
                                                    <span className='min-w-[10.5rem]'>{pay.date == 'Now' ? 'Al suscribir' : (formatDate(pay.date, 'DD [de] MMMM YYYY') || '')}: </span>
                                                    <span className='text-right'>{isNaN(pay.total) ? formatterCurrency(pay.amount / 100) : formatterCurrency(pay.total)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {item.valid_days &&
                                        <span className='w-full text-sm text-gray-600 pt-4 block'>
                                            Día de vigencia:
                                            <span className='text-gray-900 font-medium'>{item.valid_days}</span>
                                        </span>
                                    }
                                </>
                            }
                            {item.payment_type == 'subscription' &&
                                <>
                                    <span className='text-sm text-gray-600 pt-4 block'>Frecuencia:
                                        <span className='text-gray-900 font-medium pl-1'>
                                            {paymentInterval[item.subscription_info.interval][item.subscription_info.frequency]}
                                        </span>
                                    </span>
                                    <span className='w-full text-sm text-gray-600 pt-4 block'>
                                        Número de cobros:
                                        <span className='text-gray-900 font-medium'> {item.subscription_info.expiry_count === 0 ? 'Indefinido' : item.subscription_info.expiry_count}</span>
                                    </span>
                                    <span className='w-full text-sm text-gray-600 block pt-4'>
                                        Fecha de inicio:
                                        <span className='text-gray-900 font-medium'> {formatDate(item.subscription_info.start_date, 'DD [de] MMMM YYYY')}</span>
                                    </span>
                                    {item.subscription_info.apply_charge &&
                                        <span className='w-full text-sm text-gray-600 block'>*Se realizará el primer cobro al suscribir</span>
                                    }
                                </>
                            }
                            <div className='w-full text-sm text-gray-600 pt-4'>
                                <span>Fecha límite de pago: <span className='text-gray-900 font-medium'>{formatDate(item.expires_at, 'DD [de] MMMM YYYY')}</span></span>
                            </div>
                            {item.payment_type != 'unique' && item.next_payment_date &&
                                <span className='w-full text-gray-900 block pt-4 font-medium'>
                                    Próxima fecha de pago:
                                    <span> {item.next_payment_date == 'Now' ? 'Al suscribir' : (formatDate(item.next_payment_date, 'DD [de] MMMM YYYY') || '')}</span>
                                </span>
                            }
                            {!viewOnly &&
                                <div className='w-full py-4'>
                                    <span className='block text-gray-600 text-sm mb-1'>Notas:</span>
                                    <textarea
                                        id={i}
                                        maxLength={120}
                                        placeholder='Agrega una nota a este acuerdo de pago.'
                                        inputMode='text'
                                        rows={2}
                                        defaultValue={item.notes}
                                        onBlur={(e) => updateInstructionsNotes(item.id, e.target.value)}
                                        className='w-full text-base md:text-sm text-gray-600 border border-gray-300 rounded-md p-3 focus:ring-v2-blue-text-login focus:border-v2-blue-text-login' />
                                </div>
                            }
                            {viewOnly && item.notes &&
                                <div className='w-full py-4'>
                                    <span className='block text-gray-600 text-sm mb-1'>Notas:</span>
                                    <span className='text-gray-900 font-medium text-sm '> {item.notes}</span>
                                </div>
                            }
                        </div>
                        <section aria-labelledby="summary-heading" className="bg-gray-50/50 px-4 py-4 lg:bg-transparent lg:px-6 border-t lg:border-l lg:border-t-0 border-gray-200">
                            <div>
                                <h2 id="summary-heading" className="text-base font-medium text-gray-900 mb-1">
                                    Resumen de servicios
                                </h2>
                                <ul role="list" className="divide-y divide-gray-200 text-sm text-gray-900">
                                    {item.services.map((service, i) => {
                                        const total =  service.total != undefined ? service.total : (service.price?.total_amount / 100);
                                        const subtotal = service.subtotal != undefined ? service.subtotal : (service.price?.subtotal_amount / 100);
                                        return (
                                            <div key={i} className='w-full first:border-none border-t border-gray-200 py-2 cursor-pointer' onClick={() => handleOpenResumeServices(service.sku, service.resume_open)} >
                                                <div className='w-full flex justify-between items-center gap-2'>
                                                    <div className="text-sm text-gray-600 font-medium">
                                                        {service.name}
                                                    </div>
                                                    <div className="flex justify-end items-center xs:gap-2 md:gap-6">
                                                        {service.total - service.subtotal == 0 || service.price?.discount == 0 ?
                                                            <div className="text-sm">
                                                                <div className="text-gray-600 font-medium flex items-center gap-1">
                                                                    {formatterCurrency(total)}
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className="text-sm">
                                                                <div className="text-v2-blue-text-login font-medium flex items-center gap-1">
                                                                    {formatterCurrency(total)} <TagIcon className='w-4 h-4 min-w-[16px] min-h-[16px]' />
                                                                </div>
                                                                <div className="text-gray-400 line-through">
                                                                    {formatterCurrency(subtotal)}
                                                                </div>
                                                            </div>
                                                        }
                                                        <div>
                                                            <div className="w-full text-gray-700 flex justify-end">
                                                                <ChevronDownIcon className={`${service.resume_open ? 'rotate-180' : ''} transition duration-200 w-6 h-6 min-w-[24px] min-h-[24px]`} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {service.resume_open &&
                                                    <div className="w-full py-2 border-t border-gray-200 mt-2">
                                                        <div className="w-full flex text-sm">
                                                            <div className="w-1/2 text-gray-600">
                                                                Periodos
                                                            </div>
                                                            <div className="w-1/2 flex justify-end text-v2-orange-text-dates-quantity">
                                                                Cantidad: {service.quantity} periodos
                                                            </div>
                                                        </div>
                                                        <div className="w-full mt-1">
                                                            {servicesDisplay.filter(date => date.sku == service.sku).map((ser, i) => (
                                                                <div key={i} className="w-full flex gap-2 flex-wrap max-w-[100%]">
                                                                    {ser.dates_display.map((date, i) => (
                                                                        <div key={i} className="w-auto bg-v2-blue-text-login/20 text-v2-blue-text-login py-2 text-xs rounded flex items-center px-2">
                                                                            <div className="w-full text-center min-w-[40px]">
                                                                                {service.periodicity == 'yearly' ? date.year : date.tag}
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                    }
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="w-full text-gray-600 text-sm mt-3">
                                                            Notas:
                                                        </div>
                                                        <div className="w-full text-sm text-gray-600">
                                                            {service.notes || 'Ninguna nota agregada'}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        )
                                    })}
                                </ul>
                                <dl className="space-y-4 border-t border-gray-200 pt-4 text-sm font-medium text-gray-900 block">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-gray-600">Cantidad de servicios</dt>
                                        <dd>{item.services.length}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-gray-600">Subtotal</dt>
                                        <dd>{formatterCurrency(item.services.map(service => service.subtotal).reduce((prev, curr) => prev + curr, 0))}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-gray-600">Descuento</dt>
                                        <dd>{formatterCurrency(item.services.map(service => service.discount_amount).reduce((prev, curr) => prev + curr, 0))}</dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                        <dt className="text-base">Total</dt>
                                        <dd className="text-base">{formatterCurrency(item.services.map(service => service.total).reduce((prev, curr) => prev + curr, 0))}</dd>
                                    </div>
                                </dl>
                            </div>
                        </section>
                    </div>
                    {viewOnly && item.payment_links && item.payment_links.length > 0 && (
                        <div className='w-full px-4 py-4 lg:px-6 border-t'>
                            <div className='text-gray-900 font-medium text-lg'>
                                Links de cobro
                            </div>
                            <div className='divide-y divide-gray-200 divide-dashed'>
                                {item.payment_links.map((link, i) => (
                                    <div key={i} className="py-3 last:pb-0">
                                        <LinkInput
                                            label={link.title}
                                            link={link.url}
                                            shortLink={link.short_url}
                                            disabled={link.status != 'pending'} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </>
    )
}

PaymentInstruction.propTypes = {
    data: PropTypes.array,
    setData: PropTypes.func,
    setDeleteId: PropTypes.func,
    setOpenModal: PropTypes.func,
    setEditId: PropTypes.func,
    setOpenEditModal: PropTypes.func,
    servicesDisplay: PropTypes.array,
    viewOnly: PropTypes.bool
}

PaymentInstruction.defaultProps = {
    viewOnly: false
}

export default PaymentInstruction