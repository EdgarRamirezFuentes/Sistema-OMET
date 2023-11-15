import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { useNavigate } from 'react-router-dom';
import {createProject} from '../api/controller/ProjectsController'
import { getCustomers } from '../api/controller/CustomersController';
import PropTypes from 'prop-types';

function CreateProject({onCreated}) {
    const history = useNavigate();
    const session = JSON.parse(localStorage.getItem('session'))
    const user = session.user;

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [allClients, setAllClients] = useState([])
    const handleChange = (event) => {
      setSelectedUser(event.target.value);
      console.log("===selectedUser===");
      console.log(event.target.value);
    };

    useEffect(() => {
      getActiveCustomers();
    }, []);

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const buttonHandler = async () => {
      if(name === '' || description === '' || selectedUser === ''){
          setAlertType('Warning');
          setAlertMessage('Ingresa tus datos.')
          setError(true);
          return;
      }

      let data = {
        name: name,
        description: description,
        customer: selectedUser
      }

      await createProject(data, session.token).then(async (response) => {
        let res = await response.json();
        if (response.status === 201){
          setAlertType('Success');
          setAlertMessage('Proyecto creado correctamente.')
          setError(true);
          setTimeout((e) => onCreated && onCreated(true),1000);
          return;
        }
      })
    }

    const getActiveCustomers = async () => {
      await getCustomers(session.token).then(async(clients)=>{
         let clientsArray = await clients.json()
         setAllClients(clientsArray)
       })
    }
  
    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-screen'>
                <div className='w-full'>
                    <div className='mt-3 ml-5 flex justify-center'>
                        <p className='text-3xl font-bold'>Crear proyecto</p>
                    </div>
                    <div className='flex flex-col justify-between'>
                    <div className='mt-5 p-5 flex flex-col items-center m-auto w-1/2 rounded-2xl bg-white'>

                        <div className="w-full overflow-hidden">
                            <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
                        </div>

                        <div className='mt-5 w-full items-center flex flex-row'>

                        <div className='w-full flex flex-col items-center'>

                            <div className='w-full flex flex-col justify-between'>
                              <p className='font-bold'>Nombre:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input onChange={(event) => {setName(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="project_name" name="project_name"/><br/><br/>
                              </div>
                              
                              <p className='font-bold'>Descripción:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input onChange={(event) => {setDescription(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Descripción' type="text" id="description" name="description"/><br/><br/>
                              </div>

                              <p className='font-bold'>Customer:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <select className='border-gray-300 text-gray-800 placeholder:text-gray-300 focus:ring-v2-blue-text-login focus:border-v2-blue-text-login block w-full sm:text-sm rounded-md'
                                 value={selectedUser} onChange={handleChange}>
                                  <option value="">Selecciona un usuario</option>
                                  {allClients.map((option, i) => (
                                      <option key={i} value={option.id}>{option.name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                        </div>
                        </div>
                        <div className='w-1/4'>
                        <input onClick={buttonHandler} className=' text-white w-full py-2 px-4 rounded-full bg-zinc-400 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Crear"/><br/><br/>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

CreateProject.propTypes = {
  onCreated: PropTypes.func
}

export default CreateProject
