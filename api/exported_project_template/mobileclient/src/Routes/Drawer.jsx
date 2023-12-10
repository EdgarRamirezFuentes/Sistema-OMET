import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../DrawerContent/CustomDrawerContent';
const Drawer = createDrawerNavigator();
import HomeScreen from '../Home/Home';


const Draw = () => {

    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props}/>}>
            <Drawer.Screen name="Dashboard" component={HomeScreen} options={{headerTitle: ''}}/>


            
        </Drawer.Navigator>
    );
}


export default Draw;