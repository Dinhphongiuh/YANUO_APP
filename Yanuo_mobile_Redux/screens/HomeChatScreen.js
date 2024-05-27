import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback, ScrollView, PanResponder, ActivityIndicator} from 'react-native';
import { parse, format, differenceInMinutes, differenceInHours, getDay } from 'date-fns';
import { useContext, useEffect, useRef, useState } from 'react';
import { setOpenDropMenu } from '../redux/slices/HomeScreenSlice';
import { useDispatch, useSelector } from 'react-redux';
import client from '../api/client';
import { addNewFriendRequest, inviteFriendRequest } from '../redux/slices/friendSlice';
import { userChats } from '../api/ChatRequests';
import { getConversition } from '../api/MessageRequests'; 
import TimeAgo from 'react-native-timeago';
import {io} from 'socket.io-client';
import { getUser } from '../api/UserRequests';
import { useMessage } from './context/chatContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { getSocket } from '../utils/socketClient';
import {Host} from 'react-native-portalize';
import { REACT_APP_API_URL } from '../constants';
import { useSocket } from './context/socketContext';
import { getSocket } from '../utils/socketClient';

const {height ,width} = Dimensions.get('window');
export default function HomeChat({navigation}) {
    const openDropMenu = useSelector(state => state.homeScreenSlice.openDropMenu);

    const data = [
        {'image': require('../assets/test.png'), "userName": "user1", "message": "ok chưa", "unreadmessages": 0, "timeSend": '5/2/2024, 17:07:47', "role": "group"},
        {'image': require('../assets/test.png'), "userName": "user2", "message": "Có gì đó không ổn?", "unreadmessages": 5, "timeSend": '6/2/2024, 12:30:15', "role": "user"},
        {'image': require('../assets/test.png'), "userName": "user3", "message": "Hôm nay thời tiết thế nào?", "unreadmessages": 1, "timeSend": '7/2/2024, 09:45:32', "role": "user"},
        {'image': require('../assets/test.png'), "userName": "user4", "message": "Bạn đã ăn sáng chưa?", "unreadmessages": 20, "timeSend": '8/2/2024, 20:15:59', "role": "group"},
        {'image': require('../assets/test.png'), "userName": "user5", "message": "Chúc bạn một ngày tốt lành!", "unreadmessages": 0, "timeSend": '9/2/2024, 14:28:47', "role": "user"},
        {'image': require('../assets/test.png'), "userName": "user5", "message": "Chúc bạn một ngày tốt lành!", "unreadmessages": 0, "timeSend": '9/2/2024, 14:28:47', "role": "user"},
        {'image': require('../assets/test.png'), "userName": "user5", "message": "Chúc bạn một ngày tốt lành!", "unreadmessages": 0, "timeSend": '9/2/2024, 14:28:47', "role": "user"},
        {'image': require('../assets/test.png'), "userName": "user5", "message": "Chúc bạn một ngày tốt lành!", "unreadmessages": 0, "timeSend": '9/2/2024, 14:28:47', "role": "user"},
        {'image': require('../assets/test.png'), "userName": "user5", "message": "Chúc bạn một ngày tốt lành!", "unreadmessages": 0, "timeSend": '9/2/2024, 14:28:47', "role": "user"},
    ];

    function compareDateTime(timeSendString) {
        const currentTime = new Date().toLocaleString();
        
        // Chuyển đổi chuỗi thời gian thành đối tượng Date
        const timeSend = parse(timeSendString, 'd/M/yyyy, HH:mm:ss', new Date());
        const currentDate = parse(currentTime, 'd/M/yyyy, HH:mm:ss', new Date());
    
        // So sánh ngày
        if (timeSend.getDate() !== currentDate.getDate()) {
            // Kiểm tra xem thời điểm hiện tại và thời điểm đã gửi có cách nhau ít hơn 1 tuần không
            if (differenceInMinutes(currentDate, timeSend) < 7 * 24 * 60) {
                // Lấy ngày trong tuần của thời gian gửi
                const dayOfWeek = getDay(timeSend);
    
                // Trả về thứ
                return format(timeSend, "EEEE");
            } else {
                // Trả về ngày đầy đủ
                return format(timeSend, "d/M/yyyy");
            }
        } else {
            // So sánh thời gian
            const diffMinutes = differenceInMinutes(currentDate, timeSend);
            if (diffMinutes < 60) {
                // Trả về số phút
                return `${diffMinutes} P`;
            } else {
                // Tính số giờ
                const diffHours = differenceInHours(currentDate, timeSend);
                if (diffHours < 24) {
                    // Trả về số giờ
                    return `${diffHours} giờ`;
                } else {
                    // Trả về ngày trong tuần
                    return format(timeSend, "EEEE");
                }
            }
        }
    }
    
    // Sử dụng hàm so sánh thời gian
    // const timeSendString = '7/3/2024, 13:07:47';
    // console.log(compareDateTime(timeSendString)); // Ví dụ về cách sử dụng

    // role: user, group, system, ads neu la group co icon group trước userName

    const scrollViewRefs = useRef([]);

  // Hàm để xử lý việc cuộn mới bắt đầu
    const handleScroll = (index) => {
    // Lặp qua tất cả các ScrollView và reset vị trí nếu không phải là ScrollView hiện tại
        scrollViewRefs.current.forEach((ref, idx) => {
                if (idx !== index && ref) {
                    ref.scrollTo({ x: 0, y: 0, animated: true });
                }
            });
    };
    
    const handleHorizontalScroll = (event, index) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        if (offsetX < 0) {
            scrollViewRefs.current[index].scrollTo({ x: 0, animated: false });
        }
    };

    const tranlate_x = useRef(new Animated.Value(1)).current;

    const mess = () => {
        console.log("ok");
        Animated.timing(tranlate_x, {
            // toValue: 30,
            toValue: 0,
            duration: 100,
            useNativeDriver: false
        }).start();
    };

    // friend
    const dispatch = useDispatch();
    const profile = useSelector(state => state.meSlice.userProfile);
    // const [friendRequest, setFriendRequests] = useState([]);
    const fetchFriendRequest = async() => {
        try
        {
            const res = await client.get(`/friend-requests/${profile._id}`);
            if (res.data.success)
            {
                // console.log('csd', res.data.requestsData);
                // setFriendRequests(res.data.requestsData);
                dispatch(addNewFriendRequest(res.data.requestsData));
                // dispatch(inviteFriendRequest([{'dsđ': 'đas'}]))
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
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchFriendRequest();
        };
    
        fetchData();
    }, []); 

    // chat
    // const socket = useRef();
    const socket = getSocket(profile._id);
    // console.log('tesstasc', socket);
    // const {socket, onlineUsers} = useSocket();
    console.log('asdasd', socket);
    // const {socket} = useMessage();
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const {sendMessage, setSendMessage} = useMessage();
    const {receiveMessage, setReceiveMessage} = useMessage();
    const [conversition, setConversition] = useState([]);
    
    // console.log('convvv', conversition);
    // socket
    useEffect(() => {
        socket.current = io(REACT_APP_API_URL);
        socket.current.emit("new-user-add", profile._id);
        socket.current.on('get-users', (users) => {
            setOnlineUsers(users);
            console.log('online: ', onlineUsers);
        })
    }, [profile])
    // console.log('eeee: ', sendMessage);
    // send message to socket server
    // useEffect(() => {
    //     if (sendMessage != null)
    //     {
    //         socket.current.emit('send-messege', sendMessage)
    //     }
    // }, [sendMessage])

    // const [demorecei, setDemorecei] = useState(null);
    //  // receive Message from socketServer
    // useEffect(() => {
    //     socket.current.on("receive-message", (data) => {
    //         setDemorecei(data);
    //         setReceiveMessage(data);
    //     })
    // }, []);
    // console.log(demorecei);

    // console.log('cur:1 ', profile);
    // console.log('online1: ', onlineUsers);

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
    }, [profile._id, conversition,]);

    const [otherMemberIds, setOtherMemberIds] = useState([]);
    useEffect(() => {
        chats.forEach(chat => {
            if (chat.members.includes(profile._id)) {
              const otherId = chat.members.find(memberId => memberId !== profile._id);
              if (otherId) {
                otherMemberIds.push(otherId);
              }
            }
          });
    }, [chats, profile._id]);
    
    // console.log('chatssd: ', conversition);
    // lấy thông tin tin nhắn
    useEffect(() => {
        const fetchConversition = async () => {
            try
            {
                const res = await getConversition(profile._id);
                // console.log('xx::', res.data);
                setConversition(res.data)
            }
            catch (error)
            {
                console.log(error);
            }
        };
        fetchConversition();
        socket.current.on("receive-message", (data) => {
            // Cập nhật state khi nhận được tin nhắn mới
            fetchConversition();
        });
    }, [profile._id])

    // useEffect(() => {
    //     const fetchConversition = async () => {
    //         try
    //         {
    //             const res = await getConversition(profile._id);
    //             console.log('xx::', res.data);
    //             setConversition(res.data)
    //         }
    //         catch (error)
    //         {
    //             console.log(error);
    //         }
    //     };
    //     fetchConversition();x``
    //     socket.current.on("send-mess-with-listFR", (data) => {
    //         // Cập nhật state khi nhận được tin nhắn mới
    //         fetchConversition();
    //     });
    // }, [])
    
    console.log('chatsId: ', conversition);
 

    // checkOnlineStatus
    const checkOnlineStatus = (chat) => {
        const chatMember = chat.members.find((members) => members !== profile._id);
        const online = onlineUsers.find((user) => user.userId === chatMember);
        // console.log('đ', chat.members)
        return online ? true : false;
    }

    // open Chat
    const handleChatOpen = (chat) =>
    {
        //chat.chatId
        const selectedChat = chats.find(c => c._id === chat.chatId)
        setCurrentChat(selectedChat);
        const otherMemberId = selectedChat.members.find(memberId => memberId !== profile._id);
        console.log('ottt', selectedChat.members);
        if (selectedChat.type === 'group')
        {
            let groupName = selectedChat.groupName;
            const otherMemberIds = selectedChat.members.filter(memberId => memberId !== profile._id);
            console.log('olsr', otherMemberIds);
            
            return !openDropMenu ? navigation.push('ChatSCR', {chat :selectedChat, currentUser: profile._id, setSendMessage, receiveMessage: {receiveMessage}, memberId: otherMemberIds, socket: socket, sendMessage: sendMessage, setReceiveMessage}) : dispatch(setOpenDropMenu(!openDropMenu));;
        }
        return !openDropMenu ? navigation.push('ChatSCR', {chat :selectedChat, currentUser: profile._id, setSendMessage, receiveMessage: {receiveMessage}, memberId: otherMemberId, socket: socket, sendMessage: sendMessage, setReceiveMessage, setCon: setConversition}) : dispatch(setOpenDropMenu(!openDropMenu));;
    }

    // console.log('cadad', conversition);

    return (
        // <Host>
            <SafeAreaView style={styles.container}>
                {/* <ActivityIndicator
                    style={{width: '100%'}}
                    animating={false}
                ></ActivityIndicator> */}
                {/* <View style={{width: width, height: 60, backgroundColor: 'red', position: 'absolute', top: 0}}></View> */}
                {conversition.map((item, index) => (
                    <Animated.ScrollView
                        key={index}
                        ref={(ref) => (scrollViewRefs.current[index] = ref)}
                        // style={{width: '95%', height: 70, justifyContent: 'flex-start',alignItems: 'center', marginBottom: 15}}
                        style={{width: '97%', height: 80, marginBottom: 0, marginTop: 0, transform: [{translateX: tranlate_x}]}}
                        horizontal={true}
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollBegin={() => handleScroll(index)}
                        onScroll={(event) => handleHorizontalScroll(event, index)}
                        // scrollEventThrottle={16}
                    >
                        <TouchableOpacity 
                            delayLongPress={1500}
                            onLongPress={mess}
                            style={{flexDirection: 'row', width: width - 10, height: '100%', justifyContent: 'space-between', alignItems: 'center',}}  
                            // onPress={() => navigation.push('ChatSCR')}
                            onPress={() => handleChatOpen(item)}
                        >
                        <View style={{width: '20%'}}>
                            {item.members.length > 2 ? 
                            <Image
                            source={{uri: item.groupAvatar}}
                            resizeMode='cover'
                            style={styles.userImage}
                        ></Image> :
                            <Image
                                source={{uri: item.avatar}}
                                resizeMode='cover'
                                style={styles.userImage}
                            ></Image>
                            }
                            {/* online Status */}
                            <View style={[checkOnlineStatus(item) ? styles.onlineStatus : null]}></View>
                        </View>
                        <View style={{justifyContent: 'flex-start', width: '55%', paddingLeft: 10}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                                {item.members.length > 2 ? 
                                    <View style={{width: 25, height: 20, backgroundColor: '#e2f0f3', justifyContent: 'center', alignItems: 'center', marginRight: 10, borderRadius: 5}}>
                                        <Image
                                            source={require('./Icon/groupIcon.png')}
                                            style={{width: 22, height: 18, backgroundColor: '#e2f0f3'}}
                                            resizeMode='contain'
                                        ></Image>
                                    </View> : null
                                }
                                {item.members.length > 2 ? 
                                    <Text 
                                        numberOfLines={1}
                                        ellipsizeMode='tail'
                                        style={styles.userText}>{item.groupName}
                                        </Text> :
                                    <Text 
                                        numberOfLines={1}
                                        ellipsizeMode='tail'
                                        style={styles.userText}>{item.userName}
                                    </Text>
                                }
                            </View>
                            {item.type === 'group' ? 
                                <Text 
                                    numberOfLines={1}
                                    ellipsizeMode='tail'
                                    style={[styles.messagerText, {color: item.unreadmessages > 0 ? '#212121' : '#7e8389', fontWeight: item.unreadmessages > 0 ? '500' : '300'}]}
                                >
                                    {item.text ? `${item.senderUserName}: ${item.text}` : '[Hình ảnh]'}
                                </Text> 
                                :
                                <Text 
                                    numberOfLines={1}
                                    ellipsizeMode='tail'
                                    style={[styles.messagerText, {color: item.unreadmessages > 0 ? '#212121' : '#7e8389', fontWeight: item.unreadmessages > 0 ? '500' : '300'}]}
                                >
                                    {/* {item.type === 'text' ? item.text : '[Hình ảnh]'} */}
                                    {item.type === 'text' ? item.text : '[Hình ảnh]'}
                                </Text>
                            }
                        </View>
                        <View style={{width: '26%', justifyContent: 'center', alignItems: 'center'}}>
                            {/* <Text>{compareDateTime(item.lastMessageTime)}</Text> */}
                            <Text><TimeAgo time={item.lastMessageTime} hideAgo></TimeAgo></Text>
                            {/* undline tin nhắm chưa đọc */}
                            <View style={{backgroundColor: '#ee4f47', borderRadius: 10, width: 25}}>
                                {item.unreadmessages > 0 ? 
                                    <Text style={{textAlign: 'center', color: '#fff6f4'}}>{item.unreadmessages > 10 ? 'N' : item.unreadmessages}</Text> : null
                                }
                            </View>
                        </View>
                        </TouchableOpacity>
                        <View style={{width: width, position: 'absolute', bottom: 0, justifyContent: 'flex-end'}}>
                            <View style={{width: '80%', position: 'absolute', bottom: 0, borderBottomWidth: 1, right: 0, borderColor: '#ededed'}}></View>
                        </View>
                        <ScrollView
                            style={{width: width / 1.6, height: 80}}
                        >
                            <View style={{width: '100%', height: 'auto', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TouchableOpacity
                                    style={{backgroundColor: '#909aa4', width: '33.40%', height: 80, justifyContent: 'center', alignItems: 'center'}}
                                >
                                    <Image
                                        source={require('./Icon/dsIcon.png')}
                                        resizeMode='contain'
                                        style={{width: '30%', height: '30%'}}
                                    ></Image>
                                    <Text style={{color: '#fbfcff', fontSize: 12, padding: 4, fontWeight: 400}}>Thêm</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{backgroundColor: '#4752bb', width: '33.33%', height: 80, justifyContent: 'center', alignItems: 'center'}}
                                >
                                    <Image
                                        source={require('./Icon/pinIcon.png')}
                                        resizeMode='contain'
                                        style={{width: '30%', height: '30%'}}
                                    ></Image>
                                    <Text style={{color: '#fbfcff', fontSize: 12, padding: 4, fontWeight: 400}}>Ghim</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{backgroundColor: '#f04e49', width: '33.33%', height: 80, justifyContent: 'center', alignItems: 'center'}}
                                >
                                    <Image
                                        source={require('./Icon/delIcon.png')}
                                        resizeMode='contain'
                                        style={{width: '30%', height: '30%'}}
                                    ></Image>
                                    <Text style={{color: '#fbfcff', fontSize: 12, padding: 4, fontWeight: 400}}>Xóa</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Animated.ScrollView>
                ))}
            </SafeAreaView>
        // </Host>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    //   backgroundColor: '#009ef9',
    },
    userImage:
    {
        width: '80%',
        height: '75%',
        borderRadius: 500
    },
    userText:{
        fontSize: 18,
        fontWeight: '600'
    },
    messagerText: {
        fontSize: 16,
        // color: '#7e8389',
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