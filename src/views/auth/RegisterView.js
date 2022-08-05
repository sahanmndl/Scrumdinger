import React, { useState } from "react";
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from "react-native-paper";
import Colors from "../../constants/Colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import API_LINKS from "../../constants/API_LINKS";

const RegisterView = () => {

    const navigation = useNavigation()
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const register = async () => {
        if(email.trim() == "" || name.trim() == "" || password.trim() == "") {
            Alert.alert('Error!', 'Inputs cannot be empty')
        } else if (password.trim().length < 8) {
            Alert.alert('Error!', 'Password must be atleast 8 characters')
        } else {
            setLoading(true)
            try {
                const response = await axios.post(`${API_LINKS.USER_URL}/register`, {
                    name: name.trim(),
                    email: email.trim(),
                    password: password.trim()
                })
                const data = await response.data

                await AsyncStorage.setItem('user', JSON.stringify(data.user))
                await AsyncStorage.setItem('userId', data.user._id)

                navigation.reset({
                    index: 0,
                    routes: [{name: 'MainScreen'}]
                })
                return true
            } catch (err) {
                Alert.alert('Error!', err.response.data.message)
                return false
            } finally {
                setEmail("")
                setName("")
                setPassword("")
                setLoading(false)
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 28, fontWeight: '700'}}>
                    Create your account
                </Text>
            </View>
            <View style={{flex: 0.8, alignItems: 'center', justifyContent: 'center'}}>
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
                    label="Enter Your Name"
                    maxLength={100}
                    activeOutlineColor={Colors.BLUE}
                    left={<TextInput.Icon name='account' color={Colors.DARK_GRAY} />}
                    value={name}
                    onChangeText={name => setName(name)}
                />
                <View style={styles.innerMargin} />
                <TextInput
                    style={styles.textInput}
                    mode='outlined'
                    label="Set Password"
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
                    onPress={() => register()}
                >
                    {loading ?
                        <ActivityIndicator color={'white'}/>
                        : <Text style={styles.btnText}>Register</Text>
                    }
                </TouchableOpacity>
            </View>
            <View style={{flex: 0.1, flexDirection: 'row'}}>
                <Text style={{color: Colors.DARK_GRAY}}>Have an account already?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('LoginView')}>
                    <Text style={{marginStart: 4, color: Colors.BLUE, fontWeight: '500'}}>Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default RegisterView

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
        borderRadius: 4,
        elevation: 4
    },
    btnText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "500"
    }
})