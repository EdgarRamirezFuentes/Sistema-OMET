import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import Table from '../Components/tailwindUI/Table'
import { useEffect, useState } from 'react'
import { TrashIcon, ClipboardIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Alert from '../Components/Alert/Alert'
import { getCustomers, deleteCustomer } from '../api/controller/CustomersController';



import Modal from '../Components/tailwindUI/Modal';
import ModalDelete from '../Components/ModalDelete/ModalDelete';

import See from "./See";
import Update from "./Update";
import Create from "./Create";

function Customers() {
  const history = useNavigate();
  const session = JSON.parse(localStorage.getItem('session'));
  const [allClients, setAllClients] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('Error');
  const [deletedUser, setDeletedUser] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);


  //Modales
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);

  useEffect(() => {
    if (deletedUser == null || deletedUser == true){
      clients()
      setDeletedUser(false);
    }
  }, [deletedUser]);

  const clients = async ()=>{
    await getCustomers(session.token).then(async(clients)=>{
      let clientsArray = await clients.json()
      setAllClients(clientsArray)
      setIsLoadingData(false)
    })
  }

  const tableColumns = [
    { heading: 'Id', value: 'id',align: 'center' },
    { heading: 'Nombre', value: 'name' , main: true},
    { heading: 'Email', value: 'email'}
  ];

  const handleView = item => {
    setSelectedCustomer(item)
    setOpenModal(true)
    /*history(`/customers/view/${item.id}`,{
            client: item,
        }
    )*/
  }
  const handleUpdate = item => {
    setSelectedCustomer(item)
    setOpenModalUpdate(true)
    /*history(`/customers/update/${item.id}`,{
            client: item,
        }
    )*/
  }
  
  const handleDelete = async (item) => {
    await deleteCustomer(session.token, item.id).then(async (response)=>{
      if(response.status == 204){
        setError(true);
        setAlertMessage("Customer eliminado correctamente");
        setAlertType('Success');
        setDeletedUser(true);
      }
      else{
        setError(true);
        setAlertMessage("Error al eliminar customer");
        setAlertType('Error');
      }
    })
  }
  const handleModalDelete = (item) => {
    setSelectedCustomer(item)
    setOpenModalDelete(true)

  }

  const columnActions = [
    {
        id: 1,
        name: 'Ver Cliente',
        type: 'primary',
        icon: <EyeIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleView,
    },
    {
        id: 2,
        name: 'Actualizar Cliente',
        type: 'primary',
        icon: <ClipboardIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleUpdate,
    },
    {
        id: 3,
        name: 'Eliminar Cliente',
        type: 'primary',
        icon: <TrashIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleModalDelete,
    }
  ];

  const onCloseHandler = () => {
    setError(null)
    setAlertType('Error');
    setAlertMessage('Ingresa tus datos.')
  }

  const handleCreate = item => {
    setOpenModalCreate(true)
    
    /*history(`/app/create/${item.id}`,{
            client: item,
        }
    )*/
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
                <p className='text-3xl font-bold'>Clientes</p>
                <button onClick={handleCreate} className="rounded-full text-white bg-zinc-400 hover:bg-cyan-400">Crear cliente</button>
            </div>
            <div className="mt-5 w-full overflow-hidden">
              <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
            </div>
            <div className='mt-5'>
              <Table title='Clientes' data={ allClients } isLoadingData={ isLoadingData } columns={ tableColumns } actions={ columnActions }/>
            </div>
          </div>
        </div>
      </div>

      <Modal show={ openModal } setShow={ setOpenModal } className='min-w-full sm:min-w-[1200px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModal(false) }/></div>
          <See customerId={selectedCustomer?.id}/>
      </Modal>

      <Modal show={ openModalUpdate } setShow={ setOpenModalUpdate } className='min-w-full sm:min-w-[1200px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalUpdate(false) }/></div>
          <Update customerId={selectedCustomer?.id}/>
          
      </Modal>
      <Modal show={ openModalCreate } setShow={ setOpenModalCreate } className='min-w-full sm:min-w-[1200px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalCreate(false) }/></div>
          <Create/>
      </Modal>

      <Modal show={ openModalDelete } setShow={ setOpenModalDelete } className='min-w-full sm:min-w-[500px]'>
          <div className='w-full text-gray-400 flex justify-end'><XMarkIcon className='w-7 h-7 cursor-pointer' onClick={ () => setOpenModalDelete(false) }/></div>
          <ModalDelete onDelete={handleDelete}/>
      </Modal>
    </div>
  )
}

export default Customers
