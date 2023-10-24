import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getDataTypes } from '../api/controller/DataTypeController'
import { createModel } from '../api/controller/ModelFieldsController'
import { getProjectStructure } from '../api/controller/ProjectsController'
function CreateModel() {
    const history = useNavigate();
    const params = useParams();
    const location = useLocation();
    const session = JSON.parse(localStorage.getItem('session'))
    const [allDataTypes, setAllDataTypes] = useState([])

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [name, setName] = useState('');
    const [caption, setCaption] = useState('');
    const [order, setOrder] = useState(0);
    
    const [selectedType, setSelectedType] = useState(null);
    
    const [projectStructure, setProjectStructure] = useState(null);
    const [appSelected, setSelectedApp] = useState(null);
    const [modelSelected, setSelectedModel] = useState(null);
    const [fieldSelected, setSelectedField] = useState(null);

    useEffect(() => {
          dataTypes()
    }, []);

    useEffect(() => {
        console.log("===refresh===");
    }
    , [projectStructure])


    const dataTypes = async ()=>{
        await getDataTypes(session.token).then(async(clients)=>{
          let clientsArray = await clients.json()
          setAllDataTypes(clientsArray)
          setIsLoadingData(false)
        })
    }

    const projectStructureData = async ()=>{
        if (projectStructure == null){
            await getProjectStructure(session.token, params.id).then(async(project_structure)=>{
                let structure = await project_structure.json();
                setProjectStructure(structure);
            })
        }
    }

    const handleChange = (event) => {
        setSelectedType(event.target.value);
        allDataTypes.find((item) => {
            if(item.id == event.target.value){
                if(item.name == "OnetoOneForeignKey" || item.name == "ManytoManyForeignKey" || item.name == "OnetoManyForeignKey"){
                    projectStructureData()
                }
            }
        })
    };
    
    const handleChangeApp = (event) => {
        projectStructure.find((item) => {
            if(item.id == event.target.value){
                setSelectedApp(item);
            }
        })
    };
    
    const handleChangeModel = (event) => {
        appSelected.app_models.find((item) => {
            if(item.id == event.target.value){
                console.log("item",item);
                setSelectedModel(item);
            }
        })
    };
    const handleChangeField = (event) => {
        modelSelected.model_fields.find((item) => {
            if(item.id == event.target.value){
                console.log("item",item);
                setSelectedField(item);
            }
        })
    };

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const buttonHandler = async () => {
        if(name === '' || caption === '' || selectedType === '' || order === 0){
            setAlertType('Warning');
            setAlertMessage('Ingresa los datos.')
            setError(true);
            return;
        }
        let data = [{
            name: name,
            caption: caption,
            order: order,
            //is_required: isRequired,
            data_type: selectedType,
            app_model: params.id,
            model_field_relation: fieldSelected?.id
        }]

        await createModel(data, session.token).then(async (response)=>{
            console.log("====response====");
            console.log(response);
            let responseJson = await response.json()
            console.log("====response====");
            console.log(responseJson);
            if (response.status === 201){
            setAlertType('Success');
            setAlertMessage('Campo creado correctamente.')
            setError(true);
            setTimeout(() => {
                history(`/projects/model/${location.state.model}`)
            }, 1500);
            }else{
            setAlertType('Error');
            setAlertMessage('Error al crear el campo.')
            setError(true);
            }
        });
    }
  
    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-full'>
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
                        <p className='text-3xl font-bold'>Crear campo</p>
                    </div>
                    <div className='flex flex-col justify-between'>
                        <div className='mt-5 p-5 flex flex-col items-center m-auto w-1/2 rounded-2xl bg-white'>

                            <div className="w-full overflow-hidden">
                                <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
                            </div>

                            <div className='mt-5 w-full items-center flex flex-row'>

                                <div className='w-full flex flex-col items-center'>

                                    <div className='w-full flex flex-col justify-between'>
                                        <p className='font-bold'>Nombre:</p>
                                        <div className='mb-10 w-full flex flex-row justify-center'>
                                            <input onChange={(event) => {setName(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="project_name" name="project_name"/><br/><br/>
                                        </div>
                                        
                                        <p className='font-bold'>Descripción:</p>
                                        <div className='mb-10 w-full flex flex-row justify-center'>
                                            <input onChange={(event) => {setCaption(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Descripción' type="text" id="caption" name="caption"/><br/><br/>
                                        </div>
                                        <p className='font-bold'>Orden:</p>
                                        <div className='mb-10 w-full flex flex-row justify-center'>
                                            <input min={0} onChange={(event) => {setOrder(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='0' type="number" id="order" name="order"/><br/><br/>
                                        </div>                    

                                        <p className='font-bold'>Tipo de dato:</p>
                                        <div className='mb-10 w-full flex flex-row justify-center'>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <select className='border-gray-300 text-gray-800 placeholder:text-gray-300 focus:ring-v2-blue-text-login focus:border-v2-blue-text-login block w-full sm:text-sm rounded-md'
                                                value={selectedType} onChange={handleChange}>
                                                <option value="">Selecciona un tipo de dato</option>
                                                {allDataTypes.map((option, i) => (
                                                    <option key={i} value={option.id}>{option.name}</option>
                                                ))}
                                                </select>
                                            </div>
                                        </div>
                                        {projectStructure != null ? <><p className='font-bold'>App:</p>
                                        <div className='mb-10 w-full flex flex-row justify-center'>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <select className='border-gray-300 text-gray-800 placeholder:text-gray-300 focus:ring-v2-blue-text-login focus:border-v2-blue-text-login block w-full sm:text-sm rounded-md'
                                                value={appSelected?.id} onChange={handleChangeApp}>
                                                <option value="">Selecciona la app</option>
                                                {projectStructure.map((option, i) => (
                                                    <option key={i} value={option.id}>{option.name}</option>
                                                ))}
                                                </select>
                                            </div>
                                        </div></>:null}
                                        {appSelected != null ? (
                                        <>
                                            <p className='font-bold'>Modelo:</p>
                                            <div className='mb-10 w-full flex flex-row justify-center'>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <select className='border-gray-300 text-gray-800 placeholder:text-gray-300 focus:ring-v2-blue-text-login focus:border-v2-blue-text-login block w-full sm:text-sm rounded-md'
                                                    value={modelSelected?.id} onChange={handleChangeModel}>
                                                    <option value="">Selecciona el modelo</option>
                                                    {appSelected.app_models.map((option, i) => (
                                                        <option key={i} value={option.id}>{option.name}</option>
                                                    ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </>)
                                        :null}
                                        {modelSelected != null ? (
                                        <>
                                            <p className='font-bold'>Campo:</p>
                                            <div className='mb-10 w-full flex flex-row justify-center'>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <select className='border-gray-300 text-gray-800 placeholder:text-gray-300 focus:ring-v2-blue-text-login focus:border-v2-blue-text-login block w-full sm:text-sm rounded-md'
                                                    value={fieldSelected?.id} onChange={handleChangeField}>
                                                    <option value="">Selecciona un campo</option>
                                                    {modelSelected.model_fields.map((option, i) => (
                                                        <option key={i} value={option.id}>{option.name}</option>
                                                    ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </>)
                                        :null}
                                </div>

                                </div>
                            </div>
                            <div className='w-1/4'>
                                <input onClick={buttonHandler} className=' text-white w-full py-2 px-4 rounded-full bg-zinc-400 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Crear"/><br/><br/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateModel
