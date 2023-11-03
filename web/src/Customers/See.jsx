import '../App.css'
import Timer from '../Components/Timer/Timer'
import SideBar from '../Components/Sidebar/Sidebar'
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCustomer } from '../api/controller/CustomersController'
import PropTypes from 'prop-types';
function SeeCustomer({customerId}) {
    const params = useParams();
    const session = JSON.parse(localStorage.getItem('session'))
    const user = session.user;
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [rfc, setRfc] = useState('');
    const [email, setEmail] = useState('');

    const [rfcError, setRfcError] = useState(false);
    const [customer, setCustomer] = useState(null);

    const getClientData = async (userId)=>{
        await getCustomer(session.token, userId).then(async(client)=>{
            client = await client.json();
            setCustomer(client);
            setName(client?.name);
            setEmail(client?.email||'');
            setRfc(client?.rfc||'');
            setPhone(client?.phone||'');
        })
    }

    useEffect(() => {
      if(rfc.length<12 || rfc.length > 13){
        setRfcError(true);
        return;
      }else{
        setRfcError(false);
      }
    },[rfc])

    useEffect(() => {
        if (customer === null){
            console.log(params); 
            getClientData(customerId);
        }
        if(rfc.length<12 || rfc.length > 13){
            setRfcError(true);
            return;
        }else{
            setRfcError(false);
        }
    },[user]);
  
    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-screen'>
                <div className='w-full'>
                    <div className='mt-3 ml-5 flex justify-center'>
                        <p className='text-3xl font-bold'>Información del cliente</p>
                    </div>
                    <div className='flex flex-col justify-between'>
                    <div className='mt-5 p-5 flex flex-col items-center m-auto w-1/2 rounded-2xl bg-white'>

                        <div className='mt-5 w-full items-center flex flex-row  justify-center items-center'>

                        <div className='w-3/4 flex flex-col items-center'>

                            <div className='w-full flex flex-col justify-between'>
                              <p className='font-bold'>Nombre:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input disabled onChange={(event) => {setName(event.target.value)}} className='w-3/4 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="name" name="name" value={name}/><br/><br/>
                              </div>
                              
                              <div className='w-full flex flex-row'>
                                <p className='font-bold'>RFC*</p>
                                {rfcError ? <div>
                                  <p className='ml-5 text-red-700 text-xs'>El RFC debe tener de 12 a 13 caracteres.</p>
                                </div>:null}
                              </div>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input disabled onChange={(event) => {setRfc(event.target.value)}} className='w-3/4 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='RFC' type="text" id="rfc" name="rfc" value={rfc}/><br/><br/>
                              </div>

                              <p className='font-bold'>Número telefónico:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input disabled onChange={(event) => {setPhone(event.target.value)}} className='w-3/4 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Número telefónico:' type="text" id="phone" name="phone" value={phone}/><br/><br/>
                              </div>
                              <p className='font-bold'>Email:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input disabled onChange={(event) => {setEmail(event.target.value)}} className='w-3/4 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Email' type="text" id="email" name="email" value={email}/><br/><br/>
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

SeeCustomer.propTypes = {
  customerId : PropTypes.number
}

export default SeeCustomer
