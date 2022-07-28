import "react-native-gesture-handler";
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, StatusBar, Alert } from 'react-native';
import LoginView from './src/views/auth/LoginView';
import RegisterView from './src/views/auth/RegisterView';
import HomeView from './src/views/main/HomeView';
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator()

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="RegisterView">
      <Stack.Screen
        name="RegisterView"
        component={RegisterView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginView"
        component={LoginView}
        options={{title: ""}}
      />
      <Stack.Screen
        name="MainScreen"
        component={MainNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="HomeView">
      <Stack.Screen
        name="HomeView"
        component={HomeView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AuthScreen"
        component={AuthNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

export default function App() {

  const [currentUser, setCurrentUser] = useState(null)

  const fetchCurrentUser = async () => {
    try {
      const user = await AsyncStorage.getItem('userId')
      setCurrentUser(user)
    } catch (err) {
      console.log(err)
      Alert.alert('Error!', err.message)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [currentUser])

  return (
    <NavigationContainer>
      <StatusBar barStyle={'dark-content'} backgroundColor='white' />
      {currentUser ? 
        <MainNavigator />
        : <AuthNavigator />
      }
    </NavigationContainer>
  );
}