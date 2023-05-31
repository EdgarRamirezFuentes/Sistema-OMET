import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { useNavigate } from 'react-router-dom';
import { getDataType } from '../api/controller/DataTypeController';
import { updateDataType, getInputTypes } from '../api/controller/DataTypeController';
import { useParams } from 'react-router-dom';
function UpdateDataType() {
    const history = useNavigate();
    const params = useParams();
    const session = JSON.parse(localStorage.getItem('session'));

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [inputType, setInputType] = useState('');
    const [inputTypes, setInputTypes] = useState([]);

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }
    const buttonHandler = async () => {
        if(name === '' || description === '' || inputType === ''){
            setAlertType('Warning');
            setAlertMessage('Ingresa los datos.')
            setError(true);
            return;
        }
  
        let data = {
          name: name,
          description: description,
          input_type: inputType,
        }
  
        await updateDataType(params.id, data, session.token).then(async (response) => {
          let res = await response.json();
          if (response.status === 200){
            setAlertType('Success');
            setAlertMessage('Tipo de dato actualizado correctamente.')
            setError(true);
            setTimeout(() => {
              history('/data-type/get/')
            },2000);
            return;
          }else{
            const keys = Object.keys(res);
            setAlertMessage(res[keys[0]][0])
            setAlertType('Error');
            setError(true);
          }
        })
    }

    const getInputTypeData = async ()=>{
        await getDataType(params.id, session.token).then(async (inputTypes)=>{
            let inputTypesArray = await inputTypes.json()
            let data_type = inputTypesArray.data_type
            console.log(data_type);
            setName(data_type.name)
            setDescription(data_type.description)
            //setInputType(data_type.input_type)
        })
    }


    const getInputTypesData = async ()=>{
        await getInputTypes(session.token).then(async (inputTypes)=>{
            console.log(inputTypes);
            let inputTypesArray = await inputTypes.json()
            setInputTypes(inputTypesArray)
        })
    }

    const handleChange = (event) => {
        setInputType(event.target.value);
    };

    useEffect(() => {
        getInputTypeData();
        getInputTypesData();
    }, []);
  
    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-screen'>
                <SideBar/>
                <div className='w-full'>
                    <div className='w-full p-5 flex flex-row justify-between items-center bg-white'>
                        <p className='pr-1 font-sans text-lg text-gray-500'>Admin</p>
                        <p className='w-full font-sans text-xl text-black'>/ Data Type</p>
                        <div className='w-full mr-5'>
                            <Timer/>
                        </div>
                    </div>
                    <div className='mt-3 ml-5 flex justify-center'>
                        <p className='text-3xl font-bold'>Actualizar tipo de dato</p>
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
                                <input value={name}  onChange={(event) => {setName(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="project_name" name="project_name"/><br/><br/>
                              </div>
                              <p className='font-bold'>Descripción:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input value={description}  onChange={(event) => {setDescription(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Descripción' type="text" id="description" name="description"/><br/><br/>
                              </div>
                              <p className='font-bold'>Tipo de input:</p>
                                <div className="flex flex-col mt-1 relative rounded-md shadow-sm items-center mb-5">
                                  <select className='border-gray-300 text-gray-800 placeholder:text-gray-300 focus:ring-v2-blue-text-login focus:border-v2-blue-text-login block w-1/2 sm:text-sm rounded-md' onChange={handleChange}>
                                    <option value="">Selecciona un tipo de input</option>
                                    {inputTypes.map((option, i) => (
                                        <option key={i} value={option[0]}>{option[0]}</option>
                                    ))}
                                  </select>
                                </div>
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

export default UpdateDataType