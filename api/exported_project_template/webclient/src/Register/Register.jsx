import { useState } from 'react'
import escom from '../assets/escom.png'
import axolote from '../assets/axolote.png'
import ipn from '../assets/ipn.png'

import '../App.css'

function Register() {
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const buttonHandler = async () => {
      
      if(name === '' || last_name === '' || email === '' || phone === '' || password === ''){
        alert('Llena todos los campos');
        return;
      }
  
      // await loginUser(username, password).then((response) => {
      //   localStorage.setItem('session', JSON.stringify(response));
      // });
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
          <div className="w-full overflow-hidden">
              <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
          </div>
          <div className='flex flex-col items-center m-auto w-2/3'>
            <input onChange={(event) => {setName(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Nombre:'  type="text" id="name" name="name"/><br/><br/>
            <input onChange={(event) => {setLastName(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Apellidos:' type="text" id="last_name" name="last_name"/><br/><br/>
            <input onChange={(event) => {setPhone(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Número telefónico:' type="text" id="phone" name="phone"/><br/><br/>
            <input onChange={(event) => {setEmail(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Email:' type="email" id="email" name="email"/><br/><br/>
            <input onChange={(event) => {setPassword(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Contraseña:' type="password" id="password" name="password"/><br/><br/>
            <input onClick={(event)=>{event.preventDefault()}} className='my-5 text-white  py-2 px-4 rounded-full bg-cyan-700 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Registrar"/><br/><br/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
