import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, StatusBar, TextInput } from 'react-native';
import client from '../../api/client';
import {useSelector} from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createChat, findChat, userChats } from '../../api/ChatRequests';
import { useMessage } from '../context/chatContext';
import {io} from 'socket.io-client';
import { getSocket } from '../../utils/socketClient';


const {height, width} = Dimensions.get('window');
export default function App({navigation}) {
    const profile = useSelector(state => state.meSlice.userProfile);   
    const [listFriend, setListFriend] = useState([]);
    // getList Friend
    const fetchListFriend = async() => {
        const storedToken = await AsyncStorage.getItem('token');
        try {
            const res = await client.get('/friends', {
                headers: {
                    Authorization: `JWT ${storedToken}`
                },
                params: {
                    _id: profile._id
                }
            });
            // console.log(res.data.);
            if (res.data.success)
            {
                setListFriend(res.data.data)
            }
        }
        catch (error)
        {
            
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchListFriend();
        };
    
        fetchData();
    }, []);

    
    const findFriend = async(phoneNumber) => {
        try
        {
            const res = await client.get(`/search/${phoneNumber}`);
            if (res.data.success)
            {
                const profile = res.data.user;
                // if (profile.phoneNumber === myProfile.phoneNumber)
                // {
                    //     navigation.push('ProfileSCR');
                    // }
                    // else
                    navigation.push('UserProfileSCR', {profile: profile});
                }
                else
                {
                    // console.log("số điện thoại này chưa tham gia Yanuo")
                    // setModalVisible(true);
                }
            }
            catch (error)
            {
                console.log(error.message);
            }
    }
    
    // chat
    // const socket = useRef();
    const socket = getSocket(profile._id);
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const {sendMessage, setSendMessage} = useMessage();
    const {receiveMessage, setReceiveMessage} = useMessage();
    // socket
    useEffect(() => {
        // socket.current = io(REACT_APP_API_URL);
        socket.current.emit("new-user-add", profile._id);
        socket.current.on('get-users', (users) => {
            setOnlineUsers(users);
            console.log('online: ', onlineUsers);
        })
    }, [profile])
    // Get the chat in chat section
    useEffect(() => {
        const getChats = async () => {
        try {
            const { data } = await userChats(profile._id);
            setChats(data);
        } catch (error) {
            console.log(error);
        }
        };
        getChats(); 
    }, [profile._id]);
    // console.log('listFriend', chats);
    // open Chat
    const handleChatOpen = async(_id) =>
    {
        let chat = null;    
        try
        {
            const res = await findChat(profile._id, _id);
            // console.log('tsd', res.data);
            if (res.data !== null)
            {
                chat = res.data;
            }
            else
            {
                console.log('xử lý khi không tìm ra chat');
                chat = null;
            }
        }
        catch (error)
        {
            console.log('lổi cmn r');
            console.log(error);
        }

        if (chat === null)
        {
            try {
                const res = await createChat({senderId: profile._id, receiverId: _id})
                if (res.data !== null)
                {
                    setChats(prevChats => [...prevChats, res.data]);
                    console.log('tsd', chats);
                    chat = res.data;
                    navigation.push('ChatSCR', {chat :chat, currentUser: profile._id, setSendMessage, receiveMessage: {receiveMessage}, memberId: otherMemberId, socket: socket, sendMessage: sendMessage, setReceiveMessage});
                }   
            } catch (error) {
                console.log(error);
            }
        }
        

        console.log('chat nè', chat);
        //chat.chatId
        const selectedChat = chats.find(c => c._id === chat._id)
        // console.log('ss', selectedChat);
        setCurrentChat(selectedChat);
        const otherMemberId = selectedChat.members.find(memberId => memberId !== profile._id);
        // console.log('ottt',otherMemberId);
        navigation.push('ChatSCR', {chat :selectedChat, currentUser: profile._id, setSendMessage, receiveMessage: {receiveMessage}, memberId: otherMemberId, socket: socket, sendMessage: sendMessage, setReceiveMessage});
    }

        return (
            <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'}></StatusBar>
            <View style={{width: '92%', height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity
                    style={{}}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={require('../Icon/ChevronLeft.png')}
                        resizeMode='contain'
                        style={{width: 20, height: 20}}
                    ></Image>
                </TouchableOpacity>
                <Text style={{fontSize: 18, fontWeight: '600'}}>Bạn bè</Text>
                <View></View>
            </View>
            <View style={{width: '92%', marginTop: 15}}>
                <View style={{width: '100%', height: 40, backgroundColor: '#f7f7f7', borderRadius: 20, flexDirection: 'row', alignItems: 'center', padding: 10}}>
                    <Image
                        source={require('../Icon/Search114.png')}
                        resizeMode='contain'
                        style={{width: 20, height: 20}}
                    ></Image>
                    <TextInput
                        placeholder='Tìm kiếm bạn bè'
                        style={{flex: 1, marginLeft: 8, fontSize: 16}}
                    ></TextInput>
                </View>
            </View>
            <View style={{width: '92%', flex: 1, alignItems: 'center', marginTop: 20}}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{width: '100%'}}
                >
                    {/* title */}
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>Null Bạn bè</Text>
                        <TouchableOpacity>
                            <Text style={{fontSize: 18, color: '#0761c9', fontWeight: 'normal'}}>Sắp xếp</Text>
                        </TouchableOpacity>
                    </View>
                    {listFriend.map((item, index) => (
                        <TouchableOpacity 
                            style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}
                            // onPress={() => navigation.push('UserProfileSCR', {profile: item})}
                            onPress={() => findFriend(item.phoneNumber)}
                            key={index}
                        >
                            <View style={{width: 70, height: 70, borderRadius: 70, overflow: 'hidden'}}>
                                <Image
                                    // source={require('../../assets/test.png')}
                                    source={{uri:item.avatar}}
                                    resizeMode='cover'
                                    style={{width: '100%', height: '100%'}}
                                ></Image>
                                {/* <View style={[checkOnlineStatus(item._id) ? styles.onlineStatus : null]}></View> */}
                            </View>
                            <Text style={{flex: 1, marginLeft: 14, fontSize: 16, fontWeight: 'bold'}}>{item.userName}</Text>
                            <TouchableOpacity
                                style={{width: 50, height: 40, backgroundColor: '#e4e6eb', borderRadius: 5, justifyContent: 'center', alignItems: 'center'}}
                                onPress={() => handleChatOpen(item._id)}
                            >
                                <Image
                                    source={require('../Icon/messageBlack.png')}
                                    resizeMode='contain'
                                    style={{width: '50%', height: '50%'}}
                                ></Image>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                    
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
    },
    onlineStatus:{
        width: 14,
        height: 14,
        borderRadius: 10,
        backgroundColor: '#45d750',
        position: 'absolute',
        bottom: 0,
        right: 15,
        borderWidth: 1,
        borderColor: '#ccc'
    }
});