import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { useNavigate } from 'react-router-dom';
import { createCustomer } from '../api/controller/CustomersController';

function CreateCustomer() {
    const history = useNavigate();
    const session = JSON.parse(localStorage.getItem('session'))
    const user = session.user;

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [rfc, setRfc] = useState('');
    const [email, setEmail] = useState('');

    const [selectedUser, setSelectedUser] = useState('');
    const [allClients, setAllClients] = useState([])
    const [rfcError, setRfcError] = useState(false);

    useEffect(() => {
      if(rfc.length<12 || rfc.length > 13){
        setRfcError(true);
        return;
      }else{
        setRfcError(false);
      }
    },[rfc])

    const handleChange = (event) => {
      setSelectedUser(event.target.value);
      console.log("===selectedUser===");
      console.log(event.target.value);
    };

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const buttonHandler = async () => {
      if (name === '' || phone === '' || rfc === '' || email === ''){
          setAlertType('Warning');
          setAlertMessage('Ingresa los datos del customer.')
          setError(true);
          return;
      }

      let customerData = {
        name: name,
        phone: phone,
        rfc: rfc,
        email: email
      }

      await createCustomer(customerData, session.token).then(async (response) => {
        console.log("Response");
        console.log(response);
        let res = await response.json();
        console.log("Response");
        console.log(res);
        if (response.status === 201){
          setAlertType('Success');
          setAlertMessage('Customer creado correctamente.')
          setTimeout(() => {
            history('/customers/get');
          }, 1000);
          setError(true);
          return;
        }else{
          setAlertType('Error');
          setAlertMessage('Error al crear el customer.')
          setError(true);
          return;
        }
      })
    }
  
    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-screen'>
                <SideBar/>
                <div className='w-full'>
                    <div className='w-full p-5 flex flex-row justify-between items-center bg-white'>
                        <p className='pr-1 font-sans text-lg text-gray-500'>Admin</p>
                        <p className='w-full font-sans text-xl text-black'>/ Profile</p>
                        <div className='w-full mr-5'>
                            <Timer/>
                        </div>
                    </div>
                    <div className='mt-3 ml-5 flex justify-center'>
                        <p className='text-3xl font-bold'>Crear customer</p>
                    </div>
                    <div className='flex flex-col justify-between'>
                    <div className='mt-5 p-5 flex flex-col items-center m-auto w-1/2 rounded-2xl bg-white'>

                        <div className="w-full overflow-hidden">
                            <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
                        </div>

                        <div className='mt-5 w-full items-center flex flex-row  justify-center items-center'>

                        <div className='w-3/4 flex flex-col items-center'>

                            <div className='w-full flex flex-col justify-between'>
                              <p className='font-bold'>Nombre:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input onChange={(event) => {setName(event.target.value)}} className='w-3/4 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="name" name="name"/><br/><br/>
                              </div>
                              
                              <div className='w-full flex flex-row'>
                                <p>RFC*</p>
                                {rfcError ? <div>
                                  <p className='ml-5 text-red-700 text-xs'>El RFC debe tener de 12 a 13 caracteres.</p>
                                </div>:null}
                              </div>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input onChange={(event) => {setRfc(event.target.value)}} className='w-3/4 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='RFC' type="text" id="rfc" name="rfc"/><br/><br/>
                              </div>

                              <p className='font-bold'>Número telefónico:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input onChange={(event) => {setPhone(event.target.value)}} className='w-3/4 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Número telefónico:' type="text" id="phone" name="phone"/><br/><br/>
                              </div>
                              <p className='font-bold'>Email:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input onChange={(event) => {setEmail(event.target.value)}} className='w-3/4 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Email' type="text" id="email" name="email"/><br/><br/>
                              </div>
                          </div>

                        </div>
                        </div>
                        <div className='w-1/4'>
                        <input onClick={buttonHandler} className=' text-white w-full py-2 px-4 rounded-full bg-zinc-400 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Actualizar"/><br/><br/>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateCustomer
