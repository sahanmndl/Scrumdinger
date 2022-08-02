import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, Platform } from "react-native";
import { TextInput, List } from "react-native-paper";
import Colors from "../../constants/Colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import API_LINKS from "../../constants/API_LINKS";

const CreateProjectView = () => {

    const navigation = useNavigation()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [category, setCategory] = useState("")
    const [priority, setPriority] = useState(0)
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState(new Date(1692365400000)) //Aug 18 2023 19:00:00

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate)
    }

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        })
    }

    const showDatepicker = () => {
        showMode('date')
    }

    const showTimepicker = () => {
        showMode('time')
    }

    const createProject = async () => {

        const timestamp = new Date()

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
                const response = await axios.post(`${API_LINKS.PROJECT_URL}/create`, {
                    title: title.trim(),
                    description: description.trim(),
                    image: image.trim(),
                    category: category,
                    priority: priority,
                    duedate: date.getTime(),
                    timestamp: timestamp.getTime(),
                    user: userId
                })
                const data = await response.data
                navigation.goBack()
                return data
            } catch (err) {
                Alert.alert('Error!', 'Unable to create new project')
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
                <View style={{flex: 1,
                     paddingHorizontal: 8, 
                     paddingBottom: 10, 
                     backgroundColor: 'white', 
                     borderRadius: 4,
                     elevation: 2
                }}>
                    <TextInput
                        style={{width: '100%', backgroundColor: 'white'}}
                        activeUnderlineColor={Colors.BLUE}
                        mode='flat'
                        label="Image link"
                        value={image}
                        onChangeText={image => setImage(image)}
                    />
                </View>
                <View style={styles.innerMargin} />
                <View style={{flex: 1,
                     paddingHorizontal: 8, 
                     paddingBottom: 10, 
                     backgroundColor: 'white', 
                     borderRadius: 4,
                     elevation: 2
                }}>
                    <TextInput
                        style={{width: '100%', backgroundColor: 'white'}}
                        activeUnderlineColor={Colors.BLUE}
                        mode='flat'
                        label="Title *"
                        maxLength={1024}
                        value={title}
                        onChangeText={title => setTitle(title)}
                    />
                    <View style={styles.innerMargin} />
                    <TextInput
                        style={{width: '100%', backgroundColor: 'white'}}
                        activeUnderlineColor={Colors.BLUE}
                        mode='flat'
                        label="Description *"
                        multiline={true}
                        value={description}
                        onChangeText={description => setDescription(description)}
                    />
                </View>
                <View style={styles.innerMargin} />
                <Picker
                    style={styles.picker}
                    mode="dropdown"
                    selectedValue={category}
                    onValueChange={(val) => setCategory(val)}
                >
                    <Picker.Item label="Set Category" value="category" color={Colors.DARK_GRAY} />
                    <Picker.Item label="To Do" value="todo"/>
                    <Picker.Item label="In Progress" value="progress"/>
                    <Picker.Item label="Backlogs" value="backlogs"/>
                    <Picker.Item label="Review" value="review"/>
                </Picker>
                <Picker
                    style={styles.picker}
                    mode="dropdown"
                    selectedValue={priority}
                    onValueChange={(val) => setPriority(val)}
                >
                    <Picker.Item label="Set Priority Level" value={0} color={Colors.DARK_GRAY} />
                    <Picker.Item label="Low" value={1} color={Colors.GREEN} />
                    <Picker.Item label="Medium" value={2} color={Colors.YELLOW} />
                    <Picker.Item label="High" value={3} color={Colors.RED}/>
                </Picker>
                <View style={styles.innerMargin} />
                <View style={{
                    flex: 1,
                    backgroundColor: 'white', 
                    borderRadius: 4,
                    elevation: 2,
                    paddingBottom: 6
                }}>
                    <List.Section>
                        <List.Accordion
                            style={{backgroundColor: 'white'}}
                            title="Set due Date and Time"
                            titleStyle={{color: Colors.DARK_GRAY}}
                            left={props => <List.Icon {...props} icon="timer-sand" color={Colors.BLUE} />}
                        >
                            <List.Item 
                                title="Set Date"
                                left={props => <List.Icon {...props} icon="calendar" color={Colors.DARK_GRAY} />}
                                onPress={showDatepicker}
                            />
                            <List.Item
                                title="Set Time"
                                left={props => <List.Icon {...props} icon="clock-outline" color={Colors.DARK_GRAY} />}
                                onPress={showTimepicker}
                            />
                        </List.Accordion>
                        <View style={{alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{fontSize: 16, color: Colors.DARK_GRAY, marginEnd: 10}}>
                                Time Set: 
                            </Text>
                            <Text style={{fontSize: 16}}>
                                {date.toLocaleString()}
                            </Text>
                        </View>
                    </List.Section>
                </View>
            </ScrollView>
            <View style={styles.innerMargin} />
            <TouchableOpacity
                style={styles.buttonSubmit}
                disabled={loading ? true : false}
                onPress={() => requestAnimationFrame(() => {
                    createProject()
                })}
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
        backgroundColor: Colors.WHITISH2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        width: WIDTH < 768 ? WIDTH - 20 : '50%',
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
        backgroundColor: 'white'
    },
})