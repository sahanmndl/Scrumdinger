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
    const [projects, setProjects] = useState([])
    const [filter, setFilter] = useState()
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
                    setProjects([...filteredJSON])
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
                selectedValue={filter}
                onValueChange={(val) => setFilter(val)}
            >
                <Picker.Item label="All" value="all"/>
                <Picker.Item label="Low Priority" value="low" color={Colors.GREEN} />
                <Picker.Item label="Medium Priority" value="medium" color={Colors.YELLOW} />
                <Picker.Item label="High Priority" value="high" color={Colors.RED} />
            </Picker>
            <View style={{flex: 1}}>
                {loading ? <ActivityIndicator size={'large'} color={Colors.BLUE} /> :
                    <FlatList
                        style={{flex: 1}}
                        data={filter == 'low' ? projects.filter(it => it.priority == 1) : 
                                filter == 'medium' ? projects.filter(it => it.priority == 2) :
                                filter == 'high' ? projects.filter(it => it.priority == 3) :
                                projects}
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