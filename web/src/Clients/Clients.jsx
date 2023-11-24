import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import Table from '../Components/tailwindUI/Table'
import { getAllClients, resetPassword, deleteUser, filterClients } from '../api/controller/ClientsController'
import { useEffect, useState } from 'react'
import { TrashIcon, ClipboardIcon, EyeIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Alert from '../Components/Alert/Alert'
import Modal from '../Components/tailwindUI/Modal';
import ModalDelete from '../Components/ModalDelete/ModalDelete';
import ModalReset from '../Components/ModalReset/ModalReset';
import SearchBar from '../Components/tailwindUI/SearchBar'
import See from "./See";
import Update from "./Update";
import Create from "./Create";

function Clients() {
  const session = JSON.parse(localStorage.getItem('session'));
  const [allClients, setAllClients] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('Error');
  const [deletedUser, setDeletedUser] = useState(null);
  const [seeClient, setSeeClient] = useState(null);
  const [clientToUpdate, setClientToUpdate] = useState(null);
  const [clientToResetPassword, setClientToResetPassword] = useState(null);
  const [flag, setFlag] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filteredClients, setFilteredClients] = useState([])

  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalResetPassword, setOpenModalResetPassword] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (deletedUser == null || deletedUser == true || !flag){
      clients()
      setDeletedUser(false);
    }
  }, [deletedUser, flag, allClients, filteredClients]);

  const clients = async ()=>{
    await getAllClients(session.token).then(async(clients)=>{
      let clientsArray = await clients.json()
      setAllClients(clientsArray)
      setIsLoadingData(false)
    })
  }

  const tableColumns = [
    { heading: 'Id', value: 'id',align: 'center' },
    { heading: 'Nombre', value: 'name' , main: true},
    { heading: 'Apellido Paterno', value: 'first_last_name'},
    { heading: 'Apellido Materno', value: 'second_last_name'}
  ];

  const handleView = item => {
    setSeeClient(item)
    setOpenModal(true)
    /*history(`/clients/view/${item.id}`,{
            client: item,
        }
    )*/
  }
  const handleUpdate = item => {
    setOpenModalUpdate(true)
    setClientToUpdate(item)

    /*history(`/clients/update/${item.id}`,{
            client: item,
        }
    )*/
  }
  
  const handleReset = item => {
    setOpenModalResetPassword(true)
    setClientToResetPassword(item)


    /*history(`/clients/update/${item.id}`,{
            client: item,
        }
    )*/
  }

  const handleDeleteModal = item => {
    setOpenModalDelete(true);
    setItemToDelete(item);
  }

  const createClient = () => {
    setOpenModalCreate(true);
  }
  
  const handleDelete = async () => {
    await deleteUser(session.token, itemToDelete.id).then(async (response)=>{
      if(response.status == 204){
        setError(true);
        setAlertMessage("Usuario eliminado correctamente");
        setAlertType('Success');
        setDeletedUser(true);
      }
      else{
        setError(true);
        setAlertMessage("Error al eliminar usuario");
        setAlertType('Error');
      }
      setItemToDelete(null)
      setOpenModalDelete(false);

    })
    //setDeletedUser(true);
  }
  
  const handleResetPassword = async () => {
    await resetPassword(session.token, clientToResetPassword.id).then(async(response)=>{
      let res = await response.json()
      if(res.non_field_errors){
        setError(true);
        setAlertMessage(res.non_field_errors[0]);
        setAlertType('Error');
        return;
      }
      if(res.message){
        setError(true);
        setAlertMessage(res.message);
        setAlertType('Success');
        return;
      }
      setClientToResetPassword(null)
      setOpenModalResetPassword(false);
    })
  }

  const columnActions = [
    {
        id: 1,
        name: 'Ver Usuario',
        type: 'primary',
        icon: <EyeIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleView,
    },
    {
        id: 2,
        name: 'Actualizar Usuario',
        type: 'primary',
        icon: <ClipboardIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleUpdate,
    },
    {
        id: 3,
        name: 'Eliminar Usuario',
        type: 'primary',
        icon: <TrashIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleDeleteModal,
    },
    {
        id: 4,
        name: 'Resetear Contraseña',
        type: 'primary',
        icon: <PaperAirplaneIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleReset,
    }
  ];

  const filterClient = async (value)=>{
    setFilterText(value)
    await filterClients(session.token, value).then(async (response)=>{
      let res = await response.json()
      setFilteredClients(res)
      console.log(res)
    })
  }

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
                <p className='text-3xl font-bold'>Usuarios</p>
                <button onClick={createClient} className="rounded-full text-white bg-zinc-400 hover:bg-cyan-400">Registrar usuario</button>
            </div>
            <div className="mt-5 w-full overflow-hidden">
              <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
            </div>
            <div className='ml-3 mr-5'>
              <SearchBar value={filterText} setValue={filterClient} placeholder_desktop={"Buscar"}/>
            </div>
            <div className='mt-5'>
              <Table title='Clientes' data={filteredClients.length >0 ? filteredClients:allClients } isLoadingData={ isLoadingData } columns={ tableColumns } actions={ columnActions }/>
            </div>
          </div>
        </div>
      </div>


      <Modal show={ openModalCreate } setShow={ setOpenModalCreate } className='min-w-full sm:min-w-[1200px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalCreate(false) }/></div>
          <Create onDelete={handleDelete} onCreated={()=>{setOpenModalCreate(false);setFlag(false)}}/>
      </Modal>

      <Modal show={ openModalDelete } setShow={ setOpenModalDelete } className='min-w-full sm:min-w-[500px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalDelete(false) }/></div>
          <ModalDelete onDelete={handleDelete}/>
      </Modal>

      <Modal show={ openModal } setShow={ setOpenModal } className='min-w-full sm:min-w-[1200px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModal(false) }/></div>
          <See userId={seeClient?.id}/>
      </Modal>

      <Modal show={ openModalUpdate } setShow={ setOpenModalUpdate } className='min-w-full sm:min-w-[1200px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalUpdate(false) }/></div>
          <Update userId={clientToUpdate?.id} onUpdate={()=>{setOpenModalUpdate(false);setFlag(false)}}/>
      </Modal>

      <Modal show={ openModalResetPassword } setShow={ setOpenModalResetPassword } className='min-w-full sm:min-w-[500px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalResetPassword(false) }/></div>
          <ModalReset onReset={handleResetPassword}/>
      </Modal>
    </div>
  )
}

export default Clients
