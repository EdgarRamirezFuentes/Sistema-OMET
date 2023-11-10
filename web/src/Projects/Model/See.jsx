import '../../App.css'
import React, { useState, useEffect } from 'react';
import Alert from '../../Components/Alert/Alert'
import PropTypes from 'prop-types';
function SeeProjectModel({model}) {

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    useEffect(() => {
        console.log("model",model)
        setName(model?.name)
        setDescription(model?.caption)
    }, []);
  
    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-screen'>
                <div className='w-full'>
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
                            </div>
                            <div className='w-full flex flex-col justify-between'>
                              <p className='font-bold'>Descripción:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <textarea value={description} disabled onChange={(event) => {setName(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="project_name" name="project_name"/><br/><br/>
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

SeeProjectModel.propTypes = {
    model : PropTypes.any
  }

export default SeeProjectModel
