import '../../App.css'
import React, { useState, useEffect } from 'react';
import Alert from '../../Components/Alert/Alert'
import Input from '../../Components/tailwindUI/Input'
import { updateProjectField } from '../../api/controller/FieldsController'
import PropTypes from 'prop-types';

function UpdateProjectModel({field, model, onUpdated}) {
    console.log("field ====>",field)
    console.log("model ====>",model)
    const session = JSON.parse(localStorage.getItem('session'));
    console.log("session ====>",session)

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [order, setOrder] = useState(0);

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    useEffect(() => {
      setName(field?.name)
      setDescription(field?.caption)
      setOrder(field?.order)
    }, []);
    const buttonHandler = async () => {
      if(name === ''){
          setAlertType('Warning');
          setAlertMessage('Ingresa los datos.')
          setError(true);
          return;
      }

      let data = {
        name: name,
        caption: description,
        order: order
      }

      await updateProjectField(field.id, data, session.token).then(async (response) => {
        if (response.status === 200){
          setAlertType('Success');
          setAlertMessage('Campo actualizado correctamente.')
          setError(true);
          setTimeout((e) => onUpdated && onUpdated(true),1000);
          return;
        }
      })
    }

    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-screen'>
                <div className='w-full'>
                    <div className='mt-3 ml-5 flex justify-center'>
                        <p className='text-3xl font-bold'>Actualizar Campo</p>
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
                                  <input value={name} onChange={(event) => {setName(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="project_name" name="project_name"/><br/><br/>
                                </div>
                              </div>
                              <div className='w-full flex flex-col justify-between'>
                                <p className='font-bold'>Etiqueta en formularios:</p>
                                <div className='mb-10 w-full flex flex-row justify-center'>
                                  <textarea value={description} onChange={(event) => {setDescription(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Etiqueta' type="text" id="project_name" name="project_name"/><br/><br/>
                                </div>
                              </div>
                              <div className='w-full flex flex-col justify-between'>
                                <Input label={"Orden"} value={order} onChange={(event)=>{setOrder(event.target.value)}} type={"number"}/>
                              </div>
                            </div>
                          </div>
                          <div className='w-1/4'>
                            <input onClick={buttonHandler} className=' text-white w-full py-2 px-4 rounded-full bg-zinc-400 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Actualizar"/><br/><br/>
                          </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

UpdateProjectModel.propTypes = {
  field: PropTypes.any,
  model : PropTypes.any,
  onUpdated: PropTypes.func
}

export default UpdateProjectModel
