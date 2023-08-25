import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getDataTypes } from '../api/controller/DataTypeController'
import { createModel } from '../api/controller/ModelFieldsController'
function SeeModel() {
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
    const [isRequired, setIsRequired] = useState(false);

    const [selectedType, setSelectedType] = useState('');

    useEffect(() => {
          console.log("location")
          console.log(location.state);
          setName(location.state.item.name)
          setCaption(location.state.item.data_type.description)
          setIsRequired(false)
          setSelectedType(location.state.item.data_type.name)

      }, []);

    const dataTypes = async ()=>{
        await getDataTypes(session.token).then(async(clients)=>{
          let clientsArray = await clients.json()
          setAllDataTypes(clientsArray)
          setIsLoadingData(false)
        })
    }

    const handleChange = (event) => {
        setSelectedType(event.target.value);
    };
    
    const handleChangeRequired = (event) => {
        setIsRequired(event.target.value);
    };

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const buttonHandler = async () => {
        if(name === '' || caption === '' || selectedType === '' || order === 0){
            setAlertType('Warning');
            setAlertMessage('Ingresa tus datos.')
            setError(true);
            return;
        }

        let data = [{
            name: name,
            caption: caption,
            order: order,
            is_required: isRequired,
            data_type: selectedType,
            project_model: params.id
        }]

        await createModel(data, session.token).then(async (response)=>{
            let responseJson = await response.json()
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
            <div className='flex flex-row h-screen'>
                <SideBar/>
                <div className='w-full'>
                    <div className='w-full p-5 flex flex-row justify-between items-center bg-white'>
                        <p className='pr-1 font-sans text-lg text-gray-500'>Admin</p>
                        <p className='w-full font-sans text-xl text-black'>/ Profile</p>
                        <div className='w-full mr-5'>
                            <Timer/>
                        </div>
                    </div>
                    <div className='mt-3 ml-5 flex justify-center'>
                        <p className='text-3xl font-bold'>Datos del campo</p>
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
                                <input value={name} disabled onChange={(event) => {setName(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="project_name" name="project_name"/><br/><br/>
                              </div>
                              
                              <p className='font-bold'>Descripción:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input value={caption} disabled onChange={(event) => {setCaption(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Descripción' type="text" id="caption" name="caption"/><br/><br/>
                              </div>
                              <p className='font-bold'>Orden:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input value={1} disabled min={0} onChange={(event) => {setOrder(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='0' type="number" id="order" name="order"/><br/><br/>
                              </div>
                              
                              <p className='font-bold'>¿Es requerido?:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input value={isRequired} disabled onChange={(event) => {setCaption(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Falso' type="text" id="is_required" name="is_required"/><br/><br/>
                              </div>

                              <p className='font-bold'>Tipo de dato:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input value={selectedType} disabled onChange={(event) => {setCaption(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Tipo de dato' type="text" id="data_type" name="data_type"/><br/><br/>
                              </div>
                          </div>

                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SeeModel
