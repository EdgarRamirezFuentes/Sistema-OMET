import escom from '../assets/escom.png'
import axolote from '../assets/axolote.png'
import ipn from '../assets/ipn.png'

import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import React, { useRef, useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { getClient, updateClient } from '../api/controller/ClientsController'
import { useNavigate } from 'react-router-dom';
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Profile() {
  const session = JSON.parse(localStorage.getItem('session'))
  const user = session.user;
  const fileInputRef = useRef(null);
  const [showText, setShowText] = useState(false);
  const [profileImage, setProfileImageBase64] = useState(null);
  const history = useNavigate();
  const [image, setImage] = useState(user?.profile_image || axolote);
  const [name, setName] = useState(user?.name);
  const [first_last_name, setFirstLastName] = useState(user?.first_last_name);
  const [second_last_name, setSecondLastName] = useState(user?.second_last_name);
  const [email, setEmail] = useState(user?.email|| '');
  const [phone, setPhone] = useState(user?.phone|| '');
  const [rfc, setRfc] = useState(user?.rfc|| '');


  const [rfcError, setRfcError] = useState(false);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('Error');

  const [userData, setUserData] = useState(null)

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

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleMouseEnter = () => {
    setShowText(true);
  };

  const handleMouseLeave = () => {
    setShowText(false);
  };

  const onCloseHandler = () => {
    setError(null)
    setAlertType('Error');
    setAlertMessage('')
  }

  const getClientData = async ()=>{
    await getClient(session.token, user.id).then((client)=>{
      setUserData(client);
    })
  }

  useEffect(() => {

    if (userData === null){
      getClientData();
    }else{
      console.log(userData.profile_image);
    }

    if(rfc.length<12 || rfc.length > 13){
      setRfcError(true);
      return;
    }else{
      setRfcError(false);
    }
  },[rfc])

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
      email: email,
      name: name,
      first_last_name: first_last_name,
      second_last_name: second_last_name,
      phone: phone,
      profile_image: profileImage,
    }

    await updateClient(userData, session.token, user.id).then(async (response)=>{
      let res = await response.json();
      console.log("=====res=====");
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
      if(res.id){
        setError(true);
        setAlertMessage('Datos actualizados con éxito.');
        setAlertType('Success');
        return;
      }
    });

  }
  
  return (
    <div className="w-full h-full bg-slate-100">
      <div className='flex flex-row h-full'>
      <SideBar/>
        <div className='w-full'>
          <div className='w-full p-5 flex flex-row justify-between items-center bg-white'>
            <p className='pr-1 font-sans text-lg text-gray-500'>Admin</p>
            <p className='w-full font-sans text-xl text-black'>/ Perfil</p>
            <div className='w-full mr-5'>
                <Timer/>
            </div>
          </div>
          <div>
            <div className='mt-3 mr-5 ml-5 flex flex-row items-center justify-between'>
              <p className='text-3xl font-bold'>Mi perfil</p>
              <button onClick={()=>{history('/clients/change-password')}} className="rounded-full text-white bg-zinc-400 hover:bg-cyan-400">Cambiar contraseña</button>
            </div>
            <div className='flex flex-col justify-between'>
              <div className='flex items-center justify-center h-full w-full rounded-full'>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <div
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img
                className="inline-block h-36 w-36 rounded-full"
                src={image}
                alt="Imagen"
                onClick={handleImageClick}
              />
                {showText && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: '#fff',
                      padding: '8px',
                      borderRadius: '4px',
                    }}
                  >
                    Seleccionar foto
                  </div>
                )}
              </div>
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
                      <input readOnly onChange={(event) => {setRfc(event.target.value)}} className='w-full my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='RFC' value={rfc} type="text" id="rfc" name="rfc"/><br/><br/>
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
    </div>
  )
}

export default Profile
