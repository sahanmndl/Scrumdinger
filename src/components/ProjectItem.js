import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";

const ProjectItem = ({ item }) => {

    const { title, description } = item

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
        </TouchableOpacity>
    )
}

export default ProjectItem

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 0.5,
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
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
        marginTop: 6,
        color: Colors.DARK
    }
})