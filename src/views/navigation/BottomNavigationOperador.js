import 'react-native-gesture-handler';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../consts/colors';
import { createStackNavigator } from '@react-navigation/stack';

//import clases
import HomeOperador from '../HomeOperador'
import VistaReportes from '../VistaReportes';
import ShowReporte from '../ShowReporte'
import VistaUsuarios from '../VistaUsuarios'
import NewUserList from '../NewUserList'
import OperShowUser from '../operador/OperShowUser'
import OperAuthorizeUser from '../operador/OperAuthorizeUser';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

function MyStackReportes(){
  return(
    <Stack.Navigator initialRouteName="VistaReportes">
      <Stack.Screen name='VistaReportes' component={VistaReportes}  options={{headerShown:false,}} />
      <Stack.Screen name='Show' component={ShowReporte } options={{headerShown:false,}}/>
    </Stack.Navigator>
      
  )
}
//
function MyStackUsuarios(){
  return(
    <Stack.Navigator initialRouteName="VistaReportes">
      <Stack.Screen name='VistaUsuarios' component={VistaUsuarios}  options={{headerShown:false,}} />
      <Stack.Screen name='NewUserList' component={NewUserList} options={{headerShown:false,}}/>
      <Stack.Screen name='ShowUser' component={OperShowUser} options={{headerShown:false,}}/>
      <Stack.Screen name='ShowAuthorizeUser' component={OperAuthorizeUser} options={{headerShown:false,}}/>
    </Stack.Navigator>
      
  )
}

const BottomNavigatorOperador = () => {
  return (
     <Tab.Navigator
      tabBarOptions={{
        style: {
          height: 55,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: COLORS.red, // Color de fondo rojo
        },
        showLabel: true,
        activeTintColor: COLORS.blue, // Color de texto activo azul
        activeBackgroundColor: COLORS.red, // Color de fondo activo rojo
        inactiveBackgroundColor: COLORS.blue, // Color de fondo inactivo azul
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
        },
        labelStyle: {
          marginBottom: 5,
        },
      }}
    >
      <Tab.Screen 
        name="Inicio"
        component={HomeOperador}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="home-filled" color={color} size={28} />
          ),
          headerShown: false,
        }}
      />

       <Tab.Screen 
        name="Usuarios"
        component={MyStackUsuarios}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="people" color={color} size={28} />
          ),
          headerShown: false,
        }}
      />


      <Tab.Screen
        name="Reportes"
        component={MyStackReportes}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="chat" color={color} size={28} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigatorOperador;