import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, Platform } from "react-native";
import { TextInput, List } from "react-native-paper";
import Colors from "../../constants/Colors";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import API_LINKS from "../../constants/API_LINKS";

const AssignProjectView = ({ route }) => {

    const {_id, title, description, image, category, priority, duedate} = route.params

    const [assigneeId, setAssigneeId] = useState("")
    const [loading, setLoading] = useState(false)

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
                        label="Enter Assignee Id"
                        value={assigneeId}
                        onChangeText={id => setAssigneeId(id)}
                    />
                </View>
            </ScrollView>
            <View style={styles.innerMargin} />
            <TouchableOpacity
                style={styles.buttonSubmit}
                disabled={loading ? true : false}
                onPress={() => requestAnimationFrame(() => {
                    console.log('assign')
                })}
            >
                {loading ?
                    <ActivityIndicator color={'white'}/>
                    : <Text style={styles.btnText}>ASSIGN</Text>
                }
            </TouchableOpacity>
        </View>
    )
}

export default AssignProjectView

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.WHITISH2
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