import { useState } from 'react'
import escom from '../assets/escom.png'
import axolote from '../assets/axolote.png'
import ipn from '../assets/ipn.png'
import { loginUser } from '../api/controller/LoginController'

import '../App.css'
import { Link, useNavigate } from 'react-router-dom'



function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const buttonHandler = async (event) => {
    console.log("Button clicked");

    await login(username, password).then((response) => {
      console.log(response);
    });

  }

  const login = async (email, password)=>{

    console.log("Email");
    console.log(email);
    console.log("Password");
    console.log(password);

    await loginUser(email, password).then((response) => {
      console.log(response);
      navigate('/home')
    });
  
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
            <form style={{display:'none'}} className='w-auto flex flex-col m-4 justify-center'></form>
          
            <input onChange={(event) => {console.log(event.target.value);setUsername(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Usuario:'  type="text" id="username" name="username"/><br/><br/>
      
            <input onChange={(event) => {console.log(event.target.value);setPassword(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Contraseña:' type="password" id="password" name="password"/><br/><br/>
          
            <p className='text-xs m-2'>¿Olvidaste tu contraseña? <a className='text-cyan-700' href="#">Restaurar contraseña</a></p>
            <input onClick={buttonHandler} className='my-5 text-white  py-2 px-4 rounded-full bg-cyan-700 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Iniciar sesión"/><br/><br/>
        
            <p style={{display:'none'}} className='text-sm pb-8'>¿Aún no tienes cuenta? <Link className='text-cyan-700' to={'/register'}>Registrarse</Link></p>
          </div>
      
        </div>
      </div>
    </div>
  )
}

export default Login
