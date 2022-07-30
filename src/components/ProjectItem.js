import React from "react";
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProjectItem = ({ item }) => {

    const { title, description, priority } = item

    return (
        <TouchableOpacity style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text 
                style={styles.description}
                ellipsizeMode="tail" 
                numberOfLines={10}
            >
                {description}
            </Text>
            <View style={styles.bottomBar}>
                <Image
                    style={styles.priorityImg}
                    source={priority === 1 ? require('../../assets/green.png')
                        : priority === 2 ? require('../../assets/yellow.png')
                        : priority === 3 ? require('../../assets/red.png')
                        : require('../../assets/priority-placeholder.png')}
                    defaultSource={require('../../assets/priority-placeholder.png')}
                />
                <TouchableOpacity 
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => console.log('delete')}
                >
                    <Icon name="delete" size={26} color={Colors.DARK_GRAY} />
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
    title: {
        fontSize: 20,
        fontWeight: '500'
    },
    description: {
        fontSize: 16,
        marginVertical: 8,
        color: Colors.DARK
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    priorityImg : {
        height: 20,
        width: 20
    }
})