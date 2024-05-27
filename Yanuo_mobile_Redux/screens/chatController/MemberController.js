import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback, ScrollView, PanResponder, ActivityIndicator, Modal, TextInput} from 'react-native';
import { getUser } from '../../api/UserRequests';
import {useSelector} from 'react-redux';
import BottomSheet from '@gorhom/bottom-sheet';
import {GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from '../../api/client';

 
const {height, width} = Dimensions.get('window');
export default function App({navigation, route}) {
    const profile = useSelector(state => state.meSlice.userProfile);   
    const chat = route.params.chat;
    // console.log(chat.isAdmin);
    const [membersInfo, setMemberInfo] = useState([]);

    const [activeTab, setActiveTab] = useState(0);
    const indicatorPosition = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef();

    const handleTabPress = (index) => {
        setActiveTab(index);
        scrollViewRef.current.scrollTo({ x: width * index, animated: true });
        Animated.spring(indicatorPosition, {
          toValue: index * (width / 2),
          useNativeDriver: false,
        }).start();
    };
    const handleScroll = (event) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        const selectedTab = Math.round(scrollX / width);
        if (selectedTab !== activeTab) {
          setActiveTab(selectedTab);
          Animated.spring(indicatorPosition, {
            toValue: selectedTab * (width / 6),
            useNativeDriver: false,
          }).start();
        }
    };

    useEffect(() => {
        const fetchMemberInfo = async() => {
            try
            {
                const membersInfoTemp = [];
                for (const memberId of chat.members)
                {
                    const res = await getUser(memberId);

                    membersInfoTemp.push(res.data.user);
                }

                setMemberInfo(membersInfoTemp);
            }
            catch (error)
            {
                console.log(error);
            }

        }
        fetchMemberInfo();
    }, [])

    // bottom sheet
    const [selectedUser, setSelectedUser] = useState('');
    const [isBottomSheetAvatar, setIsBottomSheetAvatar] = useState(false);
    const snapPoints = useMemo(() => ['1%', '30%', '90%',], []);
    const bottomSheetRefAvatar = useRef(null);
    // const handleClosePress = () => bottomSheetRefAvatar.current?.close();
    const handleClosePress = () => 
    {
        bottomSheetRefAvatar.current?.snapToIndex(0);
        // setSelectedUser(null);
    }
    const handleOpenPress = (userInfo) => {
        setSelectedUser(userInfo);
        console.log(selectedUser);
        bottomSheetRefAvatar.current?.snapToIndex(1);
        setIsBottomSheetAvatar(true);
    };

    // xoá thành viên
    const removeMember = async (memberId) => {
        const storedToken = await AsyncStorage.getItem('token');
        try {
          const response = await client.post('/chat/group/removeMember', {
            chatId: chat._id,
            memberId: memberId
          }, {
            headers: {
              // Thêm token xác thực nếu cần
              Authorization: `JWT ${storedToken}`
            }
          });
          console.log(response.data);
          if (response.data.success)
          {
            setMembers(members => members.filter(member => member !== memberId));  
          }
          // Xử lý kết quả trả về từ server
        } catch (error) {
          console.error(error);
          // Xử lý lỗi
        }
    };

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaView style={styles.container}>
                {/* header */}
                <View style={{width: '100%', height: 45, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity
                            style={{marginHorizontal: 15}}
                            onPress={() => navigation.goBack()}
                        >
                            <Image
                                source={require('../Icon/BackIcon.png')}
                                resizeMode='contain'
                                style={{width: 30, height: 30}}
                            ></Image>
                        </TouchableOpacity>
                        <Text style={{color: '#fff', fontSize: 18, fontWeight: '600'}}>Thành viên</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity
                            style={{marginHorizontal: 15}}
                        >
                            <Image
                                source={require('../Icon/Search114.png')}
                                style={{width: 25, height: 25}}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Content */}
                <View style={{width: '100%', height: '100%', backgroundColor: '#fff', alignItems: 'center', paddingTop: 10}}>
                    <View style={{width: '90%', height: 40, flexDirection: 'row'}}>
                        <TouchableOpacity
                            style={{marginRight: 14}}
                        >
                            <Text>Tất cả</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text>Đã mời</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '90%', backgroundColor: '#e0e0e0', height: 1}}>
                        <Animated.View style={{borderWidth: 1, borderColor: '#006cf5', width: '10%', position: 'absolute', left: indicatorPosition}}></Animated.View>
                    </View>
                    <ScrollView
                        style={{}}
                        horizontal
                        pagingEnabled
                        snapToInterval={width}
                        decelerationRate={'fast'}
                        ref={scrollViewRef}
                        scrollEventThrottle={16}
                        onScroll={handleScroll}
                    >
                        <View style={[styles.page, { backgroundColor: '#fff' }]}>
                            <ScrollView
                                style={{ width: '90%'}}
                            >
                                <View style={{width: '90%'}}>
                                    <View style={styles.colSw}>
                                        <Text style={{color: '#009ef9'}}>Thành viên {`(${chat.members.length})`}</Text>
                                    </View>
                                </View>
                                {membersInfo.map((item, index) => (
                                    <TouchableOpacity
                                        style={{width: '100%', height: 45, marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between'}}
                                        onPress={() => handleOpenPress(item)}
                                        key={index}
                                    >
                                        <View style={{height: 45, width: 45, borderRadius: 40, backgroundColor: 'pink'}}>
                                            <Image
                                                source={{uri: item.avatar}}
                                                resizeMode='cover'
                                                style={{width: '100%', height: '100%', borderRadius: 45}}
                                            ></Image>
                                        </View>
                                        <View style={{width: '70%', justifyContent: 'center', marginLeft: 15, alignItems: 'flex-start'}}>
                                            <Text style={{fontSize: 18, fontWeight: '600'}}>{item.userName}</Text>
                                            {item._id === chat.isAdmin ? 
                                                <Text style={{color: '#ccc'}}>Trưởng nhóm</Text> : null
                                            }
                                        </View>
                                        {item._id === profile._id ? 
                                        null :
                                        <TouchableOpacity
                                            style={{width: 24, height: 24, justifyContent: 'center', alignItems: 'center'}}
                                        >
                                            <Image
                                                source={require('../Icon/AddUserIcon.png')}
                                                resizeMode='contain'
                                                style={{width: '100%', height: '100%'}}
                                            ></Image>
                                        </TouchableOpacity>
                                        }
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                        <View style={[styles.page, { backgroundColor: 'powderblue' }]}>

                        </View>
                    </ScrollView>
                </View>
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
                    <View style={{width: '100%', alignItems: 'center', borderBottomWidth: 1, borderColor: '#dedede'}}>
                        <Text style={{fontSize: 16, paddingBottom: 12, fontWeight: '600'}}>Thông tin thành viên</Text>
                    </View>
                    <View style={{width: '100%'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', margin: 16, alignItems: 'center'}}>
                                <Image
                                    source={{uri: selectedUser.avatar}}
                                    resizeMode='cover'
                                    style={{width: 50, height: 50, borderRadius: 50}}
                                ></Image>
                                <Text style={{fontSize: 16, marginHorizontal: 14, fontWeight: '600'}}>{selectedUser.userName}</Text>
                            </View>
                            <View style={{flexDirection: 'row', margin: 16, alignItems: 'center'}}>
                                <TouchableOpacity
                                    style={{width: 35, height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: '#dedede', borderRadius: 30, marginHorizontal: 12}}
                                >
                                    <Image
                                        source={require('../Icon/callIcon.png')}
                                        style={{width: '80%', height: '80%'}}
                                        resizeMode='contain'
                                    ></Image>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{width: 35, height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: '#dedede', borderRadius: 30}}
                                >
                                    <Image
                                        source={require('../Icon/messagerNoActiveIcon.png')}
                                        style={{width: '80%', height: '80%'}}
                                        resizeMode='contain'
                                    ></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={{marginHorizontal: 16}}>
                            <Text style={{fontSize: 16, fontWeight: '500'}}>Xem trang cá nhân</Text>
                        </TouchableOpacity>
                        {chat.isAdmin === profile._id ? 
                            <TouchableOpacity 
                                style={{marginHorizontal: 16, marginTop: 20}}
                                onPress={() => removeMember(selectedUser._id)}
                            >
                                <Text style={{fontSize: 16, fontWeight: '500', color: 'red'}}>Xoá khỏi nhóm</Text>
                            </TouchableOpacity> : null
                        }
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
      backgroundColor: '#009ef9',
    },
    page: {
        width: width,
        // justifyContent: 'center',
        alignItems: 'center',
        height: height
    },
    colSw: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center', 
        // backgroundColor: 'red'
        marginTop: 10,
    },
    dimmedBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        position: 'absolute',
        height: '100%',
        width: '100%'
    },
});