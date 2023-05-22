import 'react-native-gesture-handler';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../consts/colors';
import {View} from 'react-native';
import HomeScreen from '../HomeScreen';
import Formulario from '../Formulario';
import Perfil from '../Perfil';
import VistaReportesUsuarios from '../VistaReportesUsuario';
import showReporte from '../ShowReporte'

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

function MyStackReportes(){
  return(
    <Stack.Navigator initialRouteName="VistaReportes">
      <Stack.Screen name='VistaReportes' component={VistaReportesUsuarios}  options={{headerShown:false,}} />
      <Stack.Screen name='Show' component={showReporte} options={{headerShown:false,}}/>
    </Stack.Navigator>
      
  )
}

const BottomNavigatorUsuario = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          height: 55,
          borderTopWidth: 0,
          elevation: 0,
        },
        showLabel: false,
        activeTintColor: COLORS.primary,
      }}>

      <Tab.Screen 
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="home-filled" color={color} size={28} />
          ),
          headerShown: false,
        }}
      />
      
      <Tab.Screen
        name="F.A.F"
        component={Formulario}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="article" color={color} size={28} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="person" color={color} size={28} />
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

export default BottomNavigatorUsuario;
