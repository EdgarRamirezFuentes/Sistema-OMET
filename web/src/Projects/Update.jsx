import '../App.css'
import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { getProject, updateProject } from '../api/controller/ProjectsController'
import PropTypes from 'prop-types';
function UpdateProject({projectId, onUpdated}) {
    const session = JSON.parse(localStorage.getItem('session'))

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
      getProjectData();
    }, []);

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const buttonHandler = async () => {
      if(name === '' || description === '' || selectedUser === ''){
          setAlertType('Warning');
          setAlertMessage('Ingresa los datos.')
          setError(true);
          return;
      }

      let data = {
        name: name,
        description: description,
      }

      await updateProject(projectId, data, session.token).then(async (response) => {

        let res = await response.json();
        if (response.status === 200){
          setAlertType('Success');
          setAlertMessage('Proyecto actualizado correctamente.')
          setError(true);
          setTimeout((e) => onUpdated && onUpdated(true),1000);
        }else{
          setAlertType('Error');
          setAlertMessage('Error al actualizar el proyecto.')
          setError(true);
        }
      });
    }


    const getProjectData = async () => {
        await getProject(session.token, projectId).then(async(response)=>{
              let projectArray = await response.json()
              let project  = projectArray.project;
              setName(project.name);
              setDescription(project.description);
              setSelectedUser(project.customer.id);
         })
    }
  
    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-screen'>
                <div className='w-full'>
                    <div className='mt-3 ml-5 flex justify-center'>
                        <p className='text-3xl font-bold'>Actualizar proyecto</p>
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
                                <textarea value={description} onChange={(event) => {setDescription(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Descripción' type="text" id="description" name="description"/><br/><br/>
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

UpdateProject.propTypes = {
  projectId : PropTypes.number,
  onUpdated: PropTypes.func,
}

export default UpdateProject
