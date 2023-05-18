import 'react-native-gesture-handler';
import React from 'react';

import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler'

import BottomNavigatorOperador from './src/views/navigation/BottomNavigationOperador';
//import BottomNavigatorUsuario from './src/views/navigation/BottomNavigatorUsuario';
const Stack = createStackNavigator();

import Login from './src/views/Login';



const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="black" />
      <Stack.Navigator screenOptions={{ headerShown: Login }}>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={BottomNavigatorOperador} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
