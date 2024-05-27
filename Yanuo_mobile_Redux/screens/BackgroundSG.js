import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback, Permission, PermissionsAndroid} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import * as ImagePicker from 'expo-image-picker';
import client from '../api/client';
import { setLogin } from '../redux/slices/globalSlice';
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from '../redux/slices/meSlice';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProgressUpload from './components/ProgressUpload';

export default function App({route, navigation}) {
    // const [imageUri, setImageUri] = useState(null);
    const [profileImage, setProfileImage] = useState('');
    let actionSheet = React.createRef();
    const dispatch = useDispatch();
    const {token} = route.params;
    const [progress, setProgress] = useState(null);
    const [uploader, setUploader] = useState(false);

    const openImageLibrary = async() => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted')
        {
            alert('sorry, we need camera roll permissions to make this work!');
        }
        if (status === 'granted')
        {
            const response = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
            });

            if (!response.canceled)
            {
                console.log(response.assets[0].uri);
                setProfileImage(response.assets[0].uri)
            }
        }
    };

    const openCamera = async() => {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted')
        {
            alert('sorry, we need camera roll permissions to make this work!');
        }
        if (status === 'granted')
        {
            const response = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
            });

            if (!response.canceled)
            {
                console.log(response.assets[0].uri);
                setProfileImage(response.assets[0].uri)
            }
        }
    };

    const handleActionSheetPress = (index) => {
        switch(index)
        {
            case 0:
            {
                openImageLibrary();
                break;
            }
            case 1: 
            {
                openCamera();
                break;
            }
            default: 
                break;
        }
    };

    const uploadProfileAvatar = async () => {
        setUploader(true);
        if (profileImage === '')
        {
            const storedToken = await AsyncStorage.getItem('token');
            console.log('1', storedToken);
                try
                {
                    const res = await client.post('/sign-token',{}, {
                        headers: {
                        authorization: `JWT ${storedToken}`,
                    }
                })
                console.log(res.data);
                if (res.data.success)
                {
                    dispatch(setLogin(true));
                    dispatch(setUserProfile(res.data.user));
                    navigation.push('MainTabs1');
                }
                }
                catch (error)
                {
                console.log(error.message);
                }
        }
        const formData = new FormData();
        formData.append('profile', {
            name: new Date() + "_profile",
            uri: profileImage, 
            type: 'image/jpg'
        });
        // console.log('2', formData.get(uri));

        try {
            const res = await client.post('/upload-profile', formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    authorization: `JWT ${token}`
                },
                onDownloadProgress: ({loaded, total}) => setProgress(loaded / total),
            })

            if (res.data.success)
            {
                const storedToken = await AsyncStorage.getItem('token');
                try
                {
                    const res = await client.post('/sign-token',{}, {
                        headers: {
                        authorization: `JWT ${storedToken}`,
                    }
                })
                console.log(res.data);
                if (res.data.success)
                {
                    dispatch(setLogin(true));
                    dispatch(setUserProfile(res.data.user));
                    navigation.push('MainTabs1');
                    setUploader(false);
                }
                }
                catch (error)
                {
                console.log(error.message);
                }
            }
        } 
        catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
        <SafeAreaView style={styles.container}>
            <View style={{flexDirection: 'row', width: '90%', height: 35, alignItems: 'center'}}>
                    <TouchableOpacity
                        style={{}}
                        onPress={() => {navigation.goBack()}}
                    >

                        <Image
                            source={require('./Icon/BackIcon.png')}
                            style={{width: 18, height: 18}}
                        ></Image>
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, marginLeft: 16, color: '#fff', fontWeight: '600'}}>Ảnh đại diện</Text>
            </View>
            <View style={styles.content}>
                <View style={{width: '100%', backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{padding: 5, width: '95%'}}>Cập nhật ảnh đẹp nhất</Text>
                </View>
                <View style={{width: '98%', marginBottom: 200}}>
                    <View style={{width: '100%', height: 200, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity
                            style={{justifyContent: 'center', alignItems: 'center', width: 150, height: 150, borderRadius: '100%', overflow: 'hidden'}}
                            onPress={openImageLibrary}
                        >
                            {profileImage ? 
                                <Image source={{uri: profileImage}} style={{width: '100%', height: '100%'}}></Image> : 
                                <Image
                                    source={require('./Icon/backgroundEdit.png')}
                                    resizeMode='contain'
                                    style={{width: '100%', height: '100%'}}
                                ></Image>
                            }
                        </TouchableOpacity>
                    </View>
                    <Text style={{textAlign: 'center', color: '#81828b'}}>Bạn có thể chỉnh ảnh với nhiều tuỳ chọn và bộ lọc màu thú vị</Text>
                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
                        <TouchableOpacity
                            onPress={() => actionSheet.current.show()}
                        >
                            <Text style={{fontWeight: '500', color: '#289ae8'}}>Chọn ảnh ngay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 25}}>
                        <TouchableOpacity
                            style={{backgroundColor: '#039dfe', width: '55%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20}}
                            onPress={uploadProfileAvatar}
                        >
                            <Text style={{color: '#fff', fontWeight: '600'}}>Tiếp tục</Text>
                        </TouchableOpacity>
                </View>
            </View>
            <ActionSheet
                ref={actionSheet}
                title={'Tuỳ chọn'}
                options={['Chọn từ thư viện', 'Chụp ảnh từ camera', 'Huỷ']}
                cancelButtonIndex={2}
                // destructiveButtonIndex={}
                onPress={(index) => { handleActionSheetPress(index) }}
            />
        </SafeAreaView>
        {uploader ? <ProgressUpload progress={progress}></ProgressUpload> : null}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#009ef9',
    },
    content:{
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});