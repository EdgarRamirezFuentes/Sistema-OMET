import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { createProjectMaintenance, getProject } from '../api/controller/ProjectsController'
import { getCustomers } from '../api/controller/ClientsController';
import { useLocation, useNavigate } from 'react-router-dom';
import Table from '../Components/tailwindUI/Table'
import { TrashIcon, ClipboardIcon, EyeIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import { deleteApp } from '../api/controller/AppController'
function SeeApps() {
    const location = useLocation();
    const history = useNavigate();
    const session = JSON.parse(localStorage.getItem('session'))
    const user = session.user;

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [selectedUser, setSelectedUser] = useState('');
    const [flag, setFlag] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [allApps, setAllApps] = useState([])

    const handleChange = (event) => {
      setSelectedUser(event.target.value);
    };

    const tableColumns = [
      { heading: 'Id', value: 'id',align: 'center' },
      { heading: 'Nombre', value: 'name' , main: true},
    ];

    const handleView = item => {
      /*history(`/clients/view/${item.id}`,{
              client: item,
          }
      )*/
      history(`/app/view/${item.id}`,{
            state:{
                project: location.state.project,
            }
        }
    )
    }
    const handleUpdate = item => {
      history(`/app/update/${item.id}`,{ 
            state:{
                project: location.state.project,
            }
          }
      )
    }

    const handleProjectModel = item => {
        history(`/projects/model/${item.id}`,{
            state:{
    
              project: item,
            }
          }
        )
      }
    
    const handleDelete = async (item) => {
        await deleteApp(item.id, session.token).then(async(response)=>{
            if (response.status === 204){

                setAlertType('Success');
                setAlertMessage('App eliminada correctamente.')
                setError(true);
                setFlag(false);
                getProjectData();
                setAllApps([])
                setTimeout(() => {
                    setError(false);
                    getProjectData();
                }, 1500);
            }else{
                setAlertType('Error');
                setAlertMessage('Error al eliminar la app.')
                setError(true);
            }
        })
    }

    const columnActions = [
        {
            id: 1,
            name: 'Ver app',
            type: 'primary',
            icon: <EyeIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
            action: handleView,
        },
        {
            id: 2,
            name: 'Actualizar app',
            type: 'primary',
            icon: <ClipboardIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
            action: handleUpdate,
        },
        {
            id: 3,
            name: 'Consultar modelos',
            type: 'primary',
            icon: <CircleStackIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
            action: handleProjectModel,
        },
        {
            id: 4,
            name: 'Eliminar app',
            type: 'primary',
            icon: <TrashIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
            action: handleDelete,
        }
      ];

    useEffect(() => {
      getProjectData();
    }, [allApps]);

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const getProjectData = async () => {
        if (allApps.length == 0 && !flag){
            await getProject(session.token, location.state.project.id).then(async(response)=>{
                        let projectArray = await response.json()
                        if (projectArray.project_apps.length == 0){
                            setIsLoadingData(true)
                            setFlag(true);
                            return;
                        }
                        setAllApps(projectArray.project_apps)
                        setIsLoadingData(false)
                        setFlag(true);
                    }
            )
        }
    }
    const handlerCreateApp = () => {
        history('/app/create/'+location.state.project.id,{
            state:{
                project: location.state.project,
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
                    <p className='w-full font-sans text-xl text-black'>/ Dashboard</p>
                    <div className='w-full mr-5'>
                        <Timer/>
                    </div>
                </div>
                <div>
                    <div className='mt-3 ml-5 mr-5 flex flex-row justify-between items-center '>
                        <p className='text-3xl font-bold'>Apps del proyecto: {location.state.project.name}</p>
                        <button onClick={handlerCreateApp} className="rounded-full text-white bg-zinc-400 hover:bg-cyan-400">Crear app</button>
                    </div>
                    <div className="mt-5 w-full overflow-hidden">
                    <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
                    </div>
                    <div className='mt-5'>
                    <Table title='Apps' data={ allApps } isLoadingData={ isLoadingData } columns={ tableColumns } actions={ columnActions }/>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default SeeApps
