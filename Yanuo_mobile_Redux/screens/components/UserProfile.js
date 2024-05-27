import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Button, TextInput, ImageBackground, TouchableWithoutFeedback, StatusBar, Modal } from 'react-native';
import client from '../../api/client';
import {useSelector} from 'react-redux';
import {io} from 'socket.io-client';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from '@gorhom/bottom-sheet';

// const socket = io('http://192.168.1.176:3000');
const {height, width} = Dimensions.get('window');
export default function App({navigation, route}) {
    const [tabActive, setTabActive] = useState("Post");
    const [tieuSu, setTieuSu] = useState('?');
    const {profile} = route.params;
    const [friendRequest, setFriendRequests] = useState([]);
    const myProfile = useSelector(state => state.meSlice.userProfile);

    const [checkRequest, setCheckRequest] = useState(null);
    const [checkSendRequest, setCheckSendRequest] = useState([]);
    const [checkFriend, setCheckFriend] = useState([]);
    // console.log(checkSendRequest)
    // BottomSheet 
    const [isBottomSheetAvatar, setIsBottomSheetAvatar] = useState(false);
    const bottomSheetRefRequred = useRef(null);
    const snapPointsRequred = useMemo(() => ['1%', '20%', '20%',], []);
    const handleClosePress = () => bottomSheetRefRequred.current?.snapToIndex(0);
    const handleOpenPress = () => {
        bottomSheetRefRequred.current?.snapToIndex(1);
        setIsBottomSheetAvatar(true);
    };

    // modal
    const [modalVisible, setModalVisible] = useState(false);

    // lời mời kb đã gửi
    const fetchIntiveWasSend = async() => {
        try{
            const res = await client.get(`/invite-was-send/${myProfile._id}`);
            // console.log(res.data.sentRequestsData);
            setCheckSendRequest(res.data.sentRequestsData);
        }
        catch (error)
        {
          console.log(error.message);
        }
    }

    const fetchFriendRequest = async() => {
        try
        {
            const res = await client.get(`/friend-requests/${myProfile._id}`);
            // console.log(res.data);
            if (res.data.success)
            {
                // socket.emit("friendRequestNotification", ' gửi kb');
                setFriendRequests(res.data.requestsData);
            }
            else
            {
            }
        }
        catch (error)
        {
          console.log(error.message);
        }
    };
    // getList Friend
    const fetchListFriend = async() => {
        const storedToken = await AsyncStorage.getItem('token');
        try {
            const res = await client.get('/friends', {
                headers: {
                    Authorization: `JWT ${storedToken}`
                },
                params: {
                    _id: myProfile._id
                }
            });
            if (res.data.success)
            {
                // console.log(res.data.data);
                setCheckFriend(res.data.data)
            }
        }
        catch (error)
        {
            
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchFriendRequest();
            await fetchIntiveWasSend();
            await fetchListFriend();
        };
    
        fetchData();
        const isRequested = friendRequest.some(request => request.senderId === profile._id); //
        const isWasSend = checkSendRequest.some(invite => invite.receiverId === profile._id);
        const isFriend = checkFriend.some(friend => friend._id === profile._id);
        // const
        if (isRequested)
            setCheckRequest('isRequested');
        if (isWasSend)
            setCheckRequest('sending');
        if (isFriend)
            setCheckRequest('friend');
        if (!isRequested && !isWasSend && !isFriend)
            setCheckRequest(null);
    }, [friendRequest, profile]);

    // intive Friend
    const addFriend = async() => {
        // socket.emit("dangnghe", 'tao gửi kb');
        const senderId = myProfile._id;
        const receiverId = profile._id;
        try
        {
            const res = await client.post('/send-friend-request', {
                senderId: senderId,
                receiverId: receiverId
            });
            console.log(res.data);
            if (res.data.success)
            {
                
            }
        } catch (error) {
            console.log('Error sending friend request:', error.message);
        }
    }
    // delete Request
    const fetchDeleteRequest = async() =>
    {
        setModalVisible(false);
        try 
        {
            const res = await client.post('/deleteRequestFriend', {senderId: myProfile._id, _id: profile._id})
            console.log(res.data);
        }
        catch (error)
        {
            console.log(error)
        }
    }
    // delete Request Bottomsheet
    const fetchDeleteRequestt = async() =>
    {
        setModalVisible(false);
        try 
        {
            const res = await client.post('/deleteRequestFriend', {senderId: profile._id, _id: myProfile._id})
            console.log(res.data);
        }
        catch (error)
        {
            console.log(error)
        }
    }

    // chấp nhận kb
    const fetchAcceptFriend = async() => {
        handleClosePress
        try
        {
            const res = await client.post(`/accept-friend`, {
                _id: myProfile._id,
                senderId: profile._id
            });
            console.log(res.data);
            if (res.data.success)
            {
                console.log('success');
            }
        }
        catch (error)
        {
            console.log('')
        }
    }

    // tab post
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

        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content"></StatusBar>
            <View style={styles.header}>
            <View style={{width: '94%', height: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',}}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={require('../Icon/ChevronLeft.png')}
                        resizeMode='contain'
                        style={{width: 18, height: 18}}
                    ></Image>
                </TouchableOpacity>
                <View style={{width: '70%', justifyContent: 'center', alignItems: 'center',}}>
                    <Text style={{fontSize: 14, fontWeight: '600'}}>{profile.userName}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity>
                        <Image
                            source={require('../Icon/SearchBlack.png')}
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
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{width: 160, height: 160, position: 'absolute', borderRadius: 200, bottom: -50, marginLeft: 10, borderWidth: 2.5, borderColor: '#fff', zIndex: 100,}}
                        // onPress={() => actionSheetAvatar.current.show()}
                        // onPress={handleOpenPress}
                    >
                        <Image
                            source={!profile.avatar ? require('../Icon/backgroundEdit.png') : {uri: profile.avatar}}
                            resizeMode='cover'
                            style={{width: '100%', height: '100%', borderRadius: 80}}
                        ></Image>
                        
                    </TouchableOpacity>
                </View>
                {/*  */}
                <View style={{backgroundColor: '#fff', zIndex: -1, alignItems: 'center'}}>
                    <View style={{marginTop: '16%', width: '95%', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{profile.userName}</Text>
                            {profile.isAdmin ? 
                                <Image
                                    source={require('../Icon/checkBlueFB.png')}
                                    resizeMode='contain'
                                    style={{width: 25, height: 25, marginLeft: 5}}
                                ></Image> : null
                            }
                        </View>
                        {/* <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
                            <Text style={{fontWeight: 'bold'}}>null </Text>
                            <Text style={{color: '#666569'}}>Bạn bè</Text>
                        </View> */}
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
                                    source={require('../../assets/testSong.png')}
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
                                    source={require('../Icon/ChamLung.png')}
                                    resizeMode='contain'
                                    style={{width: 30, height: 30}}
                                ></Image>
                            </TouchableOpacity>
                            <Image
                                    source={require('../Icon/play.png')}
                                resizeMode='contain'
                                style={{width: 20, height: 20, position: 'absolute', left: 2, top: 2}}
                            ></Image>
                        </View>
                        {/* check Freind */}
                        <View style={{width: '100%', marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            {checkRequest === null ? 
                                <TouchableOpacity 
                                    style={{width: '40%', height: 40, backgroundColor: '#0865fe', justifyContent: 'center', alignItems: 'center', borderRadius: 10, flexDirection: 'row'}}
                                    onPress={addFriend}
                                >
                                    <Image
                                        source={require('../Icon/addFriendWhite.png')}
                                        resizeMode='contain'
                                        style={{width: 20, height:20}}
                                    ></Image>
                                    <Text style={{fontWeight: 'bold', color: '#fff', marginLeft: 5}}>Thêm bạn bè</Text>
                                </TouchableOpacity> 
                                : checkRequest === 'isRequested' ?
                                <TouchableOpacity 
                                    style={{width: '40%', height: 40, backgroundColor: '#0865fe', justifyContent: 'center', alignItems: 'center', borderRadius: 10, flexDirection: 'row'}}
                                    onPress={handleOpenPress}
                                >
                                    <Image
                                        source={require('../Icon/userCheck.png')}
                                        resizeMode='contain'
                                        style={{width: 20, height:20}}
                                    ></Image>
                                    <Text style={{fontWeight: 'bold', color: '#fff', marginLeft: 5}}>Phản hồi</Text>
                                </TouchableOpacity> 
                                : checkRequest === 'friend' ? 
                                <TouchableOpacity 
                                    style={{width: '40%', height: 40, backgroundColor: '#0865fe', justifyContent: 'center', alignItems: 'center', borderRadius: 10, flexDirection: 'row'}}
                                >
                                    <Image
                                        source={require('../Icon/addFriendWhite.png')}
                                        resizeMode='contain'
                                        style={{width: 20, height:20}}
                                    ></Image>
                                    <Text style={{fontWeight: 'bold', color: '#fff', marginLeft: 5}}>Bạn bè</Text>
                                </TouchableOpacity> 
                                : 
                                <TouchableOpacity 
                                    style={{width: '40%', height: 40, backgroundColor: '#0865fe', justifyContent: 'center', alignItems: 'center', borderRadius: 10, flexDirection: 'row'}}
                                    onPress={() => setModalVisible(true)}
                                >
                                    <Image
                                        source={require('../Icon/addFriendWhite.png')}
                                        resizeMode='contain'
                                        style={{width: 20, height:20}}
                                    ></Image>
                                    <Text style={{fontWeight: 'bold', color: '#fff', marginLeft: 5}}>Hủy lời mời</Text>
                                </TouchableOpacity> 
                            }
                            <TouchableOpacity
                                style={{width: '34%', height: 40, backgroundColor: '#e4e6eb', borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginHorizontal: 10}}
                            >
                                <Image
                                    source={require('../Icon/messageBlack.png')}                                        
                                    resizeMode='contain'
                                    style={{width: 20, height: 20}}
                                ></Image>
                                <Text style={{fontWeight: 'bold', marginLeft: 6}}>Nhắn tin</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{backgroundColor: '#e4e6eb', height: 40, width: '18%', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginLeft: 6}}
                            >
                                <Image
                                    source={require('../Icon/ChamLung.png')}                                        
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
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ backgroundColor: '#fff', padding: 14, top: '45%', width: '80%', left: '10%', borderRadius: 10}}>
                <Text style={{textAlign: 'center', fontSize: 18, fontWeight: '600', marginBottom: 25}}>Hủy lời mời kết bạn</Text>
                <View style={{width: '100%', borderTopWidth: 1, borderColor: '#cfcfd1'}}></View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: 40, alignItems: 'center'}}>
                    <TouchableOpacity
                        style={{justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%', borderRightWidth: 1, borderColor: '#cfcfd1'}}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={{color: '#0761ce', fontSize: 16, fontWeight: '600'}}>Đóng</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={{justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%', }}
                        onPress={fetchDeleteRequest}
                    >
                        <Text style={{color: '#0761ce', fontSize: 16, fontWeight: '600'}}>Hủy yêu cầu</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>
            {modalVisible ? 
                <View style={styles.dimmedBackground}></View> : null
            }
            
                <BottomSheet 
                    ref={bottomSheetRefRequred} 
                    // index={0} 
                    snapPoints={snapPointsRequred} 
                    style={{zIndex: 2}} 
                    onChange={(index) => {index != 0 ? setIsBottomSheetAvatar(true) : setIsBottomSheetAvatar(false)}}
                    handleIndicatorStyle={{backgroundColor: '#c9ccd2'}}
                >
                    <View style={{paddingHorizontal: 20}}>
                        <TouchableOpacity
                            style={{width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', marginBottom: 15}}
                            onPress={fetchAcceptFriend}
                        >
                            <View style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e4e6eb', borderRadius: 40}}>
                                <Image
                                    source={require('../Icon/userCheckBlack.png')}
                                    resizeMode='contain'
                                    style={{width: '60%', height: '60%'}}
                                ></Image>
                            </View>
                            <Text style={{fontWeight: '600', fontSize: 16, paddingHorizontal: 10}}>Xác nhận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', marginBottom: 15}}
                            onPress={fetchDeleteRequestt}
                        >
                            <View style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e4e6eb', borderRadius: 25}}>
                                <Image
                                    source={require('../Icon/xMarkBlack.png')}
                                    resizeMode='contain'
                                    style={{width: '60%', height: '60%'}}
                                ></Image>
                            </View>
                            <Text style={{fontWeight: '600', fontSize: 16, paddingHorizontal: 10}}>Xóa</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheet>
        </SafeAreaView>
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
        // flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        height: '200%',
        width: '100%',
        zIndex: 1
    },
})