import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from '../../constants/Colors';
import Feather from "react-native-vector-icons/Feather";

const ToDoView = () => {

    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)

    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
                {loading ? <ActivityIndicator size={'large'} color={Colors.BLUE} /> :
                    <FlatList
                        style={{flex: 1}}

                    />
                }
            </View>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateProjectView')}
            >
                <Feather name='plus' size={26} color='#FFF' />
            </TouchableOpacity>
        </View>
    )
}

export default ToDoView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: Colors.WHITISH2
    },
    fab: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        position: 'absolute',
        bottom: 45,
        right: 35,
        backgroundColor: Colors.BLUE,
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
    }
})