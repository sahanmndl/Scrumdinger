import React, { useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking, Dimensions, Alert, ToastAndroid, ActivityIndicator } from "react-native";
import Colors from "../../constants/Colors";
import Autolink from "react-native-autolink";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomSheet from "react-native-simple-bottom-sheet";
import { google } from "calendar-link";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import API_LINKS from "../../constants/API_LINKS";

const ProjectDetailsView = ({ route }) => {

    const {_id, title, description, image, category, priority, duedate, timestamp} = route.params

    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)

    const iso = new Date(duedate)
    const ist = iso.toLocaleString()
    const createdISO = new Date(timestamp)
    const createdIST = createdISO.toLocaleDateString()

    const addEventToCalendar = {
        title: title,
        description: description,
        start: iso
    }

    const deleteProject = async () => {
        setLoading(true)
        await axios.delete(`${API_LINKS.PROJECT_URL}/${_id}`)
            .then(() => 
                Platform.OS == 'android' ? ToastAndroid.show('Project deleted!', ToastAndroid.LONG, ToastAndroid.BOTTOM)
                : Platform.OS == 'ios' ? Alert.alert('Success!', 'Project deleted') : null)
            .then(() => navigation.goBack())
            .catch(() => Alert.alert('Error!', 'Cannot delete project'))
            .finally(() => setLoading(false))
    }

    const deleteAlert = () => {
        Alert.alert(
            "Confirmation", "Do you want to delete this project?",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log("Cancel"),
                    style: "cancel",
                },
                {
                    text: 'YES',
                    onPress: () => deleteProject()
                }
            ],
            {cancelable: true}
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={Platform.OS === 'web' ? true : false}
            >
                {image != "" ?
                    <Image
                        style={styles.image}
                        source={{uri: image}}
                        defaultSource={require('../../../assets/placeholder.png')}
                    /> : null
                }
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                        style={{
                            borderColor: priority == 1 ? Colors.GREEN : priority == 2 ? Colors.YELLOW : Colors.RED, 
                            borderWidth: 1, 
                            borderRadius: 8, 
                            alignSelf: 'flex-start', 
                            paddingVertical: 2,
                            paddingHorizontal: 4,
                        }}
                        disabled={true}
                    >
                        <Text
                            style={{
                                color: priority == 1 ? Colors.GREEN : priority == 2 ? Colors.YELLOW : Colors.RED, 
                                fontSize: 13,
                                fontWeight: '500'
                            }}
                        >
                            {priority == 1 ? 'LOW' : priority == 2 ? 'MEDIUM' : 'HIGH'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.dateBtn}
                        onPress={() => requestAnimationFrame(() => {
                            Linking.openURL(google(addEventToCalendar))
                        })}
                    >
                        <MaterialCommunityIcons name="calendar-edit" size={18} color={Colors.BLUE} />
                        <Text style={styles.dateText}>
                            {ist.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.title} selectable={true}>
                    <Autolink text={title} email url phone='sms' />
                </Text>
                <Text style={styles.created}>
                    Created on {createdIST} at {createdISO.toLocaleTimeString()}
                </Text>
                <Text style={styles.description} selectable={true}>
                    <Autolink text={description} email url phone='sms' />
                </Text>
            </ScrollView>
            <BottomSheet isOpen={false} lineStyle={{backgroundColor: Colors.DARK_GRAY}}>
                <View style={{flexDirection: 'row', paddingBottom: 20}}>
                    <TouchableOpacity
                        style={styles.btnAssign}
                        onPress={() => requestAnimationFrame(() => {
                            ToastAndroid.show('Under development', ToastAndroid.LONG, ToastAndroid.BOTTOM)
                        })}
                    >
                        <Icon style={{marginEnd: 10}} name="assignment" size={20} color={Colors.GREEN} />
                        <Text style={{color: Colors.GREEN, fontSize: 15, fontWeight: "500"}}>Assign</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnEdit}
                        onPress={() => requestAnimationFrame(() => {
                            navigation.navigate('UpdateProjectView', {
                                _id: _id,
                                title: title,
                                description: description,
                                image: image,
                                category: category,
                                priority: priority,
                                duedate: duedate,
                                timestamp: timestamp
                            })
                        })}
                    >
                        <Icon style={{marginEnd: 10}} name="edit" size={20} color={Colors.BLUE} />
                        <Text style={{color: Colors.BLUE, fontSize: 15, fontWeight: "500"}}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnDelete}
                        disabled={loading ? true : false}
                        onPress={() => requestAnimationFrame(() => {
                            deleteAlert()
                        })}
                    >
                        {loading ?
                            <ActivityIndicator style={{marginEnd: 10}} size={'small'} color={Colors.RED} />
                            : <Icon style={{marginEnd: 10}} name="delete" size={20} color={Colors.RED} />
                        }
                        <Text style={{color: Colors.RED, fontSize: 15, fontWeight: "500"}}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        </View>
    )
}

export default ProjectDetailsView

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: 'white',
        padding: 10
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 10
    },
    created: {
        fontSize: 13,
        color: Colors.DARK_GRAY,
        marginTop: 10
    },
    description: {
        fontSize: 17,
        color: Colors.DARK,
        marginTop: 10
    },
    image: {
        width: '100%',
        height: 240,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: Colors.WHITISH
    },
    dateBtn: {
        borderColor: Colors.BLUE, 
        borderWidth: 1, 
        borderRadius: 8, 
        flexDirection: 'row',
        paddingVertical: 2,
        paddingHorizontal: 4,
        marginStart: 10
    },
    dateText: {
        color: Colors.BLUE, 
        fontSize: 13,
        fontWeight: '500',
        marginStart: 6
    },
    innerMargin: {
        height: 10
    },
    btnAssign: {
        flex: 1,
        height: 40,
        width: WIDTH < 768 ? WIDTH - 20 : '100%',
        alignItems: "center",
        justifyContent: "center",
        borderColor: Colors.GREEN,
        borderRadius: 4,
        flexDirection: 'row',
    },
    btnEdit: {
        flex: 1,
        height: 40,
        width: WIDTH < 768 ? WIDTH - 20 : '100%',
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        borderColor: Colors.BLUE,
        flexDirection: 'row',
        marginHorizontal: 10
    },
    btnDelete: {
        flex: 1,
        height: 40,
        width: WIDTH < 768 ? WIDTH - 20 : '100%',
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        borderColor: Colors.RED,
        flexDirection: 'row'
    }
})