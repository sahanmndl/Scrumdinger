import React, { useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileView = () => {
    
    const navigation = useNavigation()
    const [currentUser, setCurrentUser] = useState(null)

    const fetchCurrentUser = async () => {
        try {
            const user = await AsyncStorage.getItem('userId')
            setCurrentUser(user)
            console.log(user, typeof(user))
        } catch (err) {
            console.log(err)
            Alert.alert('Error!', err.message)
        }
    }

    useEffect(() => {
        fetchCurrentUser()
    }, [currentUser])

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userId')
            .then(async () => {
                navigation.reset({
                    index: 0,
                    routes: [{name: 'AuthScreen'}]
                })
                return true
            })
        } catch (err) {
            console.log(err)
            Alert.alert('Error!', err.message)
            return false
        }
    }

    return (
        <View>
            {currentUser ? <Text>Yes</Text> : <Text>No</Text>}
            <Button
                title="LogOut"
                onPress={logout}
            />
        </View>
    )
}

export default ProfileView