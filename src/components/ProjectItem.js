import React from "react";
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import Colors from "../constants/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Autolink from "react-native-autolink";

const ProjectItem = ({ item }) => {

    const navigation = useNavigation()
    const { _id, title, description, priority, image } = item

    console.log(item)

    const deleteProject = async () => {
        try {
            const response = await axios.delete(`http://10.2.71.238:8000/api/project/${_id}`)
            const data = await response.data
            return data
        } catch (err) {
            console.log(err)
            Alert.alert('Error!', err.message)
        }
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
                    text: 'OK',
                    onPress: () => deleteProject()
                }
            ],
            {cancelable: true}
        )
    }

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={() => navigation.navigate('ProjectDetailsView', {
                _id: _id,
                title: title,
                description: description,
                image: image,
                priority: priority
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
            <TouchableOpacity
                style={{
                    borderColor: priority == 1 ? Colors.GREEN : priority == 2 ? Colors.YELLOW : Colors.RED, 
                    borderWidth: 1, 
                    borderRadius: 8, 
                    alignSelf: 'flex-start', 
                    paddingVertical: 2,
                    paddingHorizontal: 4
                }}
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
                    style={{alignSelf: 'flex-start'}}
                    onPress={() => navigation.navigate('UpdateProjectView', {
                        _id: _id,
                        title: title,
                        description: description,
                        image: image,
                        priority: priority
                    })}
                >
                    <Icon name="edit" size={24} color={Colors.BLUE} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => deleteAlert()}
                >
                    <Icon name="delete" size={24} color={Colors.DARK_GRAY} />
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
        marginBottom: 8
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    }
})