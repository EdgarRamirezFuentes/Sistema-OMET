import { useState } from 'react'
import escom from '../assets/escom.png'
import axolote from '../assets/axolote.png'
import ipn from '../assets/ipn.png'

import '../App.css'
import { Link } from 'react-router-dom'


function Register() {
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  
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
            <form className='w-auto flex flex-col m-4 justify-center' action='http://localhost:8001/api/v1/user/'>

              <input onChange={(event) => {console.log(event.target.value);setName(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Nombre:'  type="text" id="name" name="name"/><br/><br/>
              <input onChange={(event) => {console.log(event.target.value);setLastName(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Apellidos:' type="text" id="last_name" name="last_name"/><br/><br/>
              <input onChange={(event) => {console.log(event.target.value);setPhone(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Número telefónico:' type="text" id="phone" name="phone"/><br/><br/>
              <input onChange={(event) => {console.log(event.target.value);setEmail(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Email:' type="email" id="email" name="email"/><br/><br/>
              <input onChange={(event) => {console.log(event.target.value);setPassword(event.target.value)}} className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border' placeholder='Contraseña:' type="password" id="password" name="password"/><br/><br/>
              <input onClick={(event)=>{event.preventDefault()}} className='my-5 text-white  py-2 px-4 rounded-full bg-cyan-700 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Registrarse"/><br/><br/>

            </form>
              <p className='text-sm pb-8'>¿Ya estas registrado? <Link className='text-cyan-700' to={'/'}>Inicia sesión</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
