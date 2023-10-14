import '../../App.css'
import Timer from '../../Components/Timer/Timer'
import SideBar from '../../Components/Sidebar/Sidebar'
import React, { useState, useEffect } from 'react';
import Alert from '../../Components/Alert/Alert'
import { useNavigate } from 'react-router-dom';
import { updateProjectModel, getProjectModel } from '../../api/controller/ProjetModelController'
import { useParams, useLocation } from 'react-router-dom';

function UpdateProjectModel() {
    const params = useParams();
    const location = useLocation();
    const history = useNavigate();
    const session = JSON.parse(localStorage.getItem('session'));

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [modelData, setModelData] = useState(null);
    const [name, setName] = useState('');

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    useEffect(() => {
      console.log("location.state");
      console.log(location.state); 
      setName(location.state.item.name)
    }, []);

    const getModelData = async ()=>{
      await getProjectModel(session.token, params.id).then(async (model)=>{
        let modelData = await model.json()
        console.log("modelData",modelData);
        if (modelData){
          setModelData(modelData)
          setName(modelData.name)
        }
      })
    }
    const buttonHandler = async () => {
      if(name === ''){
          setAlertType('Warning');
          setAlertMessage('Ingresa los datos.')
          setError(true);
          return;
      }

      let data = {
        name: name,
      }

      await updateProjectModel(params.id,data, session.token).then(async (response) => {
        let res = await response.json();
        if (response.status === 200){
          setAlertType('Success');
          setAlertMessage('Modelo actualizado correctamente.')
          setError(true);
          setTimeout(() => {
            history('/projects/model/'+location.state.model)
          },1000);
          return;
        }
      })
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
                        <p className='text-3xl font-bold'>Actualizar modelo</p>
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

export default UpdateProjectModel
