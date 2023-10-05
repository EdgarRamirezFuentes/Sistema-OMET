import escom from '../assets/escom.png'
import axolote from '../assets/axolote.png'
import ipn from '../assets/ipn.png'

import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import React, { useRef, useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { changePassword } from '../api/controller/ClientsController'
import PasswordInput from '../Components/tailwindUI/PasswordButton'
import { useNavigate } from 'react-router-dom';
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function ChangePassword() {
    const history = useNavigate();
    const session = JSON.parse(localStorage.getItem('session'))
    const user = session.user;

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const buttonHandler = async () => {

        console.log("Old password: " + oldPassword);
        console.log("New password: " + newPassword);
        console.log("Confirm password: " + confirmPassword);

        if(oldPassword === '' || newPassword === '' || confirmPassword === ''){
            setAlertType('Warning');
            setAlertMessage('Ingresa tus datos.')
            setError(true);
            return;
        }

        if (newPassword !== confirmPassword){
            setAlertType('Warning');
            setAlertMessage('Las contraseñas no coinciden.')
            setError(true);
            return;
        }

        let userData = {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }

        await changePassword(userData, session.token).then((response) => {
            console.log("Response");
            console.log(response);
            if(response.non_field_errors){
                setError(true);
                setAlertMessage(response.non_field_errors[0]);
                setAlertType('Error');
                return;
            }
            else if (response.message){
                setError(false);
                setAlertMessage('Contraseña actualizada.');
                setAlertType('Success');
                setTimeout(() => {
                    history('/profile')
                  }, 1000);
            }
            //localStorage.setItem('session', JSON.stringify(response));
        });

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
                    <div className='mt-3 ml-5 flex flex-row items-center '>
                        <p className='text-3xl font-bold' >Mi perfil</p>
                    </div>
                    <div className='flex flex-col justify-between'>
                    <div className='mt-5 p-5 flex flex-col items-center m-auto w-1/2 rounded-2xl bg-white'>

                        <div className="w-full overflow-hidden">
                            <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
                        </div>

                        <div className='mt-5 w-full items-center flex flex-row'>

                        <div className='w-full flex flex-col items-center'>

                            <div className='w-full flex flex-col justify-between'>
                            <p className='font-bold'>Antigua contraseña:</p>
                            <PasswordInput val={(value)=>{setOldPassword(value)}}/>
                            
                            <p className='font-bold'>Nueva contraseña:</p>
                            <PasswordInput val={(value)=>{setNewPassword(value);}}/>

                            <p className='font-bold'>Confirmar contraseña:</p>
                            <PasswordInput val={(value)=>{setConfirmPassword(value);}}/>
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

export default ChangePassword
