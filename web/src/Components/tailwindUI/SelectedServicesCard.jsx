import React, { useState, useEffect } from 'react';
import SlideOver from './SlideOver';
import PropTypes from 'prop-types';
import SecondaryButton from '../tailwindUI/PrimaryButton';
import useFormatterCurrency from '../hooks/useFormatterCurrency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../tailwindUI/Modal';
import ButtonOrange from './ButtonOrange';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Badge from './Badge';

function SelectedServicesCard({ selected, total, hideDetails, instructions, services, setServices, setServicesToPay, setStep, setPaymentInstructions, setNumberServicesAdded }) {
    const [openSlide, setOpenSlide] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const { formatterCurrency } = useFormatterCurrency();

    useEffect(() => {
        !openModal && setDeleteId('');
    }, [openModal]);

    useEffect(() => {
        !openEditModal && setEditId('');
    }, [openEditModal]);

    const handleDeleteInstruction = id => {
        setDeleteId(id);
        setOpenModal(true);
    }

    const handleEditInstruction = id => {
        setEditId(id);
        setOpenEditModal(true);
    }

    const deleteInstruction = () => {
        const newPaymentPlans = instructions.filter(payment => payment.id !== deleteId);
        const paymentServices = instructions.filter(payment => payment.id == deleteId)[0].services;
        const servicesIncluded = services.filter(service => paymentServices.some(ser => ser.sku == service.sku));
		const servicesExcluded = services.filter(service => !paymentServices.some(ser => ser.sku == service.sku));
        const newServs = servicesIncluded.map(item => {
            return {
                ...item,
                completed: false
            }
        });
        const modifiedServices = [...servicesExcluded, ...newServs];
        setPaymentInstructions(newPaymentPlans);
        setServices(modifiedServices);
        setNumberServicesAdded(modifiedServices.filter(service => service.completed).length);
        setOpenModal(false);
    }

    const editInstruction = () => {
		const newPaymentPlans = instructions.filter(payment => payment.id !== editId);
        const paymentServices = instructions.filter(payment => payment.id == editId)[0].services;
        const servicesIncluded = services.filter(service => paymentServices.some(ser => ser.sku == service.sku));
		const servicesExcluded = services.filter(service => !paymentServices.some(ser => ser.sku == service.sku));
        const newServs = servicesIncluded.map(item => {
            return {
                ...item,
                completed: false,
                selected: true
            }
        });
        const modifiedServices = [...newServs, ...servicesExcluded];
        setPaymentInstructions(newPaymentPlans);
        setServices(modifiedServices);
        setNumberServicesAdded(modifiedServices.filter(service => service.completed).length);
        setOpenEditModal(false);
        setServicesToPay(newServs);
		setStep(3);
        setOpenSlide(false);
	}
    
    return (
        <>
            <div className='w-full border border-gray-300 rounded-lg bg-white px-4 py-2 md:px-4 md:py-3.5 flex justify-between items-start gap-1.5'>
                <div className='flex items-center'>
                    <span className='text-sm font-normal'>
                        Servicios incluidos en acuerdos de pago: 
                        <span className={`text-gray-900 pl-1.5 font-bold`}>
                            { selected } / { total }
                        </span>
                    </span>
                </div>
                { !hideDetails &&
                    <div className='flex gap-3'>
                        <div className='w-full min-w-[80px] text-button-orange underline cursor-pointer text-right text-sm' onClick={ () => setOpenSlide(true) }>
                            Ver detalle
                        </div>
                    </div>
                }
            </div>
            <SlideOver open={openSlide} setOpen={setOpenSlide} title="Acuerdos de pago generados">
                <div className='w-full'>
                    <div className='text-gray-900 font-medium text-sm'>
                        Aquí puedes observar y eliminar los acuerdos de pago que has generado
                    </div>
                    <div className={`w-full mt-4 absolute -ml-4 md:-ml-6`}>
                        {instructions?.length === 0 ? (
                            <div className='p-2 mt-10'>
                                <div>
                                    <img 
                                    alt='Botxi - crea una incidencia'
                                    src='https://cdn.fixat.mx/intranet/botxi.png'
                                    className='w-[105px] h-[132px] mx-auto'
                                    />
                                </div>
                                <div className='text-gray-500 font-medium text-2xl text-center mt-4'>
                                    Aún no hay instrucciones generadas.
                                </div>
                            </div>
                        )
                            :
                        (
                            <div className="w-full">
                                <div className="w-full border-t border-b border-gray-200 bg-gray-50 px-6 py-2 text-sm font-medium text-gray-500 sticky top-0 z-50">
                                    Acuerdos de pago
                                </div>
                                <nav className="min-h-0 flex-1 max-h-[calc(75vh-5rem)] md:max-h-[calc(79vh-6rem)] overflow-y-auto">
                                    <ul className="divide-y divide-gray-200 border-b border-gray-200">
                                        {instructions?.map(item => (
                                            <li key={item.id} className="relative bg-white py-5 px-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50">
                                                <div className="flex justify-between space-x-3">
                                                    <div className="min-w-0 flex-1">
                                                    <div className="block">
                                                        <p className="truncate text-sm font-medium text-gray-900 mb-1">Tipo: <Badge text={ item.payment_type == 'unique' ? 'Cobro único' : item.payment_type == 'partial' ? 'Cobros diferidos' : item.payment_type == 'subscription' ? 'Suscripción' : '' } /></p>
                                                        <p className="truncate text-sm text-gray-500">Monto: { formatterCurrency(item.services.map( service => service.total ).reduce((prev, curr) => prev + curr, 0)) }</p>
                                                    </div>
                                                    </div>
                                                    <div className="cursor-pointer text-sm text-button-orange underline" onClick={ () => handleEditInstruction(item.id) }>
                                                        Editar
                                                    </div>
                                                    <div className="cursor-pointer text-sm text-button-orange underline" onClick={ () => handleDeleteInstruction(item.id) }>
                                                        Eliminar
                                                    </div>
                                                </div>
                                                <div className='text-gray-500 text-sm mt-0.5'>
                                                Servicios:
                                                    {item.services.map(service => (
                                                        <div key={ service.id } className='w-full flex items-start gap-2'>
                                                            <FontAwesomeIcon icon={ faCircle } className='text-[7px] pt-1.5 leading-none text-gray-300'/>
                                                            <div className='text-gray-500 text-sm'>
                                                                { service.name }
                                                            </div>
                                                        </div>
                                                    ))
                                                    }
                                                </div>
                                            </li>
                                        ))}
                                        </ul>
                                    </nav>
                            </div>
                        )
                        }
                    </div>
                    <div className='w-11/12 bottom-4 fixed static md:hidden pt-4 bg-white'>
                        <SecondaryButton isFullWidth={true} onClick={ () => setOpenSlide(false) }>
                            Cerrar
                        </SecondaryButton>
                    </div>
                </div>
            </SlideOver>
            <Modal show={ openEditModal } setShow={ setOpenEditModal } className='min-w-full sm:min-w-[500px]'>
                <div className="py-2 px-2 text-center">
                    <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenEditModal(false) }/></div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Editar acuerdo de pago</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>¿Quieres editar este acuerdo de pago?</p>
                    </div>
                    <div className="mt-6">
                        <div className='w-full md:w-3/5 mx-auto text-center'>
                            <ButtonOrange isFullWidth={true} onClick={ editInstruction }>
                                Sí, editar acuerdo
                            </ButtonOrange>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal show={ openModal } setShow={ setOpenModal } className='min-w-full sm:min-w-[500px]'>
                <div className="py-2 px-2 text-center">
                    <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModal(false) }/></div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Eliminar acuerdo de pago</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Si eliminas este acuerdo de pago, deberás volver a configurarlo para generar el contrato. ¿Quieres proceder a eliminarlo?</p>
                    </div>
                    <div className="mt-6">
                        <div className='w-full md:w-3/5 mx-auto text-center'>
                            <ButtonOrange isFullWidth={true} onClick={ deleteInstruction }>
                                Sí, eliminar acuerdo
                            </ButtonOrange>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

SelectedServicesCard.propTypes = {
    selected: PropTypes.number,
    total: PropTypes.number,
    hideDetails: PropTypes.bool,
    instructions: PropTypes.array,
    services: PropTypes.array,
    setServices: PropTypes.func,
    setServicesToPay: PropTypes.func,
    setStep: PropTypes.func,
    setPaymentInstructions: PropTypes.func,
    setNumberServicesAdded: PropTypes.func
}

export default SelectedServicesCard