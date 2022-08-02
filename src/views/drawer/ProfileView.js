import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View, RefreshControl, TouchableOpacity, Dimensions, ActivityIndicator, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../../constants/Colors";
import API_LINKS from "../../constants/API_LINKS";

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
                await axios.get(`${API_LINKS.USER_URL}/${userId}`)
                .then((response) => setCurrentUser(response.data.user))
                .catch((e) => {
                    Alert.alert('', 'Error!')
                })
            })
            .catch((e) => {
                Alert.alert('', 'Error!')
            })
        } catch (err) {
            Alert.alert('Error!', 'Cannot load profile details')
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
            Alert.alert('Error!', '')
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
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons name="account" size={24} color={Colors.DARK_GRAY} />
                        <Text style={{fontSize: 17, marginStart: 10}}>
                            {currentUser ? currentUser.name : 'loading...'}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                        <MaterialCommunityIcons name="email" size={24} color={Colors.DARK_GRAY} />
                        <Text style={{fontSize: 17, marginStart: 10}}>
                            {currentUser ? currentUser.email : 'loading...'}
                        </Text>
                    </View>
                </View>
                <View style={{height: 10}} />
                <View style={styles.profileContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons name="format-list-bulleted" size={24} color={Colors.DARK_GRAY} />
                        <Text style={{fontSize: 17, marginStart: 10}}>
                            {currentUser ? currentUser.projects.length.toString() + ' Projects' : 'loading...'}
                        </Text>
                    </View>
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
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 4,
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