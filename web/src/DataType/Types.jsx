import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import Table from '../Components/tailwindUI/Table'
import { getDataTypes, deleteDataType } from '../api/controller/DataTypeController'
import { useEffect, useState } from 'react'
import { TrashIcon, ClipboardIcon, EyeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Alert from '../Components/Alert/Alert'

function DataTypes() {
  const history = useNavigate();
  const session = JSON.parse(localStorage.getItem('session'));
  const [allDataTypes, setAllDataTypes] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('Error');
  const [deletedUser, setDeletedUser] = useState(null);

  useEffect(() => {
    if (deletedUser == null || deletedUser == true){
      dataTypes()
      setDeletedUser(false);
    }
  }, [deletedUser]);

  const dataTypes = async ()=>{
    await getDataTypes(session.token).then(async(clients)=>{
      let clientsArray = await clients.json()
      console.log("clientsArray");
      console.log(clientsArray);
      setAllDataTypes(clientsArray)
      setIsLoadingData(false)
    })
  }

  const tableColumns = [
    { heading: 'Id', value: 'id',align: 'center' },
    { heading: 'Nombre', value: 'name' , main: true},
    { heading: 'Tipo de input', value: 'input_type'}
  ];

  const handleView = item => {
    history(`/data-type/view/${item.id}`,{
            client: item,
        }
    )
  }
  const handleUpdate = item => {
    history(`/data-type/update/${item.id}`,{
            client: item,
        }
    )
  }
  
  const handleDelete = async (item) => {
    await deleteDataType(item.id, session.token).then(async (response)=>{
      if(response.status == 204){
        setError(true);
        setAlertMessage("Tipo de dato eliminado correctamente");
        setAlertType('Success');
        setDeletedUser(true);
      }
      else{
        setError(true);
        setAlertMessage("Error al eliminar tipo de dato");
        setAlertType('Error');
      }
      

      /*
      let json = await response.json()
      console.log("json");
      console.log(json);
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
      }*/

    })
    setDeletedUser(true);
  }

  const columnActions = [
    {
        id: 1,
        name: 'Ver tipo de dato',
        type: 'primary',
        icon: <EyeIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleView,
    },
    {
        id: 2,
        name: 'Actualizar tipo de dato',
        type: 'primary',
        icon: <ClipboardIcon className='w-5 h-5 text-gray-600 lg:text-white'/>,
        action: handleUpdate,
    },
    {
        id: 3,
        name: 'Eliminar tipo de dato',
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
            <p className='w-full font-sans text-xl text-black'>/ Tipo de dato</p>
            <div className='w-full mr-5'>
                <Timer/>
            </div>
          </div>
          <div>
            <div className='mt-3 ml-5 flex flex-row justify-between items-center '>
                <p className='text-3xl font-bold'>Tipos de datos</p>
            </div>
            <div className="mt-5 w-full overflow-hidden">
              <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
            </div>
            <div className='mt-5'>
              <Table title='Clientes' data={ allDataTypes } isLoadingData={ isLoadingData } columns={ tableColumns } actions={ columnActions }/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTypes
