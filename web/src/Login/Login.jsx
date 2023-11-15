import { useEffect, useState } from 'react'
import escom from '../assets/escom.png'
import axolote from '../assets/axolote.png'
import ipn from '../assets/ipn.png'
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/controller/LoginController'

import '../App.css'
import Alert from '../Components/Alert/Alert'



function Login() {
  const history = useNavigate();
  const session = JSON.parse(localStorage.getItem('session'))
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('Error');

  useEffect(() => {
    if (session){
      history('/home')
    }
  }, [])
  const buttonHandler = async () => {

    if(username === '' || password === ''){
      setAlertType('Warning');
      setAlertMessage('Ingresa tus datos.')
      setError(true);
      return;
    }

    await loginUser(username, password).then(async (res) => {
      let response = await res.json()
      if(response.non_field_errors){
        setError(true);
        setAlertMessage(response.non_field_errors[0]);
        setAlertType('Error');
        return;
      }
      else if (response.token){
        setError(false);
        setAlertMessage('Bienvenido');
        setAlertType('Success');
        setTimeout(() => {
          localStorage.setItem('session', JSON.stringify(response));
          window.location.href = '/home';
        },2000)
      }
      //localStorage.setItem('session', JSON.stringify(response));
    });

  }

  const onCloseHandler = () => {
    setError(null)
    setAlertType('Error');
    setAlertMessage('Ingresa tus datos.')
  }
  

  return (
    <div className="w-screen h-screen">
      <div className='flex flex-row h-screen'>
        <div className='w-full m-4 border-t-4 border-b-4 border-sky-500'>
          <div className='w-full p-4 flex flex-row justify-between items-center bg-sky-500'>
            <img className='w-20 h-full' src={escom} alt="" />
            <h1 className='w-full text-center font-sans text-md font-light pb-5 text-white'>Bienvenido al sistema OMET</h1>
            <img className='w-14 h-full' src={ipn} alt="" />
          </div>
          <img className='m-auto h-36 mt-6' src={axolote} alt="" />
          <div className='flex flex-col items-center m-auto w-2/3'>
            <div className="w-full overflow-hidden">
              <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
            </div>
          
            <input onChange={(event) => {setUsername(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Usuario:'  type="text" id="username" name="username"/><br/><br/>
      
            <input onChange={(event) => {setPassword(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Contraseña:' type="password" id="password" name="password"/><br/><br/>
          
            <input onClick={buttonHandler} className='my-5 text-white  py-2 px-4 rounded-full bg-cyan-700 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Iniciar sesión"/><br/><br/>
        
          </div>
      
        </div>
      </div>
    </div>
  )
}

export default Login
