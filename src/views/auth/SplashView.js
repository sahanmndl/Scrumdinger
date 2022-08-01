import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from "react-native";
import Colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

const SplashView = () => {

    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <View style={{flex: 0.5, alignItems: 'center', justifyContent: 'center'}}>
                <Image
                    style={{height: 50, width: 50}}
                    source={require('../../../assets/icon_1.png')}
                />
            </View>
            <View style={{flex: 0.4, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.title}>Scrumdinger</Text>
                <Text style={styles.caption}>Manage your projects efficiently!</Text>
                <TouchableOpacity
                    style={styles.buttonSubmit}
                    onPress={() => navigation.navigate('RegisterView')}
                >
                    <Text style={styles.btnText}>Create account</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex: 0.1, flexDirection: 'row'}}>
                <Text style={{color: Colors.DARK_GRAY}}>Have an account already?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('LoginView')}>
                    <Text style={{marginStart: 4, color: Colors.BLUE, fontWeight: '500'}}>Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SplashView

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
        fontWeight: '700'
    },
    caption: {
        marginTop: 10,
        color: Colors.DARK_GRAY
    },
    buttonSubmit: {
        height: 45,
        width: WIDTH - 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.BLUE,
        elevation: 4,
        borderRadius: 100,
        marginTop: 20
    },
    btnText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "500"
    }
})