import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, Platform } from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "../../constants/Colors";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const UpdateProjectView = ({ route }) => {

    const {_id, title, description, image, category, priority} = route.params

    const navigation = useNavigation()
    const [titleUpdate, setTitleUpdate] = useState(title)
    const [descriptionUpdate, setDescriptionUpdate] = useState(description)
    const [imageUpdate, setImageUpdate] = useState(image)
    const [categoryUpdate, setCategoryUpdate] = useState(category)
    const [priorityUpdate, setPriorityUpdate] = useState(priority)
    const [loading, setLoading] = useState(false)

    const updateProject = async () => {
        if(titleUpdate.trim() == "" || descriptionUpdate.trim() == "") {
            Alert.alert('Error!', 'Inputs cannot be empty')
        } else if(priorityUpdate == 0) {
            Alert.alert('Error!', 'Please set a priority level')
        } else if (categoryUpdate == "category") {
            Alert.alert('Error!', 'Please set a category')
        } else {
            setLoading(true)
            try {
                const response = await axios.put(`http://10.2.71.238:8000/api/project/update/${_id}`, {
                    title: titleUpdate.trim(),
                    description: descriptionUpdate.trim(),
                    image: imageUpdate.trim(),
                    category: categoryUpdate,
                    priority: priorityUpdate
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
                    value={imageUpdate}
                    onChangeText={image => setImageUpdate(image)}
                />
                <View style={styles.innerMargin} />
                <TextInput
                    style={styles.textInput}
                    mode='flat'
                    label="Project Title"
                    maxLength={64}
                    value={titleUpdate}
                    onChangeText={title => setTitleUpdate(title)}
                />
                <View style={styles.innerMargin} />
                <TextInput
                    style={styles.textInput}
                    mode='flat'
                    label="Project Description"
                    maxLength={1024}
                    multiline={true}
                    
                    value={descriptionUpdate}
                    onChangeText={description => setDescriptionUpdate(description)}
                />
                <View style={styles.innerMargin} />
                <Picker
                    style={styles.picker}
                    mode="dropdown"
                    selectedValue={categoryUpdate}
                    onValueChange={(val) => setCategoryUpdate(val)}
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
                    selectedValue={priorityUpdate}
                    onValueChange={(val) => setPriorityUpdate(val)}
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
                onPress={() => updateProject()}
            >
                {loading ?
                    <ActivityIndicator color={'white'}/>
                    : <Text style={styles.btnText}>UPDATE</Text>
                }
            </TouchableOpacity>
        </View>
    )
}

export default UpdateProjectView

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