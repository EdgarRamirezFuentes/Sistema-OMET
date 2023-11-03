import '../App.css'
import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { useNavigate } from 'react-router-dom';
import { createProjectMaintenance, getProject } from '../api/controller/ProjectsController'
import { getCustomers } from '../api/controller/ClientsController';
import { useParams } from 'react-router-dom';
import Table from '../Components/tailwindUI/Table'
import PropTypes from 'prop-types';
function SeeProject({projectId}) {
    const params = useParams();
    const history = useNavigate();
    const session = JSON.parse(localStorage.getItem('session'))

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [allApps, setAllApps] = useState([])

    const tableColumns = [
      { heading: 'Id', value: 'id',align: 'center' },
      { heading: 'Nombre', value: 'name' , main: true}
    ];

    const columnActions = [
    ];

    useEffect(() => {
      getProjectData();
    }, []);

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const getProjectData = async () => {
        await getProject(session.token, projectId).then(async(response)=>{
              let projectArray = await response.json()
              let project  = projectArray.project;
              setIsLoadingData(false)
              setName(project.name);
              setDescription(project.description);
              setAllApps(projectArray.project_apps)
         })
    }
  
    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-screen'>
                <div className='w-full'>
                    <div className='mt-3 ml-5 flex justify-center'>
                        <p className='text-3xl font-bold'>Información del proyecto</p>
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
                                <input disabled value ={name} onChange={(event) => {setName(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="project_name" name="project_name"/><br/><br/>
                              </div>
                              
                              <p className='font-bold'>Descripción:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <textarea disabled value={description} onChange={(event) => {setDescription(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Descripción' type="text" id="description" name="description"/><br/><br/>
                              </div>
                              
                              <p className='mt-5 font-bold'>Apps:</p>
                              <div className='mt-5'>
                                  <Table title='Apps' data={ allApps } isLoadingData={ isLoadingData } columns={ tableColumns } actions={ columnActions }/>
                              </div>
                              
                          </div>

                        </div>
                        </div>
                        <div className='w-1/4'>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

SeeProject.propTypes = {
  projectId : PropTypes.number
}

export default SeeProject
