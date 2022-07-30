import React from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import Autolink from "react-native-autolink";

const ProjectDetailsView = ({ route }) => {

    const {_id, title, description, image, priority} = route.params

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={Platform.OS === 'web' ? true : false}
            >
                <Text style={{
                    fontSize: 16, 
                    fontWeight: '500', 
                    color: priority == 1 ? Colors.GREEN : priority == 2 ? Colors.YELLOW : Colors.RED
                }}>
                    {priority == 1 ? 'LOW' : priority == 2 ? 'MEDIUM' : 'HIGH'}
                </Text>
                {image != "" ?
                    <Image
                        style={styles.image}
                        source={{uri: image}}
                    /> : null
                }
                <Text style={styles.title}>
                    <Autolink text={title} email url phone='sms' />
                </Text>
                <Text style={styles.description}>
                    <Autolink text={description} email url phone='sms' />
                </Text>
            </ScrollView>
        </View>
    )
}

export default ProjectDetailsView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 10
    },
    description: {
        fontSize: 18,
        color: Colors.DARK,
        marginTop: 10
    },
    image: {
        width: '100%',
        height: 240,
        marginTop: 10,
        borderRadius: 8
    }
})