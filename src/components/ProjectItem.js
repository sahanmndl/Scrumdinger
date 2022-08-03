import React from "react";
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View, Alert, ToastAndroid } from "react-native";
import Colors from "../constants/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Autolink from "react-native-autolink";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import API_LINKS from "../constants/API_LINKS";

const ProjectItem = ({ item }) => {

    const navigation = useNavigation()
    const { _id, title, description, priority, image, category, duedate, timestamp } = item

    const iso = new Date(duedate)
    const ist = iso.toLocaleDateString()

    const deleteProject = async () => {
        await axios.delete(`${API_LINKS.PROJECT_URL}/${_id}`)
            .then(() => 
                Platform.OS == 'android' ? ToastAndroid.show('Project deleted!', ToastAndroid.LONG, ToastAndroid.BOTTOM)
                : Platform.OS == 'ios' ? Alert.alert('Success!', 'Project deleted') : null)
            .catch(() => Alert.alert('Error!', 'Cannot delete project'))
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
        <TouchableOpacity 
            style={styles.container}
            onPress={() => requestAnimationFrame(() => {
                navigation.navigate('ProjectDetailsView', {
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
            {image !== "" ?
                <Image
                    style={styles.projectImg}
                    source={{uri: image}}
                    defaultSource={require('../../assets/placeholder.png')}
                    borderTopLeftRadius={8}
                    borderTopRightRadius={8}
                /> : null
            }
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity
                    style={{
                        borderColor: priority == 1 ? Colors.GREEN : priority == 2 ? Colors.YELLOW : Colors.RED, 
                        borderWidth: 1, 
                        borderRadius: 8, 
                        alignSelf: 'flex-start', 
                        paddingVertical: 2,
                        paddingHorizontal: 4
                    }}
                    disabled={true}
                >
                    <Text
                        style={{
                            color: priority == 1 ? Colors.GREEN : priority == 2 ? Colors.YELLOW : Colors.RED, 
                            fontSize: 11,
                            fontWeight: '500'
                        }}
                    >
                        {priority == 1 ? 'LOW' : priority == 2 ? 'MEDIUM' : 'HIGH'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateBtn} disabled={true}>
                    <MaterialCommunityIcons name="timer-sand" size={16} color={Colors.DARK_GRAY} />
                    <Text style={styles.dateText}>
                        {ist.toUpperCase()}
                    </Text>
                </TouchableOpacity>
            </View>
            <Text 
                style={styles.title}
                numberOfLines={3}
                ellipsizeMode='tail'
            >
                <Autolink text={title} email url phone='sms' />
            </Text>
            <Text
                style={styles.description}
                numberOfLines={10}
                ellipsizeMode='tail'
            >
                <Autolink text={description} email url phone='sms' />
            </Text>
            <View style={styles.bottomBar}>
                <TouchableOpacity 
                    style={{alignSelf: 'flex-end', marginLeft: 20}}
                    onPress={() => Platform.OS == 'web' ? deleteProject() : deleteAlert()}
                >
                    <Icon name="delete" size={24} color={Colors.DARK_GRAY} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{alignSelf: 'flex-end'}}
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
                    <Icon name="edit" size={24} color={Colors.BLUE} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export default ProjectItem

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: Platform.OS === 'web' ? 0.5 : 1,
        padding: 8,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        backgroundColor: 'white',
        marginEnd: WIDTH < 768 ? 0 : 10
    },
    projectImg: {
        height: 120,
        width: '100%',
        borderTopStartRadius: 8,
        borderBottomEndRadius: 8,
        marginBottom: 8,
        backgroundColor: Colors.WHITISH
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        marginTop: 10
    },
    description: {
        fontSize: 16,
        marginTop: 8,
        color: Colors.DARK
    },
    bottomBar: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginTop: 10
    },
    dateBtn: {
        flexDirection: 'row',
        paddingVertical: 1.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dateText: {
        color: Colors.DARK_GRAY, 
        fontSize: 12,
        fontWeight: '500',
        marginStart: 4
    }
})