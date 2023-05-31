import escom from '../assets/escom.png'
import axolote from '../assets/axolote.png'
import ipn from '../assets/ipn.png'

import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import React, { useRef, useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { getClient, updateClient } from '../api/controller/ClientsController'
import { useParams } from 'react-router-dom';
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function See() {
    const params = useParams();
    const session = JSON.parse(localStorage.getItem('session'))
    const [user, setUser] = useState(null)

    const [image, setImage] = useState(axolote);
    const [name, setName] = useState('');
    const [first_last_name, setFirstLastName] = useState('');
    const [second_last_name, setSecondLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [rfc, setRfc] = useState('');
    
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const getClientData = async (userId)=>{
        await getClient(session.token, userId).then(async (client)=>{
            let cliente = await client.json();
            setUser(cliente);
            setName(cliente?.name);
            setFirstLastName(cliente?.first_last_name);
            setSecondLastName(cliente?.second_last_name);
            setEmail(cliente?.email);
            setRfc(cliente?.rfc);
            setPhone(cliente?.phone);
        })
    }

    useEffect(() => {
        if (user === null){
            getClientData(params.id);
        }
    },[user]);
    
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
            <div>
                <div className='mt-3 ml-5 flex flex-row items-center '>
                    <p className='text-3xl font-bold' >Perfil</p>
                </div>
                <div className='flex flex-col justify-between'>
                <div className='flex items-center justify-center h-full w-full rounded-full'>
                    <img
                    className="inline-block h-36 w-36 rounded-full"
                    src={image}
                    alt="Imagen"
                    />
                </div>
                <div className='mt-5 p-5 flex flex-col items-center m-auto w-1/2 rounded-2xl bg-white'>

                    <div className="w-full overflow-hidden">
                        <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
                    </div>

                    <div className='mt-5 w-full items-center  flex flex-row'>

                    <div className='w-1/2 flex flex-col'>

                        <div className='w-full p-10 flex flex-col'>
                        <p className='font-bold'>Nombre:</p>
                        <input disabled className='w-full my-2 text-black py-2 px-4 rounded-full bg-white ' placeholder='Nombre:' value={capitalizeFirstLetter(name)}  type="text" id="name" name="name"/><br/><br/>
                        <p className='font-bold'>Apellido paterno:</p>
                        <input disabled className='w-full my-2 text-black py-2 px-4 rounded-full bg-white ' placeholder='Apellido Paterno' value={capitalizeFirstLetter(first_last_name)} type="text" id="first_last_name" name="first_last_name"/><br/><br/>
                        <p className='font-bold'>Apellido Materno:</p>
                        <input disabled className='w-full my-2 text-black py-2 px-4 rounded-full bg-white ' placeholder='Apellido Materno' value={capitalizeFirstLetter(second_last_name)} type="text" id="second_last_name" name="second_last_name"/><br/><br/>
                        </div>

                    </div>

                    <div className='w-1/2 flex items-center flex-col'>
                        <div className='w-full p-10 flex flex-col'>

                        <div className='w-full flex flex-row'>
                            <p className='font-bold'>RFC:</p>
                        </div>
                        <input disabled className=' disabled:opacity-75 w-full my-2 text-black py-2 px-4 rounded-full bg-white ' placeholder='RFC' value={rfc} type="text" id="rfc" name="rfc"/><br/><br/>
                        <p className='font-bold'>Número telefónico:</p>
                        <input disabled className='disabled:opacity-75 w-full my-2 text-black py-2 px-4 rounded-full bg-white ' placeholder='Número telefónico:' value={phone} type="text" id="phone" name="phone"/><br/><br/>
                        <p className='font-bold'>Email:</p>
                        <input disabled className='disabled:opacity-75 w-full my-2 text-black py-2 px-4 rounded-full bg-white ' placeholder='Email:' type="email" value={email} id="email" name="email"/><br/><br/>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
    }

export default See
