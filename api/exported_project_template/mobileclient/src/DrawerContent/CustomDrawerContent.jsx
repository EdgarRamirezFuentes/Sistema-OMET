import React from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity} from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import { useDrawerStatus } from '@react-navigation/drawer';
import SessionManager from '../api/manager/SessionManager';
const sm = SessionManager.getInstance();
const CustomDrawerContent = ({ navigation }) => {
    
    const isFocused = useIsFocused();
    const isOpen = useDrawerStatus();
    React.useEffect(() => {
    }, [isFocused, isOpen]);
    
    return (
        <SafeAreaView className={'bg-sky-500 w-full h-full'}>
            {isOpen == 'open' ? <StatusBar barStyle="light-content"/> : <StatusBar barStyle="dark-content"/> }
            <TouchableOpacity className={'w-full ml-5 mt-10 h-10'}
                onPress={() => {navigation.navigate('Dashboard')}}>
                <View >
                    <Text className={'text-white font-bold text-xl'}>Home</Text>
                </View>
            </TouchableOpacity>

            

            <TouchableOpacity className={'w-full ml-5 mt-5 h-10'}
                onPress={async () => { await sm.logOut(); navigation.navigate('Login');}}>
                <View >
                    <Text className={'text-white font-bold text-xl'}>Logout</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default CustomDrawerContent;