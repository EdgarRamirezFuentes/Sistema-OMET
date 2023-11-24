import '../App.css'
import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert/Alert'
import { useNavigate } from 'react-router-dom';
import { updateValidator } from '../api/controller/ValidatorsController';
import PropTypes from 'prop-types';
import Input from '../Components/tailwindUI/Input'

function UpdateValidator({model_field_id, validator, onUpdated}) {
    const history = useNavigate();
    const session = JSON.parse(localStorage.getItem('session'))
    const user = session.user;

    console.log("validator",validator)

    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [validatorBoolean, setValidatorBoolean] = useState(false);
    const [validatorText, setValidatorText] = useState(false);
    const [validatorValue, setValidatorValue] = useState('');

    useEffect(() => {
      validatorData();
    }, []);

    const validatorData = () => {
      if(validator.validator.name == "null" || validator.validator.name == "unique" || validator.validator.name == "db_index"){
        setValidatorBoolean(true)
        setValidatorText(false)
        setValidatorValue(validator.value)
      }else{
        setValidatorText(true)
        setValidatorBoolean(false)
        setValidatorValue(validator.value)
      }
    }

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const buttonHandler = async () => {
      if(validatorValue === ''){
          setAlertType('Warning');
          setAlertMessage('Ingresa tus datos.')
          setError(true);
          return;
      }

      let data = {
        value: validatorValue,
      }

      await updateValidator(validator.id, data, session.token).then(async (response) => {
        let res = await response.json();
        console.log("res",res)
        if (response.status === 200){
          setAlertType('Success');
          setAlertMessage('Validador actualizado correctamente.')
          setError(true);
          setTimeout((e) => onUpdated && onUpdated(true),1000);
          return;
        }
      })
    }
    const handleChangeValue = (event) => {
      setValidatorValue(event.target.value);
    }
  
    return (
        <div className='w-full'>
            <div className='mt-3 ml-5 flex justify-center'>
                <p className='text-3xl font-bold'>Actualizar Validador</p>
            </div>
            <div className='mt-5 p-5 flex flex-col items-center m-auto w-full rounded-2xl bg-white'>

              <div className="w-full overflow-hidden">
                <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
              </div>

                <div className='mt-5 w-full items-center flex flex-row'>

                    <div className='w-full flex flex-col justify-between'>
                        <Input label={"Nombre del validador"} disabledInput={true} value={validator.validator.name}/>
                        {validatorText || validatorBoolean ? <p className='font-bold mt-5'>Valor:</p>:null}
                        {validatorText ? <div className='mb-10 w-full flex flex-row justify-center'>
                            <input value={validatorValue} onChange={handleChangeValue} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Valor' type="text" id="description" name="description"/><br/><br/>
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
                    <input onClick={buttonHandler} className=' text-white w-full py-2 px-4 rounded-full bg-zinc-400 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Actualizar"/><br/><br/>
                </div>
            </div>
        </div>
    )
}

UpdateValidator.propTypes = {
  validators: PropTypes.arrayOf(PropTypes.object),
  model_field_id: PropTypes.any,
  validator: PropTypes.object,
  onUpdated: PropTypes.func
}

export default UpdateValidator
