import '../App.css'
import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { useNavigate } from 'react-router-dom';
import {createProject} from '../api/controller/ProjectsController'
import { getCustomers } from '../api/controller/CustomersController';
import PropTypes from 'prop-types';

function UpdateValidator({title, columns, data, isLoadingData, actions }) {
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
          setTimeout(() => {
            history('/projects/get')
          },1000);
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
        <div className='w-full'>
            <div className='mt-3 ml-5 flex justify-center'>
                <p className='text-3xl font-bold'>Actualizar Validador</p>
            </div>
                <div className='mt-5 p-5 flex flex-col items-center m-auto w-full rounded-2xl bg-white'>

                    <div className="w-full overflow-hidden">
                        <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
                    </div>

                    <div className='mt-5 w-full items-center flex flex-row'>

                        <div className='w-full flex flex-col justify-between'>
                            <p className='font-bold'>Nombre:</p>
                            <div className='mb-10 w-full flex flex-row justify-center'>
                                <input onChange={(event) => {setName(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="project_name" name="project_name"/><br/><br/>
                            </div>
                            
                            <p className='font-bold'>Descripción:</p>
                            <div className='mb-10 w-full flex flex-row justify-center'>
                                <input onChange={(event) => {setDescription(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Descripción' type="text" id="description" name="description"/><br/><br/>
                            </div>
                        </div>
                    </div>
                    <div className='w-1/2'>
                        <input onClick={buttonHandler} className=' text-white w-full py-2 px-4 rounded-full bg-zinc-400 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Crear"/><br/><br/>
                    </div>
                </div>
        </div>
    )
}

UpdateValidator.propTypes = {
    title: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.object),
    data: PropTypes.arrayOf(PropTypes.object),
    isLoadingData: PropTypes.bool,
    actions: PropTypes.array,
}

export default UpdateValidator
