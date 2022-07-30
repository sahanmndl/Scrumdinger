import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from "react-native-paper";
import Colors from "../../constants/Colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import mongoose from "mongoose";

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
                const response = await axios.post('http://10.2.71.238:8000/api/user/register', {
                    name: name.trim(),
                    email: email.trim(),
                    password: password.trim()
                })
                const data = await response.data
                console.log(data)
                console.log(JSON.stringify(data))
                /**const id = mongoose.Types.ObjectId(data.user._id)
                console.log(data.user._id, id, typeof(id))**/

                await AsyncStorage.setItem('userId', JSON.stringify(data))
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
                setName("")
                setPassword("")
                setLoading(false)
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 32, fontWeight: '600'}}>Sign Up</Text>
            <View style={styles.innerMargin} />
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label="Enter Email"
                keyboardType="email-address"
                left={<TextInput.Icon name='email' />}
                value={email}
                onChangeText={email => setEmail(email)}
            />
            <View style={styles.innerMargin} />
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label="Enter Your Name"
                maxLength={16}
                left={<TextInput.Icon name='account' />}
                value={name}
                onChangeText={name => setName(name)}
            />
            <View style={styles.innerMargin} />
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label="Set Password"
                secureTextEntry
                maxLength={16}
                left={<TextInput.Icon name='lock' />}
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
                    : <Text style={styles.btnText}>REGISTER</Text>
                }
            </TouchableOpacity>
            <View style={styles.innerMargin} />
            <TouchableOpacity
                style={styles.btn2}
                disabled={loading ? true : false}
                onPress={() => navigation.navigate('LoginView')}
            >
                <Text style={styles.btnText2}>Already have an account? Login!</Text>
            </TouchableOpacity>
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
        backgroundColor: Colors.DARK2,
        borderRadius: 4,
        flexDirection: 'row'
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
        color: Colors.BLUE
    }
})