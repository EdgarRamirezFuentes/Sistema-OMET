import '../../App.css'
import Timer from '../../Components/Timer/Timer'
import SideBar from '../../Components/Sidebar/Sidebar'
import Table from '../../Components/tailwindUI/Table'
import { deleteProject, getProjectModels, deleteProjectModel } from '../../api/controller/ProjectsController'
import { useEffect, useState } from 'react'
import { TrashIcon, ClipboardIcon, EyeIcon, CircleStackIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Alert from '../../Components/Alert/Alert'
import { useParams, useLocation } from 'react-router-dom'

function Models() {
    const params = useParams();
    const location = useLocation();
    const history = useNavigate();
    const session = JSON.parse(localStorage.getItem('session'));
    const [allModels, setAllModels] = useState([])
    const [isLoadingData, setIsLoadingData] = useState(true)

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [deletedProject, setDeletedProject] = useState(null);

  useEffect(() => {
    if (deletedProject == null || deletedProject){
      getModels()
      setDeletedProject(false);
    }
  }, [deletedProject]);

  const getModels = async ()=>{
    await getProjectModels(session.token, params.id).then(async (models)=>{
      let modelList = await models.json()
      if (modelList.length > 0){
        setAllModels(modelList)
        setIsLoadingData(false)
      }else{
        setAllModels([])
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
    history(`/projects/model/view/${item.id}`,{
            item: item,
            model: params.id
        }
    )
  }
  const handleUpdate = item => {
    history(`/projects/model/update/${item.id}`,{
                state: {
                    item: item,
                    model: params.id
                }
        }
    )
  }
  
  const handleUpdateMaintainer = item => {
    history(`/projects/update/maintainer/${item.id}`,{
            item: item,
        }
    )
  }
  
  const handleDelete = async (item) => {
    await deleteProjectModel(session.token, item.id).then((response)=>{

      if(response.status === 204){
        setAlertType('Success');
        setAlertMessage('Modelo eliminado correctamente.')
        setError(true);
        setDeletedProject(true);
     }
    })
  }

  const handleProjectModel = item => {
    history(`/projects/create/model/${item.id}`,{
            client: item,
        }
    )
  }

  const columnActions = [
    {
        id: 1,
        name: 'Ver modelo',
        type: 'primary',
        icon: <EyeIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleView,
    },
    {
        id: 2,
        name: 'Project Model',
        type: 'primary',
        icon: <AdjustmentsHorizontalIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleProjectModel,
    },
    {
        id: 3,
        name: 'Eliminar modelo',
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
                <p className='text-3xl font-bold'>Modelos</p>
                <button onClick={()=>{history('/projects/model/create/'+params.id)}} className="rounded-full text-white bg-zinc-400 hover:bg-cyan-400 mr-5">Crear Modelo</button>
            </div>
            <div className="mt-5 w-full overflow-hidden">
              <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
            </div>
            <div className='mt-5'>
              <Table title='Clientes' data={ allModels } isLoadingData={ isLoadingData } columns={ tableColumns } actions={ columnActions }/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Models
