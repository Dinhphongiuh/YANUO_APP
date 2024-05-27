import React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import LottieView from 'lottie-react-native';

const AppLoader = () => {
    return (
        <SafeAreaView style={[StyleSheet.absoluteFillObject, styles.container]}>
            <LottieView
                source={require('../../assets/loader1.json')}
                autoPlay
                loop
            ></LottieView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1,
    }
})

export default AppLoader;