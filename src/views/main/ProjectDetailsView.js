import React from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import Autolink from "react-native-autolink";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ProjectDetailsView = ({ route }) => {

    const {_id, title, description, image, priority, duedate, timestamp} = route.params

    const iso = new Date(duedate)
    const ist = iso.toLocaleString()
    const createdISO = new Date(timestamp)
    const createdIST = createdISO.toLocaleString()
    console.log(duedate, iso, ist, createdIST)

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
                    <TouchableOpacity style={styles.dateBtn}>
                        <MaterialCommunityIcons name="calendar-edit" size={18} color={Colors.BLUE} />
                        <Text style={styles.dateText}>
                            {ist.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>
                    <Autolink text={title} email url phone='sms' />
                </Text>
                <Text style={styles.created}>
                    Created: {createdIST}
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
    }
})