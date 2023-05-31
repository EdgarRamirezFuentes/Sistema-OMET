import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import Table from '../Components/tailwindUI/Table'
import { getAllClients, resetPassword, deleteUser } from '../api/controller/ClientsController'
import { useEffect, useState } from 'react'
import { TrashIcon, ClipboardIcon, EyeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Alert from '../Components/Alert/Alert'
import { getCustomers, deleteCustomer } from '../api/controller/CustomersController';

function Customers() {
  const history = useNavigate();
  const session = JSON.parse(localStorage.getItem('session'));
  const [allClients, setAllClients] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('Error');
  const [deletedUser, setDeletedUser] = useState(null);

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
    history(`/customers/view/${item.id}`,{
            client: item,
        }
    )
  }
  const handleUpdate = item => {
    history(`/customers/update/${item.id}`,{
            client: item,
        }
    )
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

  const columnActions = [
    {
        id: 1,
        name: 'Ver customer',
        type: 'primary',
        icon: <EyeIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleView,
    },
    {
        id: 2,
        name: 'Actualizar customer',
        type: 'primary',
        icon: <ClipboardIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleUpdate,
    },
    {
        id: 3,
        name: 'Eliminar customer',
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
                <p className='text-3xl font-bold'>Clientes</p>
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
    </div>
  )
}

export default Customers
