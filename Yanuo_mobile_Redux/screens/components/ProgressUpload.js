import React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import LottieView from 'lottie-react-native';

const AppLoader = ({progress}) => {
    return (
        <SafeAreaView style={[StyleSheet.absoluteFillObject, styles.container]}>
            <LottieView
                source={require('../../assets/progressUploadImage.json')}
                autoPlay
                progress={progress}
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