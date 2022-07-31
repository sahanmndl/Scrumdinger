import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, Platform } from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "../../constants/Colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const CreateProjectView = () => {

    const navigation = useNavigation()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [category, setCategory] = useState("")
    const [priority, setPriority] = useState(0)
    const [loading, setLoading] = useState(false)

    const createProject = async () => {
        if(title.trim() == "" || description.trim() == "") {
            Alert.alert('Error!', 'Inputs cannot be empty')
        } else if(priority == 0) {
            Alert.alert('Error!', 'Please set a priority level')
        } else if(category == "category") {
            Alert.alert('Error!', 'Please set a category')
        } else {
            setLoading(true)
            try {
                const userId = await AsyncStorage.getItem('userId')
                const response = await axios.post('http://10.2.71.238:8000/api/project/create', {
                    title: title.trim(),
                    description: description.trim(),
                    image: image.trim(),
                    category: category,
                    priority: priority,
                    user: userId
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
                showsVerticalScrollIndicator={Platform.OS === 'web' ? true : false}
            >
                <TextInput
                    style={styles.textInput}
                    mode='flat'
                    label="Enter Image link"
                    value={image}
                    onChangeText={image => setImage(image)}
                />
                <View style={styles.innerMargin} />
                <TextInput
                    style={styles.textInput}
                    mode='flat'
                    label="Project Title"
                    maxLength={1024}
                    value={title}
                    onChangeText={title => setTitle(title)}
                />
                <View style={styles.innerMargin} />
                <TextInput
                    style={styles.textInput}
                    mode='flat'
                    label="Project Description"
                    maxLength={1024}
                    multiline={true}
                    
                    value={description}
                    onChangeText={description => setDescription(description)}
                />
                <View style={styles.innerMargin} />
                <Picker
                    style={styles.picker}
                    mode="dropdown"
                    selectedValue={category}
                    onValueChange={(val, index) => setCategory(val)}
                >
                    <Picker.Item label="Set Category" value="category"/>
                    <Picker.Item label="To Do" value="todo"/>
                    <Picker.Item label="In Progress" value="progress"/>
                    <Picker.Item label="Backlogs" value="backlogs"/>
                    <Picker.Item label="Review" value="review"/>
                </Picker>
                <View style={styles.innerMargin} />
                <Picker
                    style={styles.picker}
                    mode="dropdown"
                    selectedValue={priority}
                    onValueChange={(val, index) => setPriority(val)}
                >
                    <Picker.Item label="Set Priority Level" value={0} />
                    <Picker.Item label="Low" value={1}/>
                    <Picker.Item label="Medium" value={2}/>
                    <Picker.Item label="High" value={3}/>
                </Picker>
            </ScrollView>
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
        width: WIDTH < 768 ? WIDTH - 20 : '50%',
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
    pickerContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    picker: {
        width: WIDTH - 20,
        borderWidth: 1,
        backgroundColor: 'rgba(52, 52, 52, 0.0)',
    },
})