import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import Table from '../Components/tailwindUI/Table'
import { getAllProjects, deleteProject } from '../api/controller/ProjectsController'
import { useEffect, useState } from 'react'
import { TrashIcon, ClipboardIcon, EyeIcon, CircleStackIcon, ArrowDownOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Alert from '../Components/Alert/Alert'
import { exportProject } from '../api/controller/ExportController'
import Modal from '../Components/tailwindUI/Modal';
import ModalDelete from '../Components/ModalDelete/ModalDelete';
import {filterProjects} from '../api/controller/ProjectsController'
import SearchBar from '../Components/tailwindUI/SearchBar'

import See from "./See";
import Update from "./Update";
import Create from "./Create";
function Projects() {
  const history = useNavigate();
  const session = JSON.parse(localStorage.getItem('session'));
  const [allClients, setAllClients] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [filterText, setFilterText] = useState('');

  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('Error');
  const [deletedProject, setDeletedProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [flag, setFlag] = useState(false);


  //Modales
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);

  useEffect(() => {
    if (deletedProject == null || deletedProject || !flag){
      projects()
      setDeletedProject(false);
    }
    
  }, [deletedProject, flag, filteredProjects]);

  const projects = async ()=>{
    await getAllProjects(session.token).then(async (projects)=>{
      let projectsList = await projects.json()
      if (projectsList.length > 0 || !flag){
        setAllClients(projectsList)
        setIsLoadingData(false)
        setFlag(true)
      }else{
        setAllClients([])
        setIsLoadingData(true)
      }
    })
  }

  const filterProject = async (value)=>{
    setFilterText(value)
    await filterProjects(session.token, value).then(async (response)=>{
      let res = await response.json()
      if (res.length > 0){
        setFilteredProjects(res)
      }else{
        setError(true)
        setAlertType('Warning');
        setAlertMessage('No se encontraron resultados.')
      }
    })
  }

  const tableColumns = [
    { heading: 'Id', value: 'id',align: 'center' },
    { heading: 'Nombre', value: 'name' , main: true},
    { heading: 'Cliente', value: 'customer.name'}
  ];

  const handleView = item => {
    setOpenModal(true)
    setSelectedProject(item)
  }
  const handleUpdate = item => {
    setOpenModalUpdate(true)
    setSelectedProject(item)
  }
  
  const handleDelete = async (item) => {
    setOpenModalDelete(true)
    setSelectedProject(item)
  }

  const deleteProjectFunc = async () => {
    await deleteProject(session.token, selectedProject.id).then((response)=>{

      if(response.status === 204){
        setOpenModalDelete(false)
        setAlertType('Success');
        setAlertMessage('Proyecto eliminado correctamente.')
        setError(true);
        setDeletedProject(true);
     }
    })
  }

  const handleApps = item => {
    history(`/apps/`,{
        state:{
          project: item,
        }
      }
    )
  }

  const handleDownloadProject = async(item) => {
    console.log(item)
    await exportProject(item.id, session.token).then(async (response)=>{
      if(response.status === 200){
        const blob = await response.blob();
        const newBlob = new Blob([blob]);

        const blobUrl = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', `${item.name.replaceAll(" ",'_')}.zip`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        // clean up Url
        window.URL.revokeObjectURL(blobUrl);
        setAlertType('Success');
        setAlertMessage('Proyecto exportado correctamente.')
        setError(true);
        setDeletedProject(true);
     }else{
      let res = await response.json()
      setAlertType('Error');
      setAlertMessage(res.error)
      setError(true);
     }

    })
  }

  const handleCreate = item => {
    setOpenModalCreate(true)
  }

  const columnActions = [
    {
        id: 1,
        name: 'Ver Proyecto',
        type: 'primary',
        icon: <EyeIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleView,
    },
    {
        id: 2,
        name: 'Actualizar Proyecto',
        type: 'primary',
        icon: <ClipboardIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleUpdate,
    },
    {
        id: 3,
        name: 'Consultar Apps',
        type: 'primary',
        icon: <CircleStackIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleApps,
    },
    {
        id: 4,
        name: 'Exportar Proyecto',
        type: 'primary',
        icon: <ArrowDownOnSquareIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleDownloadProject,
    },
    {
        id: 5,
        name: 'Eliminar Proyecto',
        type: 'primary',
        icon: <TrashIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleDelete,
    }
  ];

  const onCloseHandler = () => {
    setError(null)
    setAlertType('Error');
    setAlertMessage('Ingresa tus datos.')
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
                <p className='text-3xl font-bold'>Proyectos</p>
                <button onClick={handleCreate} className="rounded-full text-white bg-zinc-400 hover:bg-cyan-400">Crear proyecto</button>
            </div>
            <div className="mt-5 w-full overflow-hidden">
              <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
            </div>
            <div className='ml-3 mr-5'>
              <SearchBar value={filterText} setValue={filterProject} placeholder_desktop={"Buscar"}/>
            </div>
            <div className='mt-5'>
              <Table title='Proyectos' data={filteredProjects.length >0 ? filteredProjects:allClients } isLoadingData={ isLoadingData } columns={ tableColumns } actions={ columnActions }/>
            </div>
          </div>
        </div>
      </div>


      <Modal show={ openModal } setShow={ setOpenModal } className='min-w-full sm:min-w-[1200px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModal(false) }/></div>
          <See projectId={selectedProject?.id}/>
      </Modal>

      <Modal show={ openModalUpdate } setShow={ setOpenModalUpdate } className='min-w-full sm:min-w-[1200px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalUpdate(false) }/></div>
          <Update projectId={selectedProject?.id} onUpdated={()=>{setOpenModalUpdate(false);setFlag(false)}}/>
          
      </Modal>
      <Modal show={ openModalCreate } setShow={ setOpenModalCreate } className='min-w-full sm:min-w-[1200px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalCreate(false) }/></div>
          <Create onCreated={()=>{setOpenModalCreate(false);setFlag(false)}}/>
      </Modal>

      <Modal show={ openModalDelete } setShow={ setOpenModalDelete } className='min-w-full sm:min-w-[500px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalDelete(false) }/></div>
          <ModalDelete onDelete={deleteProjectFunc}/>
      </Modal>
    </div>
  )
}

export default Projects
