import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import Table from '../Components/tailwindUI/Table'
import { getAllProjects, deleteProject } from '../api/controller/ProjectsController'
import { useEffect, useState } from 'react'
import { TrashIcon, ClipboardIcon, EyeIcon, WrenchScrewdriverIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Alert from '../Components/Alert/Alert'

function Projects() {
  const history = useNavigate();
  const session = JSON.parse(localStorage.getItem('session'));
  const [allClients, setAllClients] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('Error');
  const [deletedProject, setDeletedProject] = useState(null);

  useEffect(() => {
    if (deletedProject == null || deletedProject){
      projects()
      setDeletedProject(false);
    }
  }, [deletedProject]);

  const projects = async ()=>{
    await getAllProjects(session.token).then(async (projects)=>{
      let projectsList = await projects.json()
      if (projectsList.length > 0){
        setAllClients(projectsList)
        setIsLoadingData(false)
      }else{
        setAllClients([])
        setIsLoadingData(true)
      }
    })
  }

  const tableColumns = [
    { heading: 'Id', value: 'id',align: 'center' },
    { heading: 'Nombre', value: 'name' , main: true},
    { heading: 'Customer', value: 'customer.name'}
  ];

  const handleView = item => {
    history(`/projects/view/${item.id}`,{
            client: item,
        }
    )
  }
  const handleUpdate = item => {
    history(`/projects/update/${item.id}`,{
            client: item,
        }
    )
  }
  
  const handleUpdateMaintainer = item => {
    history(`/projects/update/maintainer/${item.id}`,{
            client: item,
        }
    )
  }
  
  const handleDelete = async (item) => {
    await deleteProject(session.token, item.id).then((response)=>{

      if(response.status === 204){
        setAlertType('Success');
        setAlertMessage('Proyecto eliminado correctamente.')
        setError(true);
        setDeletedProject(true);
     }
    })
  }

  const handleProjectModel = item => {
    history(`/app/create/${item.id}`,{
            client: item,
        }
    )
  }

  const columnActions = [
    {
        id: 1,
        name: 'Ver cliente',
        type: 'primary',
        icon: <EyeIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleView,
    },
    {
        id: 2,
        name: 'Actualizar projecto',
        type: 'primary',
        icon: <ClipboardIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleUpdate,
    },
    {
        id: 2,
        name: 'Actualizar maintainers',
        type: 'primary',
        icon: <WrenchScrewdriverIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleUpdateMaintainer,
    },
    {
        id: 4,
        name: 'Project Model',
        type: 'primary',
        icon: <CircleStackIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleProjectModel,
    },
    {
        id: 3,
        name: 'Eliminar cliente',
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
            <div className='mt-3 ml-5 flex flex-row justify-between items-center '>
                <p className='text-3xl font-bold'>Proyectos</p>
            </div>
            <div className="mt-5 w-full overflow-hidden">
              <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
            </div>
            <div className='mt-5'>
              <Table title='Proyectos' data={ allClients } isLoadingData={ isLoadingData } columns={ tableColumns } actions={ columnActions }/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Projects
