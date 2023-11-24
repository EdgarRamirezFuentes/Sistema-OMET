import '../App.css'
import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { createValidator } from '../api/controller/ValidatorsController'
import PropTypes from 'prop-types';

function CreateValidator({validators, model_field_id, onCreated}) {

    const session = JSON.parse(localStorage.getItem('session'));

    const [description, setDescription] = useState('');
    const [selectedType, setSelectedType] = useState(null);
    const [validatorBoolean, setValidatorBoolean] = useState(false);
    const [validatorText, setValidatorText] = useState(false);
    const [validatorValue, setValidatorValue] = useState('');

    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [error, setError] = useState(null);

    const onCloseHandler = () => {
      setError(null)
      setAlertType('Error');
      setAlertMessage('')
  }

    const handleChange = (event) => {
      console.log(event.target.value)
      setSelectedType(event.target.value);
      validators.find((item) => {
        setValidatorValue('')
          if(item.id == event.target.value){
            if(item.name == "null" || item.name == "unique" || item.name == "db_index"){
              setValidatorBoolean(true)
              setValidatorText(false)
            }else{
              setValidatorText(true)
              setValidatorBoolean(false)
            }
          }
      })
  };
  const handleChangeValue = (event) => {
    setValidatorValue(event.target.value);
  }
  const createValidatorValue = async () => {


    let data = {
      validator: selectedType,
      model_field: model_field_id,
      value: validatorValue
    }

    await createValidator(data, session.token).then(async (response) => {
      let res = await response.json();
        if (response.status === 201){
          setAlertType('Success');
          setAlertMessage('Validador creado correctamente.')
          setError(true);
          setTimeout((e) => onCreated && onCreated(true),1000);
          return;
        }else{
          const keys = Object.keys(res);
          setAlertMessage(res[keys[0]][0])
          setAlertType('Error');
          setError(true);
        }
      })

  }

  
    return (
        <div className='w-full'>
            <div className='mt-3 ml-5 flex justify-center'>
                <p className='text-3xl font-bold'>Crear Validador</p>
            </div>
                <div className='mt-5 p-5 flex flex-col items-center m-auto w-full rounded-2xl bg-white'>

                  <div className="w-full overflow-hidden">
                    <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
                  </div>

                    <div className='mt-5 w-full items-center flex flex-row'>

                        <div className='w-full flex flex-col justify-between'>
                            <p className='font-bold'>Validador:</p>
                            <div className='mb-10 w-full flex flex-row justify-center'>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <select className='border-gray-300 text-gray-800 placeholder:text-gray-300 focus:ring-v2-blue-text-login focus:border-v2-blue-text-login block w-full sm:text-sm rounded-md'
                                    value={selectedType} onChange={handleChange}>
                                    <option value="">Selecciona un validador</option>
                                    {validators.map((option, i) => (
                                        <option key={i} value={option.id}>{option.name} - {option.description}</option>
                                    ))}
                                    </select>
                                </div>
                            </div>
                            
                            {validatorText || validatorBoolean ? <p className='font-bold'>Valor:</p>:null}
                            {validatorText ? <div className='mb-10 w-full flex flex-row justify-center'>
                                <input onChange={handleChangeValue} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Valor' type="text" id="description" name="description"/><br/><br/>
                            </div>: validatorBoolean ? 
                            <select className='border-gray-300 text-gray-800 placeholder:text-gray-300 focus:ring-v2-blue-text-login focus:border-v2-blue-text-login block w-full sm:text-sm rounded-md'
                            value={validatorValue} onChange={handleChangeValue}>
                              <option value="">Selecciona un validador</option>
                              <option value="True">Verdadero</option>
                              <option value="False">Falso</option>
                            </select> : null}
                        </div>
                    </div>
                    <div className='mt-10 w-1/2'>
                        <input onClick={createValidatorValue} className=' text-white w-full py-2 px-4 rounded-full bg-zinc-400 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Crear"/><br/><br/>
                    </div>
                </div>
        </div>
    )
}

CreateValidator.propTypes = {
  validators: PropTypes.arrayOf(PropTypes.object),
  model_field_id: PropTypes.any,
  onCreated: PropTypes.func,
}

export default CreateValidator
