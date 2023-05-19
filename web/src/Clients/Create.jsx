import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Alert from '../Components/Alert/Alert'
import { createClient } from '../api/controller/ClientsController';
import PasswordInput from '../Components/tailwindUI/PasswordButton';
function Clients() {
  const history = useNavigate();
  const session = JSON.parse(localStorage.getItem('session'));
  const [password, setPassword] = useState('');
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
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [profileImage, setProfileImageBase64] = useState(null);


  useEffect(() => {
    if(rfc.length<12 || rfc.length > 13){
      setRfcError(true);
      return;
    }else{
      setRfcError(false);
    }
  },[rfc])

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      // `reader.result` contiene los datos del archivo como un ArrayBuffer
      const buffer = reader.result;
      const base64Image = arrayBufferToBase64(buffer);
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

  const buttonHandler = async () => {
    if(name === '' || first_last_name === '' || second_last_name === '' || email === '' || phone === '' || password === '' || rfc ===''){
      setAlertMessage('Ingresa todos los datos.')
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
      rfc: rfc,
      email: email,
      password: password,
      name: name,
      first_last_name: first_last_name,
      second_last_name: second_last_name,
      phone: phone,
      profile_image: profileImage,
      is_superuser: isSuperUser
    }

    await createClient(userData,session.token).then(async(res)=>{
      let json = await res.json()
      console.log("JSON");
      console.log(json);

      if (res.status === 201){
        setAlertMessage('Usuario registrado con éxito.')
        setError(true);
        setAlertType('Success');
        setTimeout(() => {
          history('/clients/get')
      }, 1000);
        return;
      }
      if (res.status === 400){
        setAlertMessage('Ocurrió un error.')
        setError(true);
        setAlertType('Error');
      }
    });
  }

  const onCloseHandler = () => {
    setError(null)
    setAlertType('Error');
    setAlertMessage('')
  }

  return (
    <div className="w-full h-full bg-slate-100">
      <div className='flex flex-row h-screen'>
      <SideBar/>
        <div className='w-full justify-center'>
          <div className='w-full p-5 flex flex-row justify-between items-center bg-white'>
            <p className='pr-1 font-sans text-lg text-gray-500'>Admin</p>
            <p className='w-full font-sans text-xl text-black'>/ Dashboard</p>
            <div className='w-full mr-5'>
                <Timer/>
            </div>
          </div>
          <div className='flex flex-col items-center'> 
            <div className='mt-3 ml-5 flex justify-center'>
                <p className='text-3xl font-bold'>Registrar usuario</p>
            </div>
            <div className='p-5 flex flex-col items-center m-auto w-2/3 rounded-2xl bg-white'>
                <div className="mt-5 w-full overflow-hidden">
                    <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
                </div>
                <div className='mt-5 w-full flex flex-row'>
                    <div className='w-1/2 flex flex-col'>
                      <div className='w-full flex flex-col'>
                        <p>Nombre*</p>
                        <input onChange={(event) => {setName(event.target.value)}} className='w-3/4 my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre:'  type="text" id="name" name="name"/><br/><br/>
                        <p>Apellido paterno*</p>
                        <input onChange={(event) => {setFirstLastName(event.target.value)}} className='w-3/4 my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Apellido Paterno' type="text" id="first_last_name" name="first_last_name"/><br/><br/>
                        <p>Apellido Materno*</p>
                        <input onChange={(event) => {setSecondLastName(event.target.value)}} className='w-3/4 my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Apellido Materno' type="text" id="second_last_name" name="second_last_name"/><br/><br/>
                        <div className='w-full flex flex-row'>
                          <p>RFC*</p>
                          {rfcError ? <div>
                            <p className='ml-5 text-red-700 text-xs'>El RFC debe tener de 12 a 13 caracteres.</p>
                          </div>:null}
                        </div>
                        
                        <input onChange={(event) => {setRfc(event.target.value)}} className='w-3/4 my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='RFC' type="text" id="rfc" name="rfc"/><br/><br/>
                        
                      </div>
                    </div>
                    <div className='w-1/2 flex flex-col'>
                      <div className='w-full flex flex-col'>
                        <p>Número telefónico*</p>
                        <input onChange={(event) => {setPhone(event.target.value)}} className='w-3/4 my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Número telefónico:' type="text" id="phone" name="phone"/><br/><br/>
                        <p>Email*</p>
                        <input onChange={(event) => {setEmail(event.target.value)}} className='w-3/4 my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Email:' type="email" id="email" name="email"/><br/><br/>
                        <p>Contraseña*</p>
                        <PasswordInput val={(value)=>{setPassword(value)}}/><br/><br/>
                      </div>

                      <div className='w-1/2 flex flex-row justify-between'>
                        <p>Administrador</p>
                          <input
                            className='text-black '
                            type="checkbox"
                            id="topping"
                            name="topping"
                            value="Paneer"
                            checked={isSuperUser}
                            onChange={() => {setIsSuperUser(!isSuperUser);}}
                          />
                      </div>
                      <div className='mt-5'>
                        <p>Foto</p>
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                      </div>
                    </div>
                </div>
                <div className='w-full flex flex-col'>
                  <p>* Campos requeridos</p>
                  <input onClick={buttonHandler} className='my-5 text-white w-64 py-2 px-4 rounded-full bg-zinc-400 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Registrar"/><br/><br/>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Clients
