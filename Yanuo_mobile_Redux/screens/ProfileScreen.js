import { Animated, PanResponder, StatusBar } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Button, TextInput, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ActionSheet from 'react-native-actionsheet';
import {BottomSheetModal, BottomSheetView, BottomSheetModalProvider, } from '@gorhom/bottom-sheet';
// import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from '@gorhom/bottom-sheet';
import ViewImage from './components/viewImage';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from '../api/client';
import { setUserProfile } from '../redux/slices/meSlice';

const {height, width} = Dimensions.get('window');
export default function App({navigation}) {
    const [pickAvatar, setPickAvatar] = useState('');
    const [tieuSu, setTieuSu] = useState('Mì hảo hảo là ai? tại sao anh ấy lại phải nhận lấy sự chua cay');
    const [tabActive, setTabActive] = useState("Post");
    const profile = useSelector(state => state.meSlice.userProfile);
    const dispatch = useDispatch();
    console.log('testac: ', pickAvatar);

//    
    const [isBottomSheetAvatar, setIsBottomSheetAvatar] = useState(false);
    const snapPoints = useMemo(() => ['1%', '30%', '90%',], []);
    const bottomSheetRefAvatar = useRef(null);
    // const handleClosePress = () => bottomSheetRefAvatar.current?.close();
    const handleClosePress = () => bottomSheetRefAvatar.current?.snapToIndex(0);
    const handleOpenPress = () => {
        bottomSheetRefAvatar.current?.snapToIndex(1);
        setIsBottomSheetAvatar(true);
    };

    // 
    const panY = useRef(new Animated.Value(0)).current;

    const openImage = () => {
        handleClosePress();
        Animated.timing(panY, {
            toValue: height,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }

    const closeImage = () => {
        Animated.timing(panY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }

    // 
    const dismiss = 150;
    const pan = useRef(new Animated.ValueXY()).current;
    const [isPressed, setIsPressed] = useState(false);
    
    const panResponder = useRef(
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onPanResponderGrant: () => {
            setIsPressed(true);
            pan.setOffset({
              x: pan.x._value,
              y: pan.y._value,
            });
          },
          onPanResponderMove: Animated.event(
            [null, { dx: pan.x, dy: pan.y }],
            { useNativeDriver: false }
          ),
          onPanResponderRelease: () => {
            setIsPressed(false);
            pan.flattenOffset();
            Animated.spring(
              pan,
              { toValue: { x: 0, y: 0 }, useNativeDriver: false }
            ).start();
          },
        })
        ).current;

    // update Avatar
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
                // console.log('ahjx', response.assets[0].uri);
                setPickAvatar(response.assets[0].uri)
                // const result = await uploadProfileAvatar();
                navigation.push('previewAvataPick', {imagePick: response.assets[0].uri});
            }
        }
    };

    const uploadProfileAvatar = async () => {
        // console.log('loading')
        const formData = new FormData();
        formData.append('profile', {
            name: new Date() + "_profile",
            uri: pickAvatar, 
            type: 'image/jpg'
        });
        const storedToken = await AsyncStorage.getItem('token');
        // console.log('Log nè', storedToken);

        try {
            const res = await client.post('/upload-profile', formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    authorization: `JWT ${storedToken}`
                },
                // onDownloadProgress: ({loaded, total}) => console.log(loaded / total),
            })
            if (res.data.success)
            {
                // navigation.dispatch(
                //     StackActions.replace('UserProfile')
                // );
                // navigation.push('MainTabs1');
                console.log('Update Success!');
                // console.log('nul: ', res.data);
                // return true;
            }
        } 
        catch (error) {
            console.log(error.message);
        }
    };

    // tabPost
    const PostTab = () => {
        return (
            <View style={{width: '94%', marginTop: 20}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>Chi tiết</Text>
                <View style={{}}>
                    
                </View>
            </View>
        )
    }


    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <StatusBar barStyle="dark-content"></StatusBar>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={{width: '94%', height: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',}}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            // onPress={() => navigation.push('MeScreen')}
                        >
                            <Image
                                source={require('./Icon/ChevronLeft.png')}
                                resizeMode='contain'
                                style={{width: 18, height: 18}}
                            ></Image>
                        </TouchableOpacity>
                        <View style={{width: '70%', justifyContent: 'center', alignItems: 'center',}}>
                            <Text style={{fontSize: 14, fontWeight: '600'}}>{profile.userName}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                onPress={() => navigation.push('profileShowInfo')}
                            >
                                <Image
                                    source={require('./Icon/pen.png')}
                                    resizeMode='contain'
                                    style={{width: 24, height: 24, marginHorizontal: 12}}
                                ></Image>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image
                                    source={require('./Icon/SearchBlack.png')}
                                    resizeMode='contain'
                                    style={{width: 24, height: 24,}}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* Content */}
                <ScrollView
                    style={{width: '100%', height: height, backgroundColor: '#fff'}}
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        <TouchableOpacity
                            style={{width: '100%', height: height/3, zIndex: 2}}
                        >
                            <Image
                                // source={require('../assets/testBia.png')}
                                source={{uri: profile.coverImage}}
                                resizeMode='cover'
                                style={{width: '100%', height: '100%'}}
                            ></Image>
                            <TouchableOpacity
                                style={{backgroundColor: '#e4e6eb', width: 35, height: 35, position: 'absolute', bottom: 10, right: 10, borderRadius: 30, borderWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center'}}
                            >
                                <Image
                                    source={require('./Icon/Camera.png')}
                                    resizeMode='contain'
                                    style={{width: '50%', height: '50%'}}
                                ></Image>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width: 160, height: 160, position: 'absolute', borderRadius: 200, bottom: -50, marginLeft: 10, borderWidth: 2.5, borderColor: '#fff', zIndex: 100,}}
                            // onPress={() => actionSheetAvatar.current.show()}
                            onPress={handleOpenPress}
                        >
                            <Image
                                source={{uri: profile.avatar}}
                                resizeMode='cover'
                                style={{width: '100%', height: '100%', borderRadius: 80}}
                            ></Image>
                            <TouchableOpacity
                                style={{backgroundColor: '#e4e6eb', width: 35, height: 35, position: 'absolute', bottom: 20, right: -5, borderRadius: 100, borderWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center'}}
                            >
                                <Image
                                    source={require('./Icon/Camera.png')}
                                    resizeMode='contain'
                                    style={{width: '50%', height: '50%'}}
                                ></Image>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                    {/*  */}
                    <View style={{backgroundColor: '#fff', zIndex: -1, alignItems: 'center'}}>
                        <View style={{marginTop: '16%', width: '95%', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{profile.userName}</Text>
                                {profile.isAdmin ? 
                                    <Image
                                        source={require('./Icon/checkBlueFB.png')}
                                        resizeMode='contain'
                                        style={{width: 25, height: 25, marginLeft: 5}}
                                    ></Image> : null
                                }
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
                                <Text style={{fontWeight: 'bold'}}>null </Text>
                                <Text style={{color: '#666569'}}>Bạn bè</Text>
                            </View>
                            <View style={{marginLeft: 5, marginBottom: 15}}>
                                <TouchableOpacity
                                >
                                    <Text style={{fontWeight: '500'}}>{tieuSu}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{width: '100%', flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                <TouchableOpacity
                                    style={{width: '90%', height: 50, borderRadius: 10, flexDirection: 'row'}}
                                >
                                    <Image
                                        source={require('../assets/testSong.png')}
                                        resizeMode='cover'
                                        style={{width: 50, height: 50, borderRadius: 10}}
                                    ></Image>
                                    <View style={{marginLeft: 5, justifyContent: 'center'}}>
                                        <Text style={{fontWeight: '500'}}>Umbrella</Text>
                                        <Text style={{fontWeight: '400', color: '#6d6c71'}}>Umber Island</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{}}
                                >
                                    <Image
                                        source={require('./Icon/ChamLung.png')}
                                        resizeMode='contain'
                                        style={{width: 30, height: 30}}
                                    ></Image>
                                </TouchableOpacity>
                                <Image
                                    source={require('./Icon/play.png')}
                                    resizeMode='contain'
                                    style={{width: 20, height: 20, position: 'absolute', left: 2, top: 2}}
                                ></Image>
                            </View>
                            <TouchableOpacity 
                                style={{width: '100%', height: 40, backgroundColor: '#0865fe', marginTop: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 15}}
                            >
                                <Text style={{fontWeight: 'bold', color: '#fff'}}>+ Thêm vào tin</Text>
                            </TouchableOpacity>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10}}>
                                <TouchableOpacity
                                    style={{width: '80%', height: 40, backgroundColor: '#e4e6eb', borderRadius: 15, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}
                                    onPress={() => navigation.push('profileShowInfo')}
                                >
                                    <Image
                                        source={require('./Icon/pen.png')}
                                        resizeMode='contain'
                                        style={{width: 15, height: 15}}
                                    ></Image>
                                    <Text style={{fontWeight: 'bold', marginLeft: 6}}>Chỉnh sửa trang cá nhân</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{backgroundColor: '#e4e6eb', width: '18%', justifyContent: 'center', alignItems: 'center', borderRadius: 15, marginLeft: 6}}
                                >
                                    <Image
                                        source={require('./Icon/ChamLung.png')}
                                        resizeMode='contain'
                                        style={{width: 30, height: 30}}
                                    ></Image>
                                </TouchableOpacity>
                            </View>
                            <View style={{height: 20}}></View>
                        </View>
                    </View>
                    <View style={{backgroundColor: '#c9ccd1', width: width, height: 6}}></View>
                    {/*  */}
                    <View style={{width: '100%', height: 500, backgroundColor: '#fff', marginTop: 10, alignItems: 'center'}}>
                        <View style={{width: '94%', height: 60, borderBottomWidth: 1, borderColor: '#c9ccd0', alignItems: 'center', flexDirection: 'row'}}>
                            <TouchableOpacity
                                style={[tabActive === 'Post' ? styles.activeTabV : null, {width: 70, height: 35,justifyContent: 'center', alignItems: 'center', borderRadius: 30}]}
                                onPress={() => setTabActive("Post")}
                            >
                                <Text style={[tabActive === 'Post' ? styles.textActive : null, {fontWeight: '600'}]}>Bài viết</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[tabActive === 'Image' ? styles.activeTabV : null, {width: 55, height: 35,justifyContent: 'center', alignItems: 'center', borderRadius: 30,}]}
                                onPress={() => setTabActive("Image")}
                            >
                                <Text style={[tabActive === 'Image' ? styles.textActive : null, {fontWeight: '600'}]}>Ảnh</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Tab Post */}
                        {tabActive === 'Post' ? 
                            <PostTab></PostTab> : null
                        }
                    </View>

                </ScrollView>
                {isBottomSheetAvatar ? 
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setIsBottomSheetAvatar(false);
                            // bottomSheetRefAvatar.current?.close();
                            handleClosePress();
                        }}
                    >
                        <View style={styles.dimmedBackground}></View>
                    </TouchableWithoutFeedback>
                     : null
                }
                <BottomSheet 
                    ref={bottomSheetRefAvatar} 
                    // index={0} 
                    snapPoints={snapPoints} 
                    style={{}} 
                    onChange={(index) => {index != 0 ? setIsBottomSheetAvatar(true) : setIsBottomSheetAvatar(false)}}
                    handleIndicatorStyle={{backgroundColor: '#c9ccd2'}}
                >
                    <View style={{paddingHorizontal: 20}}>
                        <TouchableOpacity
                            style={{width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', marginBottom: 15}}
                            onPress={() => openImage()}
                        >
                            <View style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center'}}>
                                <Image
                                    source={require('./Icon/userCircle.png')}
                                    resizeMode='contain'
                                    style={{width: 40, height: 40}}
                                ></Image>
                            </View>
                            <Text style={{fontWeight: '600', fontSize: 16, paddingHorizontal: 10}}>Xem ảnh đại diện</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', marginBottom: 15}}
                            onPress={() => openImageLibrary()}
                        >
                            <View style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e4e6eb', borderRadius: 25}}>
                                <Image
                                    source={require('./Icon/imageLibary.png')}
                                    resizeMode='contain'
                                    style={{width: '60%', height: '60%'}}
                                ></Image>
                            </View>
                            <Text style={{fontWeight: '600', fontSize: 16, paddingHorizontal: 10}}>Chọn ảnh đại diện</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', marginBottom: 15}}
                        >
                            <View style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e4e6eb', borderRadius: 25}}>
                                <Image
                                    source={require('./Icon/Camera.png')}
                                    resizeMode='contain'
                                    style={{width: '50%', height: '50%'}}
                                ></Image>
                            </View>
                            <Text style={{fontWeight: '600', fontSize: 16, paddingHorizontal: 10}}>Camera</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheet>
            </SafeAreaView>
            {/* <Animated.View
                style={[pan.getLayout(),]}
                {...panResponder.panHandlers}

            > */}
                <Animated.View 
                    style={[{position: 'absolute', width: '100%', height: panY, backgroundColor: 'black', bottom: 0}]}
                >
                    <ViewImage profileImage={profile.avatar} closeImage={closeImage}></ViewImage>
                </Animated.View>
            {/* </Animated.View> */}
        </GestureHandlerRootView>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff'
    },
    header:{
        width: width,
        height: 20,
        alignItems: 'center',
        marginVertical: 10
        // backgroundColor: 'pink',
        // position: 'absolute',
        // top: 0,
    },
    activeTabV:{
        backgroundColor: '#ebf5fd',
    },
    textActive: {
        color: '#0761ce',
        fontWeight: 'bold'
    },
    dimmedBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        height: '100%',
        width: '100%'
    },
});