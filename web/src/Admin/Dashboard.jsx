import { useEffect, useState } from 'react'
import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import Table from '../Components/tailwindUI/Table'
import { TrashIcon, ClipboardIcon, EyeIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getCustomerCreateLogs, getProjectCreateLogs, getUserCreateLogs, getCustomerUpdateLogs} from '../api/controller/LogsController'
import { getProjectUpdateLogs, getUserUpdateLogs } from '../api/actions/logs'
function Dashboard() {
  const session = JSON.parse(localStorage.getItem('session'));
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    getLogData()
  },[])

  const getLogData = async () => {

    await getCustomerUpdateLogs(session.token).then(async(clients)=>{
      let clientsArray = await clients.json()
      setClients(clientsArray)
      setIsLoadingData(false)
    })

    await getUserUpdateLogs(session.token).then(async(users)=>{
      let usersArray = await users.json()
      setUsers(usersArray)
      setIsLoadingData(false)
    })

    await getProjectUpdateLogs(session.token).then(async(projects)=>{
      let projectsArray = await projects.json()
      setProjects(projectsArray)
      setIsLoadingData(false)
    })

  }

  const tableColumnsCustomer = [
    { heading: 'Nombre Previo', value: 'previous_name' },
    { heading: 'Numero Previo', value: 'previous_phone' },
    { heading: 'Email Previo', value: 'previous_email' },
    { heading: 'Nombre Actualizado', value: 'updated_name' },
    { heading: 'Numero Actualizado', value: 'updated_phone' },
    { heading: 'Email Actualizado', value: 'updated_email' },
    { heading: 'Fecha de actualización', value: 'updated_date' },
  ];
  const tableColumnsProject = [
    { heading: 'Nombre Previo', value: 'previous_name' },
    { heading: 'Descripción Previa', value: 'previous_description' },

    { heading: 'Nombre Actualizado', value: 'updated_name' },
    { heading: 'Descripción Actualizada', value: 'updated_description' },
    { heading: 'Fecha de actualización', value: 'updated_date' },
  ];

  const handleView = item => {
    /*history(`/clients/view/${item.id}`,{
            client: item,
        }
    )*/
  }
  const handleUpdate = item => {

    /*history(`/clients/update/${item.id}`,{
            client: item,
        }
    )*/
  }
  
  const handleReset = item => {


    /*history(`/clients/update/${item.id}`,{
            client: item,
        }
    )*/
  }

  const handleDeleteModal = item => {
  }

  const columnActions = [
  ];

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
                <p className='text-3xl font-bold' >Dashboard</p>
            </div>
            <div className='flex flex-col justify-between'>
              <div className='mt-5 p-5 flex flex-col items-center m-auto w-full rounded-2xl bg-white'>
                <p className='w-full font-sans text-xl text-black'>Clientes</p>
                <div className='mt-3'>
                  <Table title='Clientes' data={clients} isLoadingData={ isLoadingData } columns={ tableColumnsCustomer } actions={ columnActions }/>
                </div>
              </div>
              <div className='mt-5 p-5 flex flex-col items-center m-auto w-full rounded-2xl bg-white'>
                <p className='w-full font-sans text-xl text-black'>Proyectos</p>
                <div className='mt-3'>
                  <Table title='Clientes' data={projects} isLoadingData={ isLoadingData } columns={ tableColumnsProject } actions={ columnActions }/>
                </div>
              </div>
              <div className='mt-5 p-5 flex flex-col items-center m-auto w-full rounded-2xl bg-white'>
                <p className='w-full font-sans text-xl text-black'>Usuarios</p>
                <div className='mt-3'>
                  <Table title='Clientes' data={users} isLoadingData={ isLoadingData } columns={ tableColumnsCustomer } actions={ columnActions }/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
