import "react-native-gesture-handler";
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, Alert, useWindowDimensions, Image } from 'react-native';
import LoginView from './src/views/auth/LoginView';
import RegisterView from './src/views/auth/RegisterView';
import InProgressView from './src/views/drawer/InProgressView';
import ToDoView from './src/views/drawer/ToDoView';
import BacklogView from './src/views/drawer/BacklogView';
import ReviewView from './src/views/drawer/ReviewView';
import ProfileView from "./src/views/drawer/ProfileView";
import CreateProjectView from "./src/views/main/CreateProjectView";
import ProjectDetailsView from "./src/views/main/ProjectDetailsView";
import UpdateProjectView from "./src/views/main/UpdateProjectView";
import AssignProjectView from "./src/views/main/AssignProjectView";
import SplashView from "./src/views/auth/SplashView";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

function HeaderLogo() {
  return (
    <Image
      style={{height: 30, width: 30}}
      source={require('./assets/icon_1.png')}
    />
  )
}

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="SplashView">
      <Stack.Screen
        name="SplashView"
        component={SplashView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegisterView"
        component={RegisterView}
        options={{headerTitle: (props) => <HeaderLogo {...props} />, headerTitleAlign: 'center'}}
      />
      <Stack.Screen
        name="LoginView"
        component={LoginView}
        options={{headerTitle: (props) => <HeaderLogo {...props} />, headerTitleAlign: 'center'}}
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
    <Stack.Navigator initialRouteName="DrawerNav">
      <Stack.Screen
        name="DrawerNav"
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateProjectView"
        component={CreateProjectView}
        options={{title: 'New Project'}}
      />
      <Stack.Screen
        name="UpdateProjectView"
        component={UpdateProjectView}
        options={{title: "Update Project"}}
      />
      <Stack.Screen
        name="ProjectDetailsView"
        component={ProjectDetailsView}
        options={{title: ""}}
      />
      <Stack.Screen
        name="AssignProjectView"
        component={AssignProjectView}
        options={{title: "Assign Project"}}
      />
      <Stack.Screen
        name="AuthScreen"
        component={AuthNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

function DrawerNavigator() {

  const dimensions = useWindowDimensions()

  return (
    <Drawer.Navigator
      initialRouteName="ToDoView"
      screenOptions={{
        drawerType: dimensions.width >= 768 ? 'permanent' : 'slide',
      }}
    >
      <Drawer.Screen
        name="ToDoView"
        component={ToDoView}
        options={{
          title: "To Do",
          drawerIcon: ({focused, size}) => (
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={size}
                color={focused ? '#007AFF' : '#ababab'}
              />
          ),
          drawerLabelStyle: {textTransform: 'uppercase'},
        }}
      />
      <Drawer.Screen
        name="InProgressView"
        component={InProgressView}
        options={{
          title: "In Progress",
          drawerIcon: ({focused, size}) => (
              <MaterialCommunityIcons
                name="progress-clock"
                size={size}
                color={focused ? '#007AFF' : '#ababab'}
              />
          ),
          drawerLabelStyle: {textTransform: 'uppercase'}
        }}
      />
      <Drawer.Screen
        name="BacklogView"
        component={BacklogView}
        options={{
          title: "Backlogs",
          drawerIcon: ({focused, size}) => (
              <MaterialCommunityIcons
                name="backup-restore"
                size={size}
                color={focused ? '#007AFF' : '#ababab'}
              />
          ),
          drawerLabelStyle: {textTransform: 'uppercase'}
        }}
      />
      <Drawer.Screen
        name="ReviewView"
        component={ReviewView}
        options={{
          title: "Review",
          drawerIcon: ({focused, size}) => (
              <Fontisto
                name="preview"
                size={size}
                color={focused ? '#007AFF' : '#ababab'}
              />
          ),
          drawerLabelStyle: {textTransform: 'uppercase'}
        }}
      />
      <Drawer.Screen
        name="ProfileView"
        component={ProfileView}
        options={{
          title: "My Profile",
          drawerIcon: ({focused, size}) => (
              <MaterialCommunityIcons
                name="account"
                size={size}
                color={focused ? '#007AFF' : '#ababab'}
              />
          ),
          drawerLabelStyle: {textTransform: 'uppercase'}
        }}
      />
    </Drawer.Navigator>
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