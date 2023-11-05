import '../App.css'
import React, { useState } from 'react';
import Alert from '../Components/Alert/Alert'
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { createApp } from '../api/controller/AppController'
import PropTypes from 'prop-types';
function CreateApp({projectId}) {
    const history = useNavigate();
    const location = useLocation();
    const session = JSON.parse(localStorage.getItem('session'))

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [name, setName] = useState('');
    const [caption, setCaption] = useState('');

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const buttonHandler = async () => {
        if(name === '' || caption === ''){
            setAlertType('Warning');
            setAlertMessage('Ingresa los datos.')
            setError(true);
            return;
        }

        let data = {
            name: name,
            description: caption,
            project: parseInt(projectId)
        }

        await createApp(data, session.token).then(async (response)=>{
            let responseJson = await response.json()
            if (response.status === 201){
            setAlertType('Success');
            setAlertMessage('App creada correctamente.')
            setError(true);
            setTimeout(() => {
                history(`/apps/`,{
                    state:{
                      project: location.state.project,
                    }
                  }
                )
            }, 1500);
            }else{
            setAlertType('Error');
            setAlertMessage('Error al crear la app.')
            setError(true);
            }
        });
    }
  
    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-screen'>
                <div className='w-full'>
                    <div className='mt-3 ml-5 flex justify-center'>
                        <p className='text-3xl font-bold'>Crear app</p>
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

CreateApp.propTypes = {
    projectId : PropTypes.number
}

export default CreateApp
