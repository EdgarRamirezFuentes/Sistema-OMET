import axolote from '../assets/axolote.png'

import '../App.css'
import React, { useRef, useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { getClient, updateClient } from '../api/controller/ClientsController'
import PropTypes from 'prop-types';
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Update({userId, onUpdate}) {
    
    const session = JSON.parse(localStorage.getItem('session'))
    const [profileImage, setProfileImageBase64] = useState(null);
    const [user, setUser] = useState(null)

    const [image, setImage] = useState(axolote);
    const [name, setName] = useState('');
    const [first_last_name, setFirstLastName] = useState('');
    const [second_last_name, setSecondLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [rfc, setRfc] = useState('');


    const [rfcError, setRfcError] = useState(false);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');

    

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
        // `reader.result` contiene los datos del archivo como un ArrayBuffer
        const buffer = reader.result;
        const base64Image = arrayBufferToBase64(buffer);
        setImage("data:image/jpeg;charset=utf-8;base64,"+base64Image);
        setProfileImageBase64(base64Image)
        };

        if (file) {
        reader.readAsArrayBuffer(file);
        }
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
        }

        return window.btoa(binary);
    };

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const getClientData = async ()=>{
        await getClient(session.token, userId).then(async(client)=>{
            client = await client.json();
            setUser(client);
            setName(client?.name);
            setFirstLastName(client?.first_last_name);
            setSecondLastName(client?.second_last_name);
            setEmail(client?.email||'');
            setRfc(client?.rfc||'');
            setPhone(client?.phone||'');
        })
    }

    useEffect(() => {
        if (user === null){
            getClientData(userId);
        }
        if(rfc.length<12 || rfc.length > 13){
            setRfcError(true);
            return;
        }else{
            setRfcError(false);
        }
    },[user])

    const buttonHandler = async () => {
        if(name === '' || first_last_name === '' || second_last_name === '' || email === '' || phone === '' || rfc ===''){
        setAlertMessage('Los datos son inválidos.')
        setError(true);
        setAlertType('Warning');
        return;
        }

        if(rfc.length<12 || rfc.length > 13){
        setAlertMessage('El RFC debe tener de 12 a 13 caracteres.')
        setError(true);
        setAlertType('Warning');
        return;
        }
        let userData = {
            nombre: name,
            apellido_paterno: first_last_name,
            apellido_materno: second_last_name,
            email: email,
            telefono: phone,
            imagen: profileImage
        }

        await updateClient(userData, session.token, user.id).then(async (response)=>{
            let res = await response.json();
            console.log("====RESPONSE====");
            console.log(res);
            if(res.non_field_errors){
                setError(true);
                setAlertMessage(res.non_field_errors[0]);
                setAlertType('Error');
                return;
            }
            if(res.message){
                setError(true);
                setAlertMessage(res.message);
                setAlertType('Error');
                return;
            }

            setError(true);
            setAlertMessage('Datos actualizados con éxito.');
            setAlertType('Success');
            setTimeout(() => {onUpdate && onUpdate(true)}, 1000);
            /*localStorage.setItem('session', JSON.stringify(res));

            const session = JSON.parse(localStorage.getItem('session'))
            res.id = user.id;
            session.user = res;

            localStorage.setItem('session', JSON.stringify(session));*/
        });


    }
    
    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-screen'>
                <div className='w-full'>
                    <div className='mt-3 ml-5 flex flex-row items-center justify-center'>
                        <p className='text-3xl font-bold'>Actualizar Perfil</p>
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
                                    <input onChange={(event) => {setName(event.target.value)}} className='w-full my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre:' value={capitalizeFirstLetter(name)}  type="text" id="name" name="name"/><br/><br/>
                                    <p className='font-bold'>Apellido paterno:</p>
                                    <input onChange={(event) => {setFirstLastName(event.target.value)}} className='w-full my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Apellido Paterno' value={capitalizeFirstLetter(first_last_name)} type="text" id="first_last_name" name="first_last_name"/><br/><br/>
                                    <p className='font-bold'>Apellido Materno:</p>
                                    <input onChange={(event) => {setSecondLastName(event.target.value)}} className='w-full my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Apellido Materno' value={capitalizeFirstLetter(second_last_name)} type="text" id="second_last_name" name="second_last_name"/><br/><br/>
                                    </div>

                                </div>

                                <div className='w-1/2 flex items-center flex-col'>
                                    <div className='w-full p-10 flex flex-col'>
                                        <div className='w-full flex flex-row'>
                                        <p className='font-bold'>RFC:</p>
                                        {rfcError ? <div>
                                        <p className='ml-5 text-red-700 text-xs'>El RFC debe tener de 12 a 13 caracteres.</p>
                                        </div>:null}
                                    </div>
                                        <input onChange={(event) => {setRfc(event.target.value)}} className='w-full my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='RFC' value={rfc} type="text" id="rfc" name="rfc"/><br/><br/>
                                        <p className='font-bold'>Número telefónico:</p>
                                        <input onChange={(event) => {setPhone(event.target.value)}} className='w-full my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Número telefónico:' value={phone} type="text" id="phone" name="phone"/><br/><br/>
                                        <p className='font-bold'>Email:</p>
                                        <input onChange={(event) => {setEmail(event.target.value)}} className='w-full my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Email:' type="email" value={email} id="email" name="email"/><br/><br/>
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

Update.propTypes = {
    userId : PropTypes.number,
    onUpdate: PropTypes.func
}


export default Update
