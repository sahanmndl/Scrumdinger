import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View, TouchableOpacity, Alert, Platform, Dimensions } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Colors from '../../constants/Colors';
import Feather from "react-native-vector-icons/Feather";
import ProjectItem from "../../components/ProjectItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ToDoView = () => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const readProjects = async () => {
        const userId = await AsyncStorage.getItem('userId')
        console.log(userId)
        try {
            setLoading(true)
            //const response = await fetch('https://jsonplaceholder.typicode.com/posts')
            //const json = await response.json()
            const response = await axios.get(`http://10.2.71.238:8000/api/project/user/${userId}`)
            const data = response.data
            console.log(data.projects.projects)
            const json = data.projects.projects
            setProjects([...json])
            return true
        } catch (err) {
            Alert.alert('Error!', err.message)
            console.log(err)
            return false
        } finally {
            setRefresh(false)
            setLoading(false)
        }
    }

    const onRefresh = () => {
        setRefresh(true)
        readProjects()
    }

    useEffect(() => {
        isFocused && readProjects()
    }, [isFocused])

    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
                {loading ? <ActivityIndicator size={'large'} color={Colors.BLUE} /> :
                    <FlatList
                        style={{flex: 1}}
                        data={projects}
                        numColumns={WIDTH < 768 ? 1 : 2}
                        onRefresh={onRefresh}
                        refreshing={refresh}
                        keyExtractor={({_id}) => _id}
                        renderItem={({item}) => (
                            <ProjectItem item={item} />
                        )}
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

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
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