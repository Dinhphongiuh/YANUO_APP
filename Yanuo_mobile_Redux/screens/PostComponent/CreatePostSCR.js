import { StatusBar, TextInput } from 'react-native';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback, ScrollView, PanResponder, ActivityIndicator} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BottomSheet from '@gorhom/bottom-sheet';
import {GestureHandlerRootView } from "react-native-gesture-handler";
import { useRef } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';

export default function CreatePost({navigation, setModalCreatePostVisible}) {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.meSlice.userProfile);
    // BottomSheet 
    const [isBottomSheet, setIsBottomSheet] = useState(false);
    const bottomSheetRefRequred = useRef(null);
    const snapPointsRequred = useMemo(() => ['40%', '20%', '20%',], []);
    const handleClosePress = () => bottomSheetRefRequred.current?.snapToIndex(0);
    const handleOpenPress = () => {
        bottomSheetRefRequred.current?.snapToIndex(1);
        setIsBottomSheet(true);
    };

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle={'dark-content'}></StatusBar>
                {/* Header */}
                <View style={{width: '94%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f7f8fa', height: 60}}>
                    <TouchableOpacity
                        onPress={() => setModalCreatePostVisible(false)}
                    >
                        <Image
                            source={require('../Icon/xMarkBlack.png')}
                            resizeMode='contain'
                            style={{width: 25, height: 25}}
                        ></Image>
                    </TouchableOpacity>
                    <Text style={{fontWeight: 'bold', fontSize: 18}}>Tạo bài viết</Text>
                    <TouchableOpacity>
                        <Text style={{color: '#c1c4c8', fontSize: 16, fontWeight: '600'}}>Tiếp</Text>
                    </TouchableOpacity>
                </View>
                {/*  */}
                <View style={{width: '100%', height: 1, borderBottomWidth: 1, borderColor: '#b3b3b3'}}></View>
                <View style={{width: '100%', height: '100%', backgroundColor: '#fff', alignItems: 'center'}}>
                    <View style={{width: '94%', alignItems: 'center', height: '100%'}}>
                        <ScrollView
                            style={{width: '100%', height: '100%'}}
                        >
                            <View style={{width: '100%', flexDirection: 'row', marginTop: 10,}}>
                                <View style={{width: 50, height: 50, borderWidth: 1, borderColor: '#cdced0', borderRadius: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
                                    <Image
                                        source={{uri: profile.avatar}}
                                        resizeMode='cover'
                                        style={{width: '100%', height: '100%', borderRadius: 50}}
                                    ></Image>
                                </View>
                                <View style={{marginLeft: 10}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 15}}>{profile.userName}</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity
                                            style={{width: 145, height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 6, backgroundColor: '#eaf5ff', borderRadius: 6}}
                                        >
                                            <Image
                                                source={require('../Icon/earthAsia.png')}
                                                resizeMode='contain'
                                                style={{width: 20, height: 20}}
                                            ></Image>
                                            <Text style={{fontWeight: 'bold', color: '#0165d1'}}>Công khai</Text>
                                            <Image
                                                source={require('../Icon/caretdown.png')}
                                                resizeMode='contain'
                                                style={{width: 18, height: 18}}
                                            ></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <TextInput
                                placeholder='Bạn đang nghĩ gì?'
                                placeholderTextColor={'#666668'}
                                style={{color: '#000', fontSize: 16, marginTop: 16, width: '100%', }}
                            ></TextInput>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
            <BottomSheet 
                ref={bottomSheetRefRequred} 
                // index={0} 
                snapPoints={snapPointsRequred} 
                style={{zIndex: 2,
                    shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 16.00,

                elevation: 24,
                }} 
                onChange={(index) => {index != 0 ? setIsBottomSheet(true) : setIsBottomSheet(false)}}
                handleIndicatorStyle={{backgroundColor: '#c9ccd2'}}
            >
                <View style={{width: '100%', alignItems: 'center'}}>
                    <TouchableOpacity
                        style={{flexDirection: 'row', width: '90%', alignItems: 'center'}}
                    >
                        <Image
                            source={require('../Icon/album1.png')}
                            resizeMode='contain'
                            style={{width: 35, height: 35}}
                        ></Image>
                        <Text style={{fontWeight:'600', marginLeft: 15}}>Ảnh/video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{flexDirection: 'row', width: '90%', alignItems: 'center', marginTop: 15}}
                    >
                        <Image
                            source={require('../Icon/userTag.png')}
                            resizeMode='contain'
                            style={{width: 35, height: 35}}
                        ></Image>
                        <Text style={{fontWeight:'600', marginLeft: 15}}>Gắn thẻ người khác</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f7f8fa',
    },
});