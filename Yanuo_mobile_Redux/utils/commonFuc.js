import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    Alert,
    Platform, ToastAndroid,
} from 'react-native';

// import RNFetchBlob from "react-native-fetch-blob";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { disconnect } from "./socketClient";

const commonFuc = {
    getBase64: file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    },

    notifyMessage: message => {
        if (Platform.OS === 'android')
        {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        }
        else
        {
            Alert(message);
        }
    }
}

export default commonFuc;