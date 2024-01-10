import '../../App.css'
import Timer from '../../Components/Timer/Timer'
import SideBar from '../../Components/Sidebar/Sidebar'
import Table from '../../Components/tailwindUI/Table'
import { useEffect, useState } from 'react'
import { TrashIcon, ClipboardIcon, EyeIcon, XMarkIcon, Bars4Icon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Alert from '../../Components/Alert/Alert'
import { useParams } from 'react-router-dom'
import { getModelFields, deleteModelField, filterModelFields } from '../../api/controller/ModelFieldsController'
import Modal from '../../Components/tailwindUI/Modal';
import ModalDelete from '../../Components/ModalDelete/ModalDelete';
import SearchBar from '../../Components/tailwindUI/SearchBar'
import See from "./See";
import Update from "./Update";
import Create from "./Create";

function Models() {
    const params = useParams();
    const history = useNavigate();
    const session = JSON.parse(localStorage.getItem('session'));
    const [allModels, setAllModels] = useState([])
    const [isLoadingData, setIsLoadingData] = useState(false)

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [deletedProject, setDeletedProject] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [flag, setFlag] = useState(false);

    const [filteredData, setFilteredData] = useState([]);
    const [filterText, setFilterText] = useState('');


    //Modales
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);

  useEffect(() => {
    if (deletedProject == null || deletedProject || !flag){
      getModels()
      setDeletedProject(false);
    }
  }, [selectedModel, deletedProject, flag, allModels]);

  const getModels = async ()=>{
    console.log("token",session.token)
    console.log("id",params.id)
    await getModelFields(params.id, session.token).then(async (models)=>{
      let modelList = await models.json()
      console.log("===>",modelList)
      if (modelList.length != 0 || !flag){
        setAllModels(modelList)
        setIsLoadingData(false)
      }else{
        setAllModels([])
      }
      setFlag(true)
    })
  }

  const tableColumns = [
    { heading: 'Id', value: 'id',align: 'center' },
    { heading: 'Nombre', value: 'name' , main: true},
    { heading: 'Descripción', value: 'caption'},
  ];

  const handleCreate = () => {
    setOpenModalCreate(true)
    //history('/model/create/'+params.id)
  }

  const handleView = item => {
    
    console.log("item",item)
    setSelectedModel(item)
    setOpenModal(true)
    /*console.log("item",item);
    history(`/model/view/${item.id}`,{
              state:{
                item: item,
                model: params.id
              }
        })*/
  }
  const handleUpdate = item => {
    console.log("item",item)
    setSelectedModel(item)
    setOpenModalUpdate(true)
    /*history(`/model/update/${item.id}`,{
              state: {
                  item: item,
                  model: params.id
              }
        })*/
  }
  
  const handleValidators = item => {
    history(`/model/validators/${item.id}`,{
              state: {
                  item: item,
                  model: params.id
              }
        }
    )
  }
  
  const handleDelete = async (item) => {
    await deleteModelField(selectedModel.id, session.token).then((response)=>{

      if(response.status === 204){
        setAlertType('Success');
        setAlertMessage('Modelo eliminado correctamente.')
        setError(true);
        setDeletedProject(true);
        setOpenModalDelete(false)
     }
    })
  }

  const filterData = async (value)=>{
    setFilterText(value)
    await filterModelFields(session.token, value, params.id).then(async (response)=>{
      let res = await response.json()
      if (res.length > 0){

        setFilteredData(res)
      }else{
        setError(true)
        setAlertType('Warning');
        setAlertMessage('No se encontraron resultados.')
      }
    })
  }

  const deleteModal = item => {
    setSelectedModel(item)
    setOpenModalDelete(true)
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
        name: 'Validadores',
        type: 'primary',
        icon: <Bars4Icon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleValidators,
    },
    {
        id: 4,
        name: 'Eliminar campo',
        type: 'primary',
        icon: <TrashIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: deleteModal,
    }
  ];

  const onCloseHandler = () => {
    setError(null)
    setAlertType('Error');
    setAlertMessage('Ingresa tus datos.')
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
                <p className='text-3xl font-bold'>Campos</p>
                <button onClick={handleCreate} className="rounded-full text-white bg-zinc-400 hover:bg-cyan-400 mr-5">Crear campo</button>
            </div>
            <div className="mt-5 w-full overflow-hidden">
              <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
            </div>
            <div className='ml-3 mr-5'>
              <SearchBar value={filterText} setValue={filterData} placeholder_desktop={"Buscar"}/>
            </div>
            <div className='mt-5'>
              <Table title='Campos' data={filteredData.length >0 ? filteredData:allModels } isLoadingData={ isLoadingData } columns={ tableColumns } actions={ columnActions }/>
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
          <Update modelId={params.id} field={selectedModel} onUpdated={()=>{setOpenModalUpdate(false);setFlag(false);}}/>
          
      </Modal>
      <Modal show={ openModalCreate } setShow={ setOpenModalCreate } className='min-w-full sm:min-w-[1200px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalCreate(false) }/></div>
          <Create modelId={params.id} onCreated={(flag)=>{setOpenModalCreate(false); getModels()}}/>
      </Modal>

      <Modal show={ openModalDelete } setShow={ setOpenModalDelete } className='min-w-full sm:min-w-[500px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalDelete(false) }/></div>
          <ModalDelete onDelete={handleDelete}/>
      </Modal>
    </div>
  )
}

export default Models
