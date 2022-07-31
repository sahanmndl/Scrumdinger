import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View, TouchableOpacity, Alert, Dimensions, Platform } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Colors from '../../constants/Colors';
import Feather from "react-native-vector-icons/Feather";
import ProjectItem from "../../components/ProjectItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import NoResults from "../../components/NoResults";
import { Picker } from "@react-native-picker/picker";

const ToDoView = () => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [projectsNew, setProjectsNew] = useState([])
    const [projectsOld, setProjectsOld] = useState([])
    const [projectsAsc, setProjectsAsc] = useState([])
    const [projectsDesc, setProjectsDesc] = useState([])
    const [sort, setSort] = useState("newest")
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const readProjects = async () => {
        const userId = await AsyncStorage.getItem('userId')
        console.log(userId)
        try {
            setLoading(true)
            /**const response = await axios.get(`http://10.2.71.238:8000/api/project/user/${userId}`)
            const data = response.data
            console.log(data.projects.projects)
            const json = data.projects.projects
            setProjects([...json])*/
            await axios.get(`http://10.2.71.238:8000/api/project/user/${userId}`)
                .then((response) => {
                    var json = response.data.projects.projects
                    var filteredJSON = json.filter(it => it.category == "todo")
                    var tempJSON1 = filteredJSON
                    //var tempJSON2 = filteredJSON
                    //var ascJSON = tempJSON1.sort((a, b) => a.priority - b.priority)
                    //var descJSON = tempJSON2.sort((a, b) => b.priority - a.priority)
                    //console.log(filteredJSON.sort((a, b) => b.priority - a.priority))
                    //console.log(sort, filteredJSON)
                    //setProjectsNew([...tempJSON1.reverse()])
                    setProjectsOld([...filteredJSON])
                })
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
        readProjects()
    }, [])

    return (
        <View style={styles.container}>
            <Picker
                style={styles.picker}
                mode="dropdown"
                selectedValue={sort}
                onValueChange={(val) => setSort(val)}
            >
                <Picker.Item label="Newest" value="newest"/>
                <Picker.Item label="Oldest" value="oldest"/>
                <Picker.Item label="Ascending Priority" value="ascending"/>
                <Picker.Item label="Descending Priority" value="descending"/>
            </Picker>
            <View style={{flex: 1}}>
                {loading ? <ActivityIndicator size={'large'} color={Colors.BLUE} /> :
                    <FlatList
                        style={{flex: 1}}
                        data={projectsOld}
                        numColumns={WIDTH < 768 ? 1 : 2}
                        onRefresh={onRefresh}
                        refreshing={refresh}
                        ListEmptyComponent={NoResults}
                        showsVerticalScrollIndicator={Platform.OS === 'web' ? true : false}
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
    },
    pickerContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    picker: {
        width: WIDTH - 20,
        borderWidth: 1,
        backgroundColor: 'rgba(52, 52, 52, 0.0)',
    },
})