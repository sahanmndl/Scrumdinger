import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View, RefreshControl, TouchableOpacity, Dimensions, ActivityIndicator, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";

const ProfileView = () => {
    
    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const [currentUser, setCurrentUser] = useState()
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchCurrentUser = async () => {
        try {
            await AsyncStorage.getItem('userId')
            .then(async (userId) => {
                await axios.get(`http://10.2.71.238:8000/api/user/${userId}`)
                .then((response) => setCurrentUser(response.data.user))
                .catch((e) => {
                    Alert.alert('', 'Error!')
                    console.log(e)
                })
            })
            .catch((e) => {
                Alert.alert('', 'Error!')
                console.log(e)
            })
        } catch (err) {
            console.log(err)
            Alert.alert('Error!', err.message)
        } finally {
            setRefresh(false)
        }
    }

    useEffect(() => {
        isFocused && fetchCurrentUser()
    }, [isFocused])

    const onRefresh = () => {
        setRefresh(true)
        fetchCurrentUser()
    }

    const logout = async () => {
        setLoading(true)
        const keys = ['user', 'userId']
        try {
            await AsyncStorage.multiRemove(keys)
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
        } finally {
            setLoading(false)
        }
    }

    const logoutAlert = () => {
        Alert.alert(
            "Confirmation", "Do you want to logout?",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log("Cancel"),
                    style: "cancel",
                },
                {
                    text: 'Yes',
                    onPress: () => logout()
                }
            ],
            {cancelable: true}
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.profileContainer}>
                    <Text style={{fontSize: 20, fontWeight: '500'}}>
                        {currentUser ? currentUser.name : 'loading...'}
                    </Text>
                    <Text style={{fontSize: 16, marginTop: 4}}>
                        Email: {currentUser ? currentUser.email : 'loading...'}
                    </Text>
                    <Text style={{fontSize: 16, marginTop: 4}}>
                        Total Projects: {currentUser ? currentUser.projects.length.toString() : 'loading...'}
                    </Text>
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.btnLogout}
                disabled={loading ? true : false}
                onPress={() => Platform.OS == 'web' ? logout() : logoutAlert()}
            >
                {loading ?
                    <ActivityIndicator color={'white'}/>
                    : <Text style={styles.btnText}>LOGOUT</Text>
                }
            </TouchableOpacity>
        </View>
    )
}

export default ProfileView

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    profileContainer: {
        height: 200,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        elevation: 4
    },
    btnLogout: {
        height: 45,
        width: WIDTH < 768 ? WIDTH - 20 : '100%',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'red',
        borderRadius: 4,
        flexDirection: 'row'
    },
    btnText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "500"
    },
})