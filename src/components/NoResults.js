import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";

const NoResults = () => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={require('../../assets/no-results.png')}
            />
            <Text style={styles.caption}>No Projects Found!</Text>
        </View>
    )
}

export default NoResults

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Platform.OS === 'web' ? 30 : '50%',
    },
    image: {
        height: 120,
        width: 120,
        marginBottom: 20
    },
    caption: {
        fontSize: 18,
        fontWeight: '500'
    }
})