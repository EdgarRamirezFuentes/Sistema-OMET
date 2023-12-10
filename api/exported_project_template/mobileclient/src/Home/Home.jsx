import React from 'react';
import { Text, View } from 'react-native';
import SessionManager from '../api/manager/SessionManager';
import { StatusBar } from 'expo-status-bar';
const sm = SessionManager.getInstance();
function HomeScreen({ navigation }) {
  
      return (
        <View className={'flex w-full h-full'}>
          <StatusBar style="auto"/>
          <View className='w-full p-5 flex flex-row justify-between items-center bg-white'>
            <Text className={'pr-1 text-lg text-gray-500'}>Admin</Text>
            <Text className={'w-full text-xl text-black'}>/ Dashboard</Text>
          </View>
        </View>
      );
    }

export default HomeScreen;