import { Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect} from 'react';
import Alert from '../Components/Alert/Alert';
import Input from '../Components/Input/Input';
import axolote from '../assets/axolote.png';
import { loginUser } from '../api/controller/LoginController'
import SessionManager from '../api/manager/SessionManager';
const sm = SessionManager.getInstance();

function Login({navigation}){
    
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [alertType, setAlertType] = useState('Error');
  const [alertMessage, setAlertMessage] = useState('Ingresa tus datos.');

  const token = async ()=>{
    const token_ = await sm.getTokenSession()
    if (token_){
      navigation.navigate('Home')
    }
  }
  React.useEffect(() => {
    token();
  }, []);

  const buttonHandler = async () => {
    if (username == "" || password == "") {
      setError(true);
      setAlertType('Warning');
      setAlertMessage('Ingresa tus datos.');
      return;
    } 
      await loginUser(username, password).then(async (res) => {
        let response = await res.json()
        const keys = Object.keys(response);
        if(keys[0] != "expiry" && keys[0] != "token" && keys[0] != "user"){
          setError(true);
          setAlertMessage(response[keys[0]][0]);
          setAlertType('Error');
          return;
        }
        else if (response.token){
          setError(true);
          setAlertMessage('Bienvenido');
          setAlertType('Success');
          sm.setTokenSession(response.token)
          setTimeout(() => {
            navigation.navigate('Home')
          },2000)
        }
        //localStorage.setItem('session', JSON.stringify(response));
      });
    
  }
  const onCloseHandler = () => {
    setError(false)
    setAlertType('Error');
    setAlertMessage('Ingresa tus datos.')
  }

  return (
    <View className="w-screen h-screen">
    <View className='flex flex-row h-screen'>
      <View className='w-full'>
        <View className='w-full pt-14 flex flex-row justify-between items-center bg-sky-500'>
          <Text className='w-full text-lg text-center font-light pb-5 font-bold text-white'>Bienvenido a Sistema Gestor de Hospitales</Text>
        </View>
        <View className='flex flex-col items-center m-auto w-2/3'>
          <Image className='h-24 w-24 mb-10' source={axolote} alt="" />
          <View className="w-full flex flex-col overflow-hidden">
            <Alert type={alertType} show={error} title={alertMessage} onClose={onCloseHandler}/>
          </View>
          <Input placeholder={"Usuario"} onChangeText={setUsername} value={username}/>
          <Input placeholder={"Contraseña"} onChangeText={setPassword} value={password} secureTextEntry={true}/>
          <TouchableOpacity className='my-5 text-white py-3 px-5 rounded-full bg-cyan-700 mx-auto hover:bg-cyan-400 hover:cursor-pointer'
            onPress={buttonHandler}>
            <Text className={'text-white'} >Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
  );
}

export default Login;