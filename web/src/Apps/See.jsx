import '../App.css'
import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { getApps } from '../api/controller/AppController'
import PropTypes from 'prop-types';
function SeeApp({appId}) {
    const session = JSON.parse(localStorage.getItem('session'))

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [name, setName] = useState('');
    const [caption, setCaption] = useState('');
    const [appData, setAppData] = useState(null);
    const [flag, setFlag] = useState(false);
    


    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const getAppData = async () => {
        if (appData == null && !flag){
            await getApps(appId, session.token).then(async(response)=>{
                    let responseJson = await response.json()
                    console.log("===responseJson===")
                    console.log(responseJson)
                    setName(responseJson.name)
                    setCaption(responseJson.description)
                }
            )
        }
    }

    useEffect(() => {
        getAppData();
    },[])
  
    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-screen'>
                <div className='w-full'>
                    <div className='mt-3 ml-5 flex justify-center'>
                        <p className='text-3xl font-bold'>App</p>
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
                                <input value ={name} onChange={(event) => {setName(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="project_name" name="project_name"/><br/><br/>
                              </div>
                              
                              <p className='font-bold'>Descripción:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input value ={caption} onChange={(event) => {setCaption(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Descripción' type="text" id="caption" name="caption"/><br/><br/>
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
SeeApp.propTypes = {
    appId : PropTypes.number
}
  

export default SeeApp
