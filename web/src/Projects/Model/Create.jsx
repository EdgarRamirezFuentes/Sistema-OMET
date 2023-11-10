import '../../App.css'
import React, { useState, useEffect } from 'react';
import Alert from '../../Components/Alert/Alert'
import Select from '../../Components/tailwindUI/Select';
import { useNavigate } from 'react-router-dom';
import { createProjectFields } from '../../api/controller/FieldsController'
import { useParams } from 'react-router-dom';
import { getDataTypes } from '../../api/controller/DataTypeController'
import PropTypes from 'prop-types';

function CreateProjectModel({modelId, onCreated}) {
    const params = useParams();
    const history = useNavigate();
    const session = JSON.parse(localStorage.getItem('session'));
    console.log("modelId",modelId)

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [order, setOrder] = useState(0);
    const [model_field_relation, setModelFieldRelation] = useState(0);
    const [selectedDataType, setSelectedDataType] = useState(null);

    const [dataTypes, setDataTypes] = useState([]);

    useEffect(() => {
      console.log("selectedDataType",selectedDataType)
      if(dataTypes.length == 0){
        getDataTypes(session.token).then(async (response) => {
          let res = await response.json();
          console.log(res)
          if (response.status === 200){
            setDataTypes(res)
          }
        })
      }

    }, [selectedDataType]);

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const buttonHandler = async () => {
      if(name === ''){
          setAlertType('Warning');
          setAlertMessage('Ingresa los datos.')
          setError(true);
          return;
      }

      let data = [{
        name: name,
        caption: description,
        order: order,
        data_type: selectedDataType,
        app_model: modelId,
      }]

      if(model_field_relation != 0){
        data[0].model_field_relation = model_field_relation
      }

      await createProjectFields(data, session.token).then(async (response) => {
        let res = await response.json();
        console.log(res)
        if (response.status === 201){
          setAlertType('Success');
          setAlertMessage('Campo creado correctamente.')
          setError(true);
          setTimeout((e) => onCreated && onCreated(true),1000);
          return;
        }else{
          const keys = Object.keys(res);
          setAlertMessage(res[keys[0]][0])
          setAlertType('Error');
          setError(true);
          setTimeout((e) => onCreated && onCreated(false),1000);
        }
      })
    }
  
    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-screen'>
                <div className='w-full'>
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
                                <input onChange={(event) => {setDescription(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Descripción' type="text" id="project_name" name="project_name"/><br/><br/>
                              </div>
                              <p className='font-bold'>Orden:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input onChange={(event) => {setOrder(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Orden' type="number" id="project_name" name="project_name"/><br/><br/>
                              </div>
                              <p className='font-bold'>Tipo de dato:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <Select value={selectedDataType} setValue={setSelectedDataType} listOptions={dataTypes}/>
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

CreateProjectModel.propTypes = {
  modelId : PropTypes.number,
  onCreated: PropTypes.func
}


export default CreateProjectModel
