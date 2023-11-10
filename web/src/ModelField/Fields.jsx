import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import Table from '../Components/tailwindUI/Table'
import { useEffect, useState } from 'react'
import { TrashIcon, ClipboardIcon, EyeIcon, XMarkIcon, CircleStackIcon} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Alert from '../Components/Alert/Alert'
import { useParams, useLocation } from 'react-router-dom'
import { getModels, delete_ } from '../api/controller/ModelFieldsController'

import Modal from '../Components/tailwindUI/Modal';
import ModalDelete from '../Components/ModalDelete/ModalDelete';

import See from "./See";
import Update from "./Update";
import Create from "./Create";

function Models() {
    const params = useParams();
    const location = useLocation();
    const history = useNavigate();
    const session = JSON.parse(localStorage.getItem('session'));
    const [allModels, setAllModels] = useState([])
    const [isLoadingData, setIsLoadingData] = useState(false)

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [deletedProject, setDeletedProject] = useState(null);

    const [selectedModel, setSelectedModel] = useState(null);

    //Modales
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);

  useEffect(() => {
    if (deletedProject == null || deletedProject){
      getModelsFields()
      setDeletedProject(false);
    }
  }, [allModels]);

  const getModelsFields = async ()=>{
    await getModels(params.id, session.token).then(async (models)=>{
      let modelList = await models.json()
      console.log("modelList",modelList);
      if (modelList.length != []){
        setAllModels(modelList)
        setIsLoadingData(false)
      }else{
        setAllModels([])
      }
    })
  }

  const tableColumns = [
    { heading: 'Id', value: 'id',align: 'center' },
    { heading: 'Nombre', value: 'name' , main: true}
  ];

  const handleView = item => {
    setOpenModal(true)
    setSelectedModel(item)
    console.log("item",item);
    /*history(`/model/view/${item.id}`,{
      state:{
        item: item,
        model: params.id
      }
    })*/
  }
  const handleUpdate = item => {

    setSelectedModel(item)
    setOpenModalUpdate(true)
    console.log("item",item);
    /*history(`/model/update/${item.id}`,{
      state: {
        item: item,
        model: params.id
      }
    })*/
  }
  
  const handleDelete = async (item) => {
    setOpenModalDelete(true)
    setSelectedModel(item)
    
  }


  const handleProjectModel = item => {
    history(`/projects/field/${item.id}`,{
        state:{

          project: item,
        }
      }
    )
  }

  const handleDeleteModel = async () => {
    await delete_(selectedModel.id, session.token).then((response)=>{

      if(response.status === 204){
        setAlertType('Success');
        setAlertMessage('Modelo eliminado correctamente.')
        setError(true);
        setDeletedProject(true);
     }
    })
  }

  const columnActions = [
    {
        id: 1,
        name: 'Ver campo',
        type: 'primary',
        icon: <EyeIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleView,
    },
    {
        id: 2,
        name: 'Actualizar campo',
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
        name: 'Eliminar campo',
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
  const handlerCreateApp = () => {
    setOpenModalCreate(true)
    /*history('/app/create/'+location.state.project.id,{
        state:{
            project: location.state.project,
        }
    })*/
}

  return (
    <div className="w-full h-full bg-slate-100">
      <div className='flex flex-row h-full'>
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
                <button onClick={handlerCreateApp} className="rounded-full text-white bg-zinc-400 hover:bg-cyan-400 mr-5">Crear modelo</button>
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

      <Modal show={ openModal } setShow={ setOpenModal } className='min-w-full sm:min-w-[1200px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModal(false) }/></div>
          <See model={selectedModel}/>
      </Modal>

      <Modal show={ openModalUpdate } setShow={ setOpenModalUpdate } className='min-w-full sm:min-w-[1200px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalUpdate(false) }/></div>
          <Update model={selectedModel}/>
          
      </Modal>
      <Modal show={ openModalCreate } setShow={ setOpenModalCreate } className='min-w-full sm:min-w-[1200px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalCreate(false) }/></div>
          <Create projectAppId={location?.state?.project?.id}/>
      </Modal>

      <Modal show={ openModalDelete } setShow={ setOpenModalDelete } className='min-w-full sm:min-w-[500px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalDelete(false) }/></div>
          <ModalDelete onDelete={handleDeleteModel}/>
      </Modal>
    </div>
  )
}

export default Models
