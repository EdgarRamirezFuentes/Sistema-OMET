import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { getProject } from '../api/controller/ProjectsController'
import { useLocation, useNavigate } from 'react-router-dom';
import Table from '../Components/tailwindUI/Table'
import { TrashIcon, ClipboardIcon, EyeIcon, CircleStackIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { deleteApp, filterApps } from '../api/controller/AppController'
import SearchBar from '../Components/tailwindUI/SearchBar'
import Modal from '../Components/tailwindUI/Modal';
import ModalDelete from '../Components/ModalDelete/ModalDelete';

import See from "./See";
import Update from "./Update";
import Create from "./Create";
function SeeApps() {
    const location = useLocation();
    const history = useNavigate();
    const session = JSON.parse(localStorage.getItem('session'))

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [flag, setFlag] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [allApps, setAllApps] = useState([])
    const [filteredData, setFilteredData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);

    //Modales
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);

    const tableColumns = [
      { heading: 'Id', value: 'id',align: 'center' },
      { heading: 'Nombre', value: 'name' , main: true},
    ];

    const handleView = item => {
        setOpenModal(true)
        setSelectedApp(item)
    }
    const handleUpdate = item => {
        setOpenModalUpdate(true)
        setSelectedApp(item)
    }

    const handleProjectModel = item => {
        history(`/model/get/${item.id}`,{
            state:{
              project: location.state.project,
            }
          }
        )
      }
    
    const handleDelete = async (item) => {
        setOpenModalDelete(true)
        setSelectedApp(item)
        /**/
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
        console.log("refresh")
      getProjectData();
    }, [allApps, flag]);

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const getProjectData = async () => {
        if (allApps.length == 0 || !flag){
            await getProject(session.token, location.state.project.id).then(async(response)=>{
                console.log("response",response)
                if (response.status === 404){
                    setIsLoadingData(true)
                    setFlag(true);
                    setError(true);
                    setAlertType('Error');
                    setAlertMessage('No se encontraron las apps del proyecto.')
                    return;
                }
                let projectArray = await response.json()
                if (projectArray.project_apps.length == 0){
                    setIsLoadingData(true)
                    setFlag(true);
                    return;
                }
                setAllApps(projectArray.project_apps)
                setIsLoadingData(false)
                setFlag(true);
            })
        }
    }
    const handlerCreateApp = () => {
        setOpenModalCreate(true)
        /*history('/app/create/'+location.state.project.id,{
            state:{
                project: location.state.project,
            }
        })*/
    }
    const filterData = async (value)=>{
        setFilterText(value)
        await filterApps(session.token, value, location.state.project.id).then(async (response)=>{
          let res = await response.json()
          setFilteredData(res)
        })
      }

    const delete_ = async () => {
        await deleteApp(selectedApp.id, session.token).then(async(response)=>{
            if (response.status === 204){

                setAlertType('Success');
                setAlertMessage('App eliminada correctamente.')
                setError(true);
                setFlag(false);
                getProjectData();
                setAllApps([])
                setTimeout(() => {
                    getProjectData();
                }, 1500);
                setOpenModalDelete(false);
            }else{
                setAlertType('Error');
                setAlertMessage('Error al eliminar la app.')
                setError(true);
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
                    <div className='ml-3 mr-5'>
                        <SearchBar value={filterText} setValue={filterData} placeholder_desktop={"Buscar"}/>
                    </div>
                    <div className='mt-5'>
                        <Table title='Apps' data={ filteredData.length >0 ? filteredData: allApps } isLoadingData={ isLoadingData } columns={ tableColumns } actions={ columnActions }/>
                    </div>
                </div>
                </div>
            </div>
            <Modal show={ openModal } setShow={ setOpenModal } className='min-w-full sm:min-w-[1200px]'>
                <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModal(false) }/></div>
                <See appId={selectedApp?.id}/>
            </Modal>

            <Modal show={ openModalUpdate } setShow={ setOpenModalUpdate } className='min-w-full sm:min-w-[1200px]'>
                <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalUpdate(false) }/></div>
                <Update appId={selectedApp?.id} onUpdated={()=>{setOpenModalUpdate(); setFlag(false)}}/>
                
            </Modal>
            <Modal show={ openModalCreate } setShow={ setOpenModalCreate } className='min-w-full sm:min-w-[1200px]'>
                <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalCreate(false) }/></div>
                <Create projectId={location?.state?.project?.id} onCreated={()=>{setOpenModalCreate(false);setFlag(false)}}/>
            </Modal>

            <Modal show={ openModalDelete } setShow={ setOpenModalDelete } className='min-w-full sm:min-w-[500px]'>
                <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalDelete(false) }/></div>
                <ModalDelete onDelete={delete_}/>
            </Modal>
        </div>
    )
}

export default SeeApps
