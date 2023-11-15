import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { TrashIcon, ClipboardIcon,XMarkIcon } from '@heroicons/react/24/outline';

import '../App.css';
import Timer from '../Components/Timer/Timer';
import SideBar from '../Components/Sidebar/Sidebar';
import Alert from '../Components/Alert/Alert';
import Table from '../Components/tailwindUI/Table';
import { getDataTypes, getDataType } from '../api/controller/DataTypeController';
import { getModelField } from '../api/controller/ModelFieldsController';
import Modal from '../Components/tailwindUI/Modal';
import CreateValidator from './ValidatorCreate';
import ModalDelete from '../Components/ModalDelete/ModalDelete';
import UpdateValidator from './ValidatorUpdate';

function ValidatorsModel() {
    const { state } = useLocation();
    const params = useParams();
    const session = JSON.parse(localStorage.getItem('session'));

    const [allDataTypes, setAllDataTypes] = useState([]);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [name, setName] = useState('');
    const [caption, setCaption] = useState('');
    const [validators, setValidators] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [validatorSelected, setValidatorSelected] = useState(null);
    const [model, setModel] = useState(null);
    const [validatorValue, setValidatorValue] = useState('');
    const [validatorBoolean, setValidatorBoolean] = useState(false);
    const [validatorsUsed, setValidatorsUsed] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToUpdate, setItemToUpdate] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);

    useEffect(() => {
        if (state && state.item) {
            const { item } = state;
            console.log("location.state", item);
            setName(item.name);
            setCaption(item.caption);
            dataTypes();
            getValidators();
            getModelFieldData();
        }
    }, [state]);

    const dataTypes = async () => {
        const clients = await getDataTypes(session.token);
        const clientsArray = await clients.json();
        setAllDataTypes(clientsArray);
        setValidatorData();
    };

    const getModelFieldData = async () => {
        const models = await getModelField(params.id, session.token);
        const modelList = await models.json();
        console.log("modelList", modelList);
        if (modelList.length !== 0) {
            setValidatorsUsed(modelList.validators);
            setModel(modelList);
            setIsLoadingData(false);
        }
    };

    const setValidatorData = () => {
        const dataType = allDataTypes.find(element => element.id === state.item.data_type);
        if (dataType) setSelectedType(dataType.name);
    };

    const handleValidatorChange = (event) => {
        const foundValidator = validators.find(element => element.id === event.target.value);
        if (foundValidator) {
            setValidatorSelected(foundValidator);
            const { name } = foundValidator;
            setValidatorBoolean(["null", "unique", "db_index"].includes(name));
            setValidatorValue("");
        }
    };

    const onCloseHandler = () => {
        setError(null);
        setAlertType('Error');
        setAlertMessage('');
    };

    const getValidators = async () => {
        const response = await getDataType(params.id, session.token);
        const res = await response.json();
        console.log("res", res);
        setValidators(res.validators);
    };

    const deleteUsedValidators = () => {
        const updatedValidators = validators.filter(validator => 
            !model.validators.some(element2 => element2.validator.id === validator.id)
        );
        setValidators(updatedValidators);
    };

    const handleUpdate = item => {
        setOpenModalUpdate(true);
        setItemToUpdate(item)
        // Update logic here
    };

    const handleDelete = item => {
        setOpenModalDelete(true);
        setItemToDelete(item)
    };

    const deleteItem = async () => {
        console.log("====delete item ====")
        console.log("itemToDelete", itemToDelete)
        setOpenModalDelete(false);
        setItemToDelete(null)
    }

    const buttonHandler = async () => {
        setOpenModal(true);
        // Uncomment and complete the logic below when ready
        /*
        if (name === '' || caption === '' || selectedType === '' || order === 0) {
            setAlertType('Warning');
            setAlertMessage('Ingresa tus datos.');
            setError(true);
            return;
        }
        */
    };

    const tableColumns = [
        { heading: 'Id', value: 'id',align: 'center' },
        { heading: 'Nombre', value: 'validator.name' , main: true},
        { heading: 'Descripción', value: 'validator.description'},
        { heading: 'Valor', value: 'value'},
    ];

      const columnActions = [
        {
            id: 1,
            name: 'Actualizar validador',
            type: 'primary',
            icon: <ClipboardIcon className='w-4 h-4 text-gray-600 lg:text-white'/>,
            action: handleUpdate,
        },
        {
            id: 2,
            name: 'Eliminar validador',
            type: 'primary',
            icon: <TrashIcon className='w-4 h-4 text-gray-600 lg:text-white'/>,
            action: handleDelete,
        }
      ];

    
  
    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-full w-full'>
                <SideBar/>
                <div className='w-full'>
                    <div className='w-full p-5 flex flex-row justify-between items-center bg-white'>
                        <p className='pr-1 font-sans text-lg text-gray-500'>Admin</p>
                        <p className='w-full font-sans text-xl text-black'>/ Perfil</p>
                        <div className='w-full mr-5'>
                            <Timer/>
                        </div>
                    </div>
                    <div className='mt-3 ml-5 flex justify-center'>
                        <p className='text-3xl font-bold'>Validadores del campo</p>
                    </div>
                    <div className='flex flex-col justify-between w-full'>
                        <div className='mt-5 p-5 flex flex-col items-center m-auto w-3/4 rounded-2xl bg-white'>

                            <div className="w-full overflow-hidden">
                                <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
                            </div>

                            <div className='mt-5 w-full items-center flex flex-row'>

                                <div className='w-full flex flex-col items-center'>

                                    <div className='w-full flex flex-col justify-between'>
                                        <p className='font-bold'>Nombre:</p>
                                        <div className='mb-10 w-full flex flex-row justify-center'>
                                            <input value={name} disabled onChange={(event) => {setName(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="project_name" name="project_name"/><br/><br/>
                                        </div>
                                        <p className='font-bold'>Tipo de dato:</p>
                                        <div className='mb-10 w-full flex flex-row justify-center'>
                                            <input value={selectedType} disabled onChange={(event) => {setSelectedType(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="project_name" name="project_name"/><br/><br/>
                                        </div>
                                        <div className='w-full flex flex-row justify-between'>
                                            <p className='font-bold'>Validadores:</p>
                                            <input onClick={buttonHandler} className=' text-white w-1/6 rounded-full bg-zinc-400  hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Agregar validador"/>
                                        </div>

                                        <div className='mt-5'>
                                            <Table title='Validadores' data={ validatorsUsed } isLoadingData={ isLoadingData } columns={ tableColumns } actions={ columnActions }/>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={ openModal } setShow={ setOpenModal } className='min-w-full sm:min-w-[500px]'>

                <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModal(false) }/></div>
                <CreateValidator validators={validators} model_field_id={params.id}/>
            </Modal>

            <Modal show={ openModalUpdate } setShow={ setOpenModalUpdate } className='min-w-full sm:min-w-[500px]'>

                <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalUpdate(false) }/></div>
                <UpdateValidator/>
            </Modal>
            <Modal show={ openModalDelete } setShow={ setOpenModalDelete } className='min-w-full sm:min-w-[500px]'>

                <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalDelete(false) }/></div>
                <ModalDelete onDelete={deleteItem}/>
            </Modal>
        </div>
    )
}

export default ValidatorsModel
