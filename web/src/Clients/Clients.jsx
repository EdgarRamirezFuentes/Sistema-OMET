import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import Table from '../Components/tailwindUI/Table'
import { getAllClients, resetPassword, deleteUser } from '../api/controller/ClientsController'
import { useEffect, useState } from 'react'
import { TrashIcon, ClipboardIcon, EyeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Alert from '../Components/Alert/Alert'

function Clients() {
  const history = useNavigate();

  const [allClients, setAllClients] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('Error');
  const [deletedUser, setDeletedUser] = useState(null);

  useEffect(() => {
    clients()
  }, []);

  const clients = async ()=>{
    await getAllClients(JSON.parse(localStorage.getItem('session')).token).then((clients)=>{
      setAllClients(clients)
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
    history(`/clients/view/${item.id}`,{
            client: item,
        }
    )
  }
  const handleUpdate = item => {
    history(`/clients/update/${item.id}`,{
            client: item,
        }
    )
  }
  
  const handleDelete = async (item) => {
    await deleteUser(JSON.parse(localStorage.getItem('session')).token, item.id).then((response)=>{

      if(response.non_field_errors){
        setError(true);
        setAlertMessage(response.non_field_errors[0]);
        setAlertType('Error');
        return;
      }
      if(response.message){
        setError(true);
        setAlertMessage(response.message);
        setAlertType('Success');
        return;
      }

    })
    //setDeletedUser(true);
  }
  
  const handleResetPassword = async (item) => {
    await resetPassword(JSON.parse(localStorage.getItem('session')).token, item.id).then((response)=>{
      if(response.non_field_errors){
        setError(true);
        setAlertMessage(response.non_field_errors[0]);
        setAlertType('Error');
        return;
      }
      if(response.message){
        setError(true);
        setAlertMessage(response.message);
        setAlertType('Success');
        return;
      }
    })
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
        name: 'Actualizar cliente',
        type: 'primary',
        icon: <ClipboardIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleUpdate,
    },
    {
        id: 3,
        name: 'Eliminar cliente',
        type: 'primary',
        icon: <TrashIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleDelete,
    },
    {
        id: 4,
        name: 'Resetear password',
        type: 'primary',
        icon: <PaperAirplaneIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleResetPassword,
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

export default Clients
