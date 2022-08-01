import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, Platform } from "react-native";
import { TextInput, List } from "react-native-paper";
import Colors from "../../constants/Colors";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const UpdateProjectView = ({ route }) => {

    const {_id, title, description, image, category, priority, duedate} = route.params

    const navigation = useNavigation()
    const [titleUpdate, setTitleUpdate] = useState(title)
    const [descriptionUpdate, setDescriptionUpdate] = useState(description)
    const [imageUpdate, setImageUpdate] = useState(image)
    const [categoryUpdate, setCategoryUpdate] = useState(category)
    const [priorityUpdate, setPriorityUpdate] = useState(priority)
    const [loading, setLoading] = useState(false)
    const [dateUpdate, setDateUpdate] = useState(new Date(duedate))

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDateUpdate(currentDate)
    }

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: dateUpdate,
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
                    priority: priorityUpdate,
                    duedate: dateUpdate.getTime()
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
                        value={imageUpdate}
                        onChangeText={image => setImageUpdate(image)}
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
                        value={titleUpdate}
                        onChangeText={title => setTitleUpdate(title)}
                    />
                    <View style={styles.innerMargin} />
                    <TextInput
                        style={{width: '100%', backgroundColor: 'white'}}
                        activeUnderlineColor={Colors.BLUE}
                        mode='flat'
                        label="Description *"
                        multiline={true}
                        value={descriptionUpdate}
                        onChangeText={description => setDescriptionUpdate(description)}
                    />
                </View>
                <View style={styles.innerMargin} />
                <Picker
                    style={styles.picker}
                    mode="dropdown"
                    selectedValue={categoryUpdate}
                    onValueChange={(val) => setCategoryUpdate(val)}
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
                    selectedValue={priorityUpdate}
                    onValueChange={(val) => setPriorityUpdate(val)}
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
                            title="Update due Date and Time"
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
                                {dateUpdate.toLocaleString()}
                            </Text>
                        </View>
                    </List.Section>
                </View>
            </ScrollView>
            <View style={styles.innerMargin} />
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
        backgroundColor: Colors.WHITISH2,
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
        backgroundColor: 'white'
    }
})