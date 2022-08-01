import React, { useState } from "react";
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from "react-native-paper";
import Colors from "../../constants/Colors";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const LoginView = () => {

    const navigation = useNavigation()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const login = async () => {
        if(email.trim() == "" || password.trim() == "") {
            Alert.alert('Error!', 'Inputs cannot be empty')
        } else if (password.trim().length < 8) {
            Alert.alert('Error!', 'Password must be atleast 8 characters')
        } else {
            setLoading(true)
            try {
                const response = await axios.post('http://10.2.71.238:8000/api/user/login', {
                    email: email.trim(),
                    password: password.trim()
                })
                const data = await response.data
                console.log(data)

                await AsyncStorage.setItem('user', JSON.stringify(data.user))
                await AsyncStorage.setItem('userId', data.user._id)

                navigation.reset({
                    index: 0,
                    routes: [{name: 'MainScreen'}]
                })
                return true
            } catch (err) {
                console.log(err)
                Alert.alert('Error!', err.message)
                return false
            } finally {
                setEmail("")
                setPassword("")
                setLoading(false)
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 32, fontWeight: '600'}}>Sign In</Text>
            <View style={styles.innerMargin} />
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label="Enter Email"
                keyboardType="email-address"
                activeOutlineColor={Colors.BLUE}
                left={<TextInput.Icon name='email' color={Colors.DARK_GRAY} />}
                value={email}
                onChangeText={email => setEmail(email)}
            />
            <View style={styles.innerMargin} />
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label="Password"
                secureTextEntry
                maxLength={24}
                activeOutlineColor={Colors.BLUE}
                left={<TextInput.Icon name='lock' color={Colors.DARK_GRAY} />}
                value={password}
                onChangeText={password => setPassword(password)}
            />
            <View style={styles.innerMargin} />
            <TouchableOpacity
                style={styles.buttonSubmit}
                disabled={loading ? true : false}
                onPress={() => login()}
            >
                {loading ? 
                    <ActivityIndicator color={'white'} />
                    : <Text style={styles.btnText}>LOGIN</Text>
                }
            </TouchableOpacity>
            <View style={styles.innerMargin} />
            <TouchableOpacity
                style={styles.btn2}
                disabled={loading ? true : false}
                onPress={() => navigation.navigate("RegisterView")}
            >
                <Text style={styles.btnText2}>Create a new Account!</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginView

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: 'white'
    },
    textInput: {
        width: WIDTH < 768 ? WIDTH - 40 : '30%',
        borderRadius: 4,
        backgroundColor: 'white'
    },
    innerMargin: {
        height: 15
    },
    buttonSubmit: {
        height: 45,
        width: WIDTH < 768 ? WIDTH - 40 : '30%',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.BLUE,
        borderRadius: 4
    },
    btnText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "500"
    },
    btn2: {
        height: 30,
        width: WIDTH < 768 ? WIDTH - 40 : '30%',
        alignItems: "center",
        justifyContent: "center"
    },
    btnText2: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.DARK_GRAY
    }
})