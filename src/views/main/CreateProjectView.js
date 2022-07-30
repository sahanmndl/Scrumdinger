import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "../../constants/Colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import mongoose from "mongoose";

const CreateProjectView = () => {

    const navigation = useNavigation()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [loading, setLoading] = useState(false)

    const createProject = async () => {
        if(title.trim() == "" || description.trim() == "" || image.trim() == "") {
            Alert.alert('Error!', 'Inputs cannot be empty')
        } else {
            setLoading(true)
            try {
                const userId = await AsyncStorage.getItem('userId')
                const userId2 = JSON.parse(userId)

                const response = await axios.post('http://10.2.71.238:8000/api/project/create', {
                    title: title.trim(),
                    description: description.trim(),
                    image: image.trim(),
                    user: userId2.user._id
                })
                const data = await response.data
                navigation.goBack()
                return data
            } catch (err) {
                console.log(err)
                Alert.alert('Error!', err.message)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView
                keyboardDismissMode="on-drag"
            >
                <TextInput
                    style={styles.textInput}
                    mode='outlined'
                    label="Project Title"
                    maxLength={64}
                    value={title}
                    onChangeText={title => setTitle(title)}
                />
                <View style={styles.innerMargin} />
                <TextInput
                    style={styles.textInput}
                    mode='outlined'
                    label="Project Description"
                    maxLength={1024}
                    multiline={true}
                    numberOfLines={16}
                    value={description}
                    onChangeText={description => setDescription(description)}
                />
                <View style={styles.innerMargin} />
                <TextInput
                    style={styles.textInput}
                    mode='outlined'
                    label="Image"
                    value={image}
                    onChangeText={image => setImage(image)}
                />
                <View style={styles.innerMargin} />
                <TouchableOpacity
                    style={styles.buttonSubmit}
                    disabled={loading ? true : false}
                    onPress={() => createProject()}
                >
                {loading ?
                    <ActivityIndicator color={'white'}/>
                    : <Text style={styles.btnText}>ADD</Text>
                }
            </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default CreateProjectView

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        width: WIDTH < 768 ? WIDTH - 20 : '100%',
        borderRadius: 4,
        backgroundColor: 'white'
    },
    innerMargin: {
        height: 15
    },
    buttonSubmit: {
        height: 45,
        width: WIDTH < 768 ? WIDTH - 20 : '100%',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.BLUE,
        borderRadius: 4,
        flexDirection: 'row'
    },
    btnText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "500"
    },
})