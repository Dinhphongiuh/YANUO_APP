import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Button, TextInput, ImageBackground, TouchableWithoutFeedback, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from '../../api/client';
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from '../../redux/slices/meSlice';

export default function App({navigation, route}) {
    const [pickAvatar, setPickAvatar] = useState(route.params.imagePick);
    const dispatch = useDispatch();

    const uploadProfileAvatar = async () => {
        const formData = new FormData();
        formData.append('profile', {
            name: new Date() + "_profile",
            uri: pickAvatar, 
            type: 'image/jpg'
        });
        
        // console.log('pik', formData.keys(uri));
        const storedToken = await AsyncStorage.getItem('token');
        console.log('Log nè', pickAvatar);
        console.log('loaddtoken', formData);
        try {
            const res = await client.post('/upload-profile', formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    authorization: `JWT ${storedToken}`
                },
                // onDownloadProgress: ({loaded, total}) => console.log(loaded / total),
            });
            
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
                    // dispatch(setLogin(true));
                    dispatch(setUserProfile(res.data.user));
                    // console.log('check: ', res.data.user);
                    navigation.push('ProfileSCR');
                // dispatch(setUserProfile(res.data.user));

                console.log('Update Success!');
                }
                }
                catch (error)
                {
                    console.log(error.message);
                }
            }
                // navigation.push('ProfileSCR');
                // navigation.goBack();
                // dispatch(setUserProfile(res.data.user));

                console.log('Update Success!');
            }
            catch (error) 
            {
            console.log(error.message);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'}></StatusBar>
            {/* Header */}
            <View style={{width: '100%', alignItems: 'center', height: 50, borderBottomWidth: 0.6, justifyContent: 'center', borderColor: '#e7e7e7'}}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Image
                            source={require('../Icon/ChevronLeft.png')}
                            resizeMode='contain'
                            style={{width: 20, height: 20}}
                        ></Image>
                    </TouchableOpacity>
                    <Text style={{fontSize: 16, fontWeight: '600'}}>Xem trước ảnh đại diện</Text>
                    <TouchableOpacity
                        onPress={uploadProfileAvatar}
                    >
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Lưu</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{width: '100%', alignItems: 'center', flex: 1, paddingVertical: 10}}>
                <View style={{width: '100%', height: 400}}>
                    <View style={styles.content}>
                        <Text style={{color: '#9097a4', fontWeight: '600', marginLeft: 10}}>Đến: </Text>
                        <View style={{marginVertical: 20, marginLeft: 10}}>
                            <TextInput
                                placeholder='Nói gì đó về ảnh đại diện của bạn'
                                placeholderTextColor={'#67666a'}
                                style={{color: '#000', fontSize: 16}}
                            ></TextInput>
                        </View>
                        <View style={{width: '100%', height: 300, alignItems: 'center', alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{width: 300, height: 300, borderRadius: 1000, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#ccc', shadowColor: '#f7f7f7', shadowOffset: {width: 0, height: 12}, shadowOpacity: 0.50, elevation: 24, shadowRadius: 16.00}}>
                                <Image
                                    source={{uri: pickAvatar}}
                                    resizeMode='cover'
                                    style={{width: '100%', height: '100%', zIndex: -1, position: 'absolute'}}
                                ></Image>
                            </View>
                                <TouchableOpacity
                                    style={{backgroundColor: '#e4e6eb', width: 60, height: 60, position: 'absolute', bottom: 40, right: 20, borderRadius: 100, borderWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center', zIndex: 15}}
                                >
                                    <Image
                                        source={require('../Icon/Camera.png')}
                                        resizeMode='contain'
                                        style={{width: '50%', height: '50%'}}
                                    ></Image>
                                </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity
                        style={{backgroundColor: '#e4e6eb', width: 120, justifyContent: 'center', alignItems: 'center', height: 40, borderRadius: 14}}
                    >
                        <Text>Chỉnh sửa</Text>
                    </TouchableOpacity>
                    <View style={{width: 12}}></View>
                    <TouchableOpacity
                        style={{backgroundColor: '#e4e6eb', width: 120, justifyContent: 'center', alignItems: 'center', height: 40, borderRadius: 14}}
                    >
                        <Text>Khung</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={{width: '100%', borderTopWidth: 1, borderBottomWidth: 1, height: 40, marginBottom: 2, borderColor: '#e3e3e3', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', padding: 10}}>
                <Text style={{fontWeight: '600'}}>Chia sẻ lên Bảng tin</Text>
                <TouchableOpacity style={{width: 20, height: 20, borderRadius: 5, borderWidth: 1}}></TouchableOpacity>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff'
    },
    header: {
        width: '94%', 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        width: '94%',

    }
});