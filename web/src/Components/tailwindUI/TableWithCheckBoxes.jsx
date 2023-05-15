import React from 'react';
import useFormatterCurrency from '../hooks/useFormatterCurrency';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import PropTypes from 'prop-types';

function TableWithCheckBoxes({ total, services, setServices, setServicesToPay }) {
    const { formatterCurrency } = useFormatterCurrency();
    const headers = [
        { title: 'Servicio' },
        { title: 'Cantidad' },
        { title: 'Precio unitario', align: 'right' },
        { title: 'Descuento', align: 'right' },
        { title: 'Precio total', align: 'right' }
    ]

    const handleUnselectedAll = isSelected => {
        const selectedAll = services.map( service => {
            if(service.completed){
                return service
            } else {
                return {
                    ...service,
                    selected: !isSelected,
                }
            }
        });
        const packServices = selectedAll.filter(service => service.selected && !service.completed);
        setServices(selectedAll);
        setServicesToPay(packServices);
    }

    const handleSelect = sku => {
        const selectOne = services.map( service => {
            if(service.sku == sku) {
                return {
                    ...service,
                    selected: !service.selected
                }
            }
            return service
        });
        const packServices = selectOne.filter(service => service.selected && !service.completed);
        setServices(selectOne);
        setServicesToPay(packServices);
    }

    const handleOpenResume = sku => {
        const serviceOpened = services.map(item => {
            if(item.sku === sku){
                return {
                    ...item,
                    resume_open: !item.resume_open
                }
            } else {
                return {
                    ...item,
                    resume_open: false
                }
            }
        });
        setServices(serviceOpened);
        setServicesToPay(serviceOpened);
    }

    return (
        <>
            <div className="flex flex-col">
                <div>
                    <div className="hidden md:inline-block min-w-full py-2 align-middle">
                        <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full table-fixed divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="relative w-16">
                                            <input
                                                type="checkbox"
                                                className="absolute left-4 top-1/2 -mt-2.5 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-transparent sm:left-5 cursor-pointer"
                                                checked={ services.some(item => item.selected && !item.completed) }
                                                onChange={() => handleUnselectedAll(services.some( item => item.selected && !item.completed ))}
                                            />
                                        </th>
                                        {headers.map((header, i) => (
                                            <th key={i} scope="col" className={`${header.align ? `text-${header.align}` : ''} pr-2 py-3.5 text-left text-sm font-medium text-gray-600`}>
                                                { header.title.toUpperCase() }
                                            </th>
                                        ))
                                        }
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {services.sort((a,b) => Number(a.completed) - Number(b.completed)).map((item) => (
                                        <tr key={item.sku} className={`${item.completed ? 'bg-gray-200/60 cursor-not-allowed' : 'bg-white'}`}>
                                            <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                                                {item.selected && (
                                                    <div className={`absolute inset-y-0 left-0 w-0.5 ${item.completed ? 'bg-gray-400' : 'bg-green-600'}`} />
                                                )}
                                                <input
                                                type="checkbox"
                                                className={`absolute left-4 top-1/2 -mt-2.5 h-5 w-5 rounded border border-gray-300 ${item.completed ? 'text-gray-400/60' : 'text-green-600'} focus:ring-transparent sm:left-5 ${item.completed ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                value={false}
                                                disabled={ item.completed }
                                                readOnly={ item.completed }
                                                checked={item.selected}
                                                onChange={ () => handleSelect(item.sku)
                                                }
                                                />
                                            </td>
                                            <td className='py-4 pr-2 text-sm text-gray-900 cursor-default' onClick={ () => handleSelect(item.sku) }>{item.name}</td>
                                            <td className="pr-2 py-4 text-sm text-gray-500">{item.quantity}</td>
                                            <td className="pr-2 py-4 text-sm text-gray-500 text-right">{formatterCurrency(item.amount)}</td>
                                            <td className="pr-2 py-4 text-sm text-gray-500 text-right">{formatterCurrency(item.discount_amount)}</td>
                                            <td className="pr-2 py-4 text-sm text-v2-blue-text-login font-semibold text-right">
                                                <span className={`${ item.discount_amount <= 0 ? 'hidden' : 'inline-block' } pr-2 line-through text-gray-500`}>{formatterCurrency(item.subtotal)}</span>{formatterCurrency(item.total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='w-full bg-white px-5 py-3 border-t border-gray-300 flex justify-between services-center gap-3'>
                                <div className='w-3/4 text-xl text-gray-900 font-medium flex services-center gap-3'>
                                    Total
                                </div>
                                <div className='text-lg text-gray-900 font-medium'>
                                    { formatterCurrency(total) }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='block md:hidden w-full rounded-lg border border-gray-300 shadow-lg mt-2 overflow-hidden'>
                        <table className="min-w-full table-fixed divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="relative w-12 px-6 sm:w-16 md:px-0">
                                        <input
                                            type="checkbox"
                                            className="absolute left-3 top-1/2 -mt-2.5 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-transparent sm:left-5 cursor-pointer"
                                            checked={ services.some(item => item.selected && !item.completed) }
                                            onChange={() => handleUnselectedAll(services.some( item => item.selected && !item.completed ))}
                                        />
                                    </th>
                                    <th scope="col" className="pr-2 py-3.5 text-left text-sm font-medium text-gray-600">
                                        SERVICIOS
                                    </th>
                                    <th scope="col" className="pr-2 py-3.5 text-left text-sm font-medium text-gray-600">
                                        TOTAL
                                    </th>
                                    <th scope="col" className="relative pr-2 py-3.5 text-left text-sm font-medium text-gray-600">
                                        <span className='sr-only'>Action</span>
                                    </th>
                                </tr>
                            </thead>
                            {services.map((item) => (
                                <tbody key={item.sku} className='bg-white overflow-hidden'>
                                    <tr className={`${item.completed ? 'bg-gray-200/60 cursor-not-allowed' : 'bg-white'}`}>
                                        <td className="relative w-12 px-6">
                                            {item.selected && (
                                                <div className={`absolute inset-y-0 left-0 w-0.5 ${item.completed ? 'bg-gray-400' : 'bg-green-600'}`} />
                                            )}
                                            <input
                                            type="checkbox"
                                            className={`absolute left-3 top-1/2 -mt-2.5 h-5 w-5 rounded border-gray-300 ${item.completed ? 'text-gray-400/60' : 'text-green-600'} focus:ring-transparent cursor-pointer`}
                                            value={false}
                                            disabled={ item.completed }
                                            readOnly={ item.completed }
                                            checked={item.selected}
                                            onChange={ () => handleSelect(item.sku)
                                            }
                                            />
                                        </td>
                                        <td className='py-2.5 pr-2 text-sm text-gray-900'>{item.name}</td>
                                        <td className="pr-3 py-2.5 text-sm text-v2-blue-text-login font-semibold text-right">
                                            {formatterCurrency(item.total)}
                                        </td>
                                        <td className='px-3 py-2.5 text-gray-900 cursor-pointer' onClick={ () => handleOpenResume(item.sku) }><ChevronDownIcon className={`w-6 h-6 min-w-[24px] min-h-[24px] transition duration-200 ${item.resume_open ? 'rotate-180' : ''}`}/></td>
                                    </tr>
                                    {item.resume_open &&
                                        <>
                                            <tr>
                                                <td className='relative w-12 px-6'>
                                                {item.selected && (
                                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-green-600" />
                                                )}
                                                </td>
                                                <td className='py-1 text-sm text-gray-600'>Cantidad</td>
                                                <td className='py-1 text-sm text-gray-600 font-medium text-right'>{item.quantity}</td>
                                                <td className='py-1'><span className='sr-only'>Action</span></td>
                                            </tr>
                                            <tr>
                                                <td className='relative w-12 px-6'>
                                                {item.selected && (
                                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-green-600" />
                                                )}
                                                </td>
                                                <td className='py-1 text-sm text-gray-600'>Precio unitario</td>
                                                <td className='py-1 text-sm text-gray-600 font-medium text-right'>{formatterCurrency(item.amount)}</td>
                                                <td className='py-1'><span className='sr-only'>Action</span></td>
                                            </tr>
                                            <tr>
                                                <td className='relative w-12 px-6'>
                                                {item.selected && (
                                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-green-600" />
                                                )}
                                                </td>
                                                <td className='py-1 text-sm text-gray-600'>Descuento</td>
                                                <td className='py-1 text-sm text-gray-600 font-medium text-right'>{formatterCurrency(item.discount_amount)}</td>
                                                <td className='py-1'><span className='sr-only'>Action</span></td>
                                            </tr>
                                            <tr>
                                                <td className='relative w-12 px-6'>
                                                {item.selected && (
                                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-green-600" />
                                                )}
                                                </td>
                                                <td className='pt-1 pb-2.5 text-sm text-gray-600'>Subtotal</td>
                                                <td className='pt-1 pb-2.5 text-sm text-gray-600 font-medium line-through text-right'>{formatterCurrency(item.subtotal)}</td>
                                                <td className='pt-1 pb-2.5'><span className='sr-only'>Action</span></td>
                                            </tr>
                                        </>
                                    }
                                </tbody>
                            ))}
                        </table>
                        <div className='w-full bg-white px-3 py-3 border-t border-gray-300 flex justify-between services-center gap-3'>
                            <div className='w-3/4 text-lg text-gray-900 font-medium flex services-center gap-3'>
                                Total
                            </div>
                            <div className='text-base text-gray-900 font-medium'>
                                { formatterCurrency(total) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

TableWithCheckBoxes.propTypes = {
    total: PropTypes.number,
    services: PropTypes.array,
    setServices: PropTypes.func,
    setNumberSer: PropTypes.func,
    setServicesToPay: PropTypes.func
}

export default TableWithCheckBoxes