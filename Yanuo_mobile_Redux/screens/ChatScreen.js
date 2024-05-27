import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback, ScrollView, PanResponder, KeyboardAvoidingView, FlatList, Platform, Keyboard, useWindowDimensions, TextInput, Modal} from 'react-native';
import HeaderChatView from './HeaderChat';
import ChatViewBT from './ChatViewBT';
import {useKeyboard} from '@react-native-community/hooks';
import EmojiPicker from '../components/message/emoijs/EmojiPicker';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { userChats } from '../api/ChatRequests';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, deleteOne, getConversition, getMessages, getPinMessage, pinMessage, readMessage, recallMessage, unPinMessage } from '../api/MessageRequests';
import { getUser } from '../api/UserRequests';
import { useMessage } from './context/chatContext';
import MessageButton from './components/MessageButton';
import Message from './messageComponents/Message';

import EmojiLike from './facebookSVG-Emoj/EmojiLike';
import EmojiLove from './facebookSVG-Emoj/EmojiLove';
import EmojiCare from './facebookSVG-Emoj/EmojiCare';
import EmojiHaha from './facebookSVG-Emoj/EmojiHaha';
import EmojiWow from './facebookSVG-Emoj/EmojiWow';
import EmojiSad from './facebookSVG-Emoj/EmojiSad';
import EmojiAngry from './facebookSVG-Emoj/EmojiAngry';
import {MotiView, AnimatePresence} from "moti";
import Backdrop from './components/Backdrop';
import EmojiItem from './components/EmojiItem';
import Hint from './components/Hint';
import {PanGestureHandler } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';  
import * as MediaLibrary from 'expo-media-library';
import PortalView from './messageComponents/ProtalView';
import {Host} from 'react-native-portalize';
import ActionSheet from 'react-native-actionsheet';
import BottomSheet from '@gorhom/bottom-sheet';
import CallAudio from './messageComponents/callAudioSCR';


// import d from '@react-native-community/camerarol'

// import { GestureHandlerRootView } from 'react-native-gesture-handler';

const testMessData = [{
    type: 'text',
    content: {
        text: 'check out this coll picture I took'
    },
    sender: {
        name: 'Jrane',
        avatar: 'https://demoyanuo1.s3.ap-southeast-1.amazonaws.com/6610563c575e7e8334874f0d_profile'
    },
    isSender: false,
    createdAt: '2024-04-18-01T09:40:00Z'
    },
    {
        type: 'image',
        content: {
          imageURL: 'https://demoyanuo1.s3.ap-southeast-1.amazonaws.com/6610563c575e7e8334874f0d_profile',
        },
        sender: {
          name: 'John',
          avatar:
            'https://demoyanuo1.s3.ap-southeast-1.amazonaws.com/6610563c575e7e8334874f0d_profile',
        }
    },
    {
        type: 'text',
        content: {
          text: 'Hey, how are you?',
        },
        sender: {
          name: 'Jane',
          avatar: 'https://demoyanuo1.s3.ap-southeast-1.amazonaws.com/6610563c575e7e8334874f0d_profile',
        },
        isSender: true,
        createdAt: '2024-04-19-01T09:40:00Z',
    },
    {
        type: 'text',
        content: {
          text: 'Hey, how are you?',
        },
        sender: {
          name: 'Jane',
          avatar: 'https://demoyanuo1.s3.ap-southeast-1.amazonaws.com/6610563c575e7e8334874f0d_profile',
        },
        isSender: true,
        createdAt: '2024-04-19-01T09:40:00Z',
    },
    {
        type: 'image',
        content: {
          imageURL: 'https://demoyanuo1.s3.ap-southeast-1.amazonaws.com/6610563c575e7e8334874f0d_profile',
        },
        sender: {
          name: 'John',
          avatar:
            'https://demoyanuo1.s3.ap-southeast-1.amazonaws.com/6610563c575e7e8334874f0d_profile',
        }
    },
]
const {height, width} = Dimensions.get('window');
const items = [
    {emojis: <EmojiLike/>, title: "like", color: "rgb(32, 120, 244)"},
    {emojis: <EmojiLove/>, title: "love", color: "rgb(243, 62, 88)"},
    {emojis: <EmojiCare/>, title: "care", color: "rgb(247, 177, 37)"},
    {emojis: <EmojiHaha/>, title: "haha", color: "rgb(247, 177, 37)"},
    {emojis: <EmojiWow/>, title: "wow", color: "rgb(247, 177, 37)"},
    {emojis: <EmojiSad/>, title: "sad", color: "rgb(247, 177, 37)"},
    {emojis: <EmojiAngry/>, title: "angry", color: "rgb(233, 113, 15)"}
]
export default function Chat({navigation, route}) {
    // chat, currentUser, setSendMessage, recivedMessage
    const profile = useSelector(state => state.meSlice.userProfile);
    // const chat = '';
    const chat = route.params.chat;
    const currentUser = route.params.currentUser;
    const setSendMessage = route.params.setSendMessage;
    // const receiveMessage = route.params.receiveMessage;
    // const anotherName = route.params.memberId;
    const socket = route.params.socket;
    const sendMessage = route.params.sendMessage;
    // const setReceiveMessage = route.params.setReceiveMessage;
    const {receiveMessage, setReceiveMessage} = useMessage();
    // const setConversition = route.params.setConversition;

    const isGroupChat = chat.type === 'group';
    // Lấy danh sách các memberId cho chat nhóm, nếu không phải chat nhóm thì lấy memberId của người dùng khác
    const anotherName = isGroupChat ? chat.groupName : route.params.memberId;
    // console.log('isoeqma', route.params.setCon);
    const setCon = route.params.setCon;
    
    // console.log('dzxs', chat.type);
    // đọc tin nhắn
    useEffect(() => {
        const fetchConversition = async () => {
            try
            {
                const res = await getConversition(profile._id);
                // console.log('xx::', res.data);
                setCon(res.data)
            }
            catch (error)
            {
                console.log(error);
            }
        };
        const readMess = async() => {
            try
            {
                const res = await readMessage({chatId: chat._id, userId: profile._id});
                console.log('kết quả red', res.data);
                // if (res.data.succcess)
                    // awa fetchConversition();
            }   
            catch (error)
            {
                console.log(error);
            }
        }
        readMess();
        fetchConversition();
    }, [chat._id]);

    const [userData, setUserData] = useState('');
    const [messages, setMessages] = useState([]);
    // console.log('check Mess', messages);
    const [replyTo, setReplyTo] = useState(null);
    // console.log('replyd', replyTo);
    const [listPinMessge, setListPinMessage] = useState(null);
    useEffect(() => {
        const fetchPinMessage = async() => {
            try
            {
                const res = await getPinMessage(chat._id);
                // console.log('teczx', res.data);
                if (res.data.success)
                {
                    // console.log('sucaaa', res.data);
                    setListPinMessage(res.data.pinnedMessagesDetails);
                }
                else
                    setListPinMessage([]);
            }
            catch (error)
            {
                console.log(error);
            }
        }
        fetchPinMessage();
    }, []);

    // socket pin
    useEffect(() => {
        const fetchPinMessage = async() => {
            try
            {
                const res = await getPinMessage(chat._id);
                if (res.data.success)
                    setListPinMessage(res.data.pinnedMessagesDetails)
            }
            catch (error)
            {
                console.log(error);
            }
        }

        socket.current.on('receive-pinMessage', (data) => {
            const { receiverId, ...messageData } = data;
            // console.log('checkk re', messageData);
            if (listPinMessge === null)
                fetchPinMessage();
            else
                setListPinMessage(prevListPinMessage => [...prevListPinMessage, messageData]);
        })
    }, []);

    // socket unPin
    useEffect(() => {
        const fetchPinMessage = async() => {
            try
            {
                const res = await getPinMessage(chat._id);
                if (res.data.success)
                    setListPinMessage(res.data.pinnedMessagesDetails)
            }
            catch (error)
            {
                setListPinMessage(null);
                console.log(error);
            }
        }

        socket.current.on('receive-unpinMessage', (data) => {
            // console.log('đang un Pin');
            fetchPinMessage();
        })
    }, []);

     // BottomSheet chuyển tiếp tin nhắn
    const [selectedShareMess, setSelectedShareMess] = useState(null);
    const [conversition, setConversition] = useState([]);
     const [isBottomSheetShareMess, setIsBottomSheetShareMess] = useState(false);
     const snapPoints = useMemo(() => ['1%', '90%', '90%',], []);
     const bottomSheetRefShareMess = useRef(null);
     const handleClosePress = () => 
     {
        setSelectedShareMess(null); 
        bottomSheetRefShareMess.current?.snapToIndex(0);
     }
     const handleOpenPress = async(_id) => {
        // console.log('messAd', _id);
        const selectedMessage = messages.find(item => item._id === _id);
        // console.log('sah' ,selectedMessage);
        setSelectedShareMess(selectedMessage);
        bottomSheetRefShareMess.current?.snapToIndex(1);
        setIsBottomSheetShareMess(true);
        try
        {
            const res = await getConversition(profile._id)
            // if (res.data.success)
            // {
            setConversition(res.data);
            // }
        }
        catch (error)
        {
            console.log(error);
        }
        
    };


    // console.log('pinnn', listPinMessge);
    function BubbleMessage({author, message, mediaUrl, currentUser, _id, senderId, replyMess}) {
        
        // console.log('092321', replyMess);
        let repliedMessage = null;
        const isPinned = listPinMessge && listPinMessge.some(item => item.messageId === _id);
        console.log('sada', isPinned);
        if (replyMess.replyTo)
        {
            // console.log('sadas13', replyMess.replyTo);
            repliedMessage = messages.find(message => message._id === replyMess.replyTo);
            console.log('9713', repliedMessage);
        }
        const handlerecallMessage = async() => {
            console.log(_id);
            const data = {
                messageId: _id,
                senderId: senderId
            }
            try
            {
                const res = await recallMessage(data);
                if (res.data.success)
                {
                    setMessages((prevMessages) => {
                        return prevMessages.map((message) => {
                            if (message._id === _id) {
                                // Nếu tin nhắn có type là "text", cập nhật nội dung
                                if (message.type === "text") {
                                    return { ...message, text: 'Đã thu hồi 1 tin nhắn' };
                                }
                                // Nếu tin nhắn là media, cập nhật nội dung khác
                                else if (message.type === "media") {
                                    return { ...message, text: 'Đã thu hồi 1 file', mediaUrl: [] };
                                }
                            }
                            return message;
                        });
                    });
                }
            }
            catch (error)
            {
                console.log(error);
            }
        }

        const handleDeleteOne = async() => {
            const data = {
                message_id: _id,
                _id: profile._id
            }

            try
            {
                const res = await deleteOne(data);
                if (res.data.success)
                {
                    setMessages(messages.filter(message => message._id !== data.message_id));
                    console.log('delete success');
                }
            }
            catch (error)
            {
                console.log(error);
            }
        }

        handleActionSheetPress = (index) => {
            switch(index)
            {
                case 0: 
                {
                    if (isGroupChat)
                    {
                        const receiverId = chat.members.filter((id) => id !== profile._id);
                        console.log('tesaxChat', receiverId);
                        data = {
                            id: _id,
                            receiverId: receiverId
                        }
                    }
                    else
                    {
                        const receiverId = chat.members.find((id) => id !== profile._id);
                        data = {
                            id: _id,
                            receiverId: receiverId
                        }
                    }
                    console.log('ddqwea', data);
                    socket.current.emit("recall-message", data)
                    handlerecallMessage();
                    break
                }
                case 1: 
                {
                    handleDeleteOne();
                    break;
                }
                default: 
                    break;
            }
        }
        // const meId = chat?.members?.find((id) => id !== currentUser);
        const [current, setCurrent] = useState(null);
        const [show, setShow] = useState(false);
        const [showHint, setShowHint] = useState(false);

        const btnPressHandler = () => {
            setCurrent(null);
            setShow(true);
            setShowHint(false);
        }

        const onClose = () => {
            setShow(false);
            setShowHint(false);
            setCurrent(null);
        }

        const onGesture = (event) => {
            // console.log(event.nativeEvent.absoluteY)
            if (
                event.nativeEvent.absoluteY >= 0 &&
                event.nativeEvent.absoluteY <= 490 &&
                event.nativeEvent.absoluteX >= 16 &&
                event.nativeEvent.absoluteX <= 367
              ) {
                setShowHint(false);
                // when move finger beside any of emoji should select
                const currentItem = Math.floor(event.nativeEvent.x / 50);
                if (currentItem >= 0 && currentItem < items.length) {
                  setCurrent(currentItem);
                } else {
                  setCurrent(null);
                }
              } else {
                setCurrent(null);
                setShowHint(true);
              }
        }

        const gestureEnded = () => {
            setShow(false);
            setShowHint(false);
        };

        const emoijPressHanler = (index) => {
            setShow(false);
            setShowHint(false);
            setCurrent(index);
        }

        useEffect(() => {
            // console.log('133');
            socket.current.on("recall-message-receive", (data) => {
                const { id } = data;
                // console.log('Nhận được', id);
                // Cập nhật state chỉ khi có tin nhắn với _id tương ứng
                setMessages((prevMessages) => {
                    return prevMessages.map((message) => {
                        if (message._id === id) {
                            // Nếu tin nhắn có type là "text", cập nhật nội dung
                            if (message.type === "text") {
                                return { ...message, text: 'Đã thu hồi 1 tin nhắn' };
                            }
                            // Nếu tin nhắn là media, cập nhật nội dung khác
                            else if (message.type === "media") {
                                return { ...message, text: 'Đã thu hồi 1 file', mediaUrl: [] };
                            }
                        }
                        return message;
                    });
                });
            });
            // Xóa event listener khi component unmount hoặc khi messages thay đổi
            // return () => {
            //     socket.current.off("recall-message-receive");
            // };
        }, []); // Dependency array chỉ chứa messages        

        // console.log('texd: ', buttonHeight)
        // ghim tin nhắn
        const handlePinMessage = async() => {
            const data = {
                chatId: chat._id,
                messageId: _id,
                userId: profile._id
            }
            try
            {
                const res = await pinMessage(data);
                // console.log('kkkk', res.data.result);
                if (res.data.success)
                {
                    const res = await getPinMessage(chat._id);

                    setListPinMessage(res.data.pinnedMessagesDetails)
                    
                    // socket
                    if (!isGroupChat)
                    {
                        receiverId = chat.members.find((id) => id !== profile._id);
                    }
                    else
                    {
                        receiverId = chat.members.filter((id) => id !== profile._id);
                    }
                    const data = ({...res.data.pinnedMessagesDetails, receiverId});
                    socket.current.emit("pinMessage", data);
                }
            }
            catch (error)
            {
                console.log(error);
            }
        }

        // bỏ pin
        const handleUnpinMessage = async() => {
            // console.log('đang bỏ pin');

            const data = {
                chatId: chat._id,
                messageId: _id,
            }
            try
            {
                const res = await unPinMessage(data);
                if (res.data.success)
                {
                    // socket
                    if (!isGroupChat)
                    {
                        receiverId = chat.members.find((id) => id !== profile._id);
                    }
                    else
                    {
                        receiverId = chat.members.filter((id) => id !== profile._id);
                    }
                    const data = ({_id, receiverId});
                    socket.current.emit("unPinMessage", data);
                    
                    const res1 = await getPinMessage(chat._id)
                    console.log('ress1', res1.data);
                    // if (!res1.data.success)
                        // setListPinMessage(null)
                    setListPinMessage(res1.data.pinnedMessagesDetails)
                    
                }
            }
            catch (error)
            {
                setListPinMessage(null);
                 // socket
                 if (!isGroupChat)
                 {
                     receiverId = chat.members.find((id) => id !== profile._id);
                 }
                 else
                 {
                     receiverId = chat.members.filter((id) => id !== profile._id);
                 }
                 const data = ({...res.data.pinnedMessagesDetails, receiverId});
                 socket.current.emit("unPinMessage", data);
                console.log(error);
            }
        }

        return (
            <>
            <AnimatePresence>
                {show && (
                <>
                <PanGestureHandler onGestureEvent={onGesture} onEnded={gestureEnded}>
                    <MotiView 
                        style={{position: 'absolute', height: 50, justifyContent: 'center', zIndex: 100, top: -50}} 
                        from={{opacity: 0}} 
                        animate={{opacity: 1}}
                    >
                        <MotiView 
                            style={{alignItems: 'center'}} 
                            from={{translateY: 40, opacity: 1}} 
                            animate={{translateY: 0, opacity: 1}}
                            exit={{translateY: 40, opacity: 0}}
                            transition={{duration: 800}}
                        >
                            <View 
                                style={{ //emojiBox
                                    flexDirection: 'row', 
                                    borderRadius: 33, 
                                    backgroundColor: '#fff', 
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0,
                                    shadowRadius: 1,
                                }}
                            >
                                {items.map((item, index) => (
                                <EmojiItem 
                                    onPress= {() => emoijPressHanler(index)}
                                    key={item.title} data={item} 
                                    index={index} 
                                    scaled={current === index}
                                />
                                ))}
                            </View>
                        </MotiView>
                    </MotiView>
                </PanGestureHandler>
                <PanGestureHandler onGestureEvent={onGesture} onEnded={gestureEnded}>
                    <MotiView 
                        style={{position: 'absolute', height: 50, justifyContent: 'center', zIndex: 100, top: 100}} 
                        from={{opacity: 0}} 
                        animate={{opacity: 1}}
                    >
                        <MotiView 
                            style={{alignItems: 'center'}} 
                            from={{translateY: 40, opacity: 1}} 
                            animate={{translateY: 0, opacity: 1}}
                            exit={{translateY: 40, opacity: 0}}
                            transition={{duration: 800}}
                        >
                            <View 
                                style={{ //emojiBox
                                    // flexDirection: 'row', 
                                    width: 150,
                                    borderRadius: 8, 
                                    backgroundColor: '#fff', 
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0,
                                    shadowRadius: 1,
                                    padding: 10,
                                    // bottom: -19,
                                    position: 'absolute',
                                    left: 0,
                                    zIndex: 100,
                                }}
                            >
                                <View style={{width: '100%', top: -100}}>
                                    <TouchableOpacity
                                        style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, height: 30, borderColor: '#e0e0e0'}}
                                        onPress={() => setReplyTo({messageId: _id, _id: senderId, message: message})}
                                    >
                                        <Text>Trả lời</Text>
                                        <Image
                                            source={require('./Icon/shareDark.png')}
                                            resizeMode='contain'
                                            style={{transform: [{scaleX: -1}], width: 20, height: 20}}
                                        ></Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, height: 30, borderColor: '#e0e0e0'}}
                                    >
                                        <Text>Sao chép</Text>
                                        <Image
                                            source={require('./Icon/coppy.png')}
                                            resizeMode='contain'
                                            style={{transform: [{scaleX: -1}], width: 20, height: 20}}
                                        ></Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, height: 30, borderColor: '#e0e0e0'}}
                                        onPress={() => handleOpenPress(_id)}
                                    >
                                        <Text>Chuyển tiếp</Text>
                                        <Image
                                            source={require('./Icon/shareDark.png')}
                                            resizeMode='contain'
                                            style={{transform: [{scaleX: -1}], width: 20, height: 20}}
                                        ></Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 30}}
                                        onPress={() => !isPinned ? handlePinMessage() : handleUnpinMessage()}
                                    >
                                        <Text style={{color: isPinned ? 'red' : null}}>{!isPinned ? 'Ghim' : 'Bỏ ghim'}</Text>
                                        <Image
                                            source={require('./Icon/pinBlack.png')}
                                            resizeMode='contain'
                                            style={{width: 20, height: 20}}
                                        ></Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 30}}
                                        onPress={() => actionSheet.current.show()}
                                    >
                                        <Text style={{color: 'red'}}>Xoá, thu hồi</Text>
                                        <Image
                                            source={require('./Icon/trashRed.png')}
                                            resizeMode='contain'
                                            style={{transform: [{scaleX: -1}], width: 20, height: 20}}
                                        ></Image>
                                    </TouchableOpacity>
                                    
                                </View>
                            </View>
                        </MotiView>
                    </MotiView>
                </PanGestureHandler>
                </>
            )}           
            </AnimatePresence>
            {show && <Hint hint={showHint}></Hint> }
            {show && <Backdrop onPress={onClose}/> }
            <MessageButton 
                onLongPress={btnPressHandler}
                author={author} 
                text={message} 
                profile={profile} 
                color={current === null ? '#000' : items[current].color}
                emoji={current ? items[current === null ? 0 : current].emojis : null}
                mediaUrl={mediaUrl}
                currentUser={currentUser}
                isGroupChat={isGroupChat}
                navigation={navigation}
                senderId={senderId}
                replyMess={replyMess}
                repliedMessage={repliedMessage}
            ></MessageButton>
                
            </>
            // <TouchableOpacity
            //     style={{
            //         backgroundColor: author === profile._id ? "#d0f0fd" : "#fefefe", 
            //         maxWidth: "80%",
            //         alignSelf: author === profile._id ? 'flex-end' : 'flex-start',
            //         padding: 10,
            //         borderRadius: 10,
            //         borderWidth: 1,
            //         borderColor: '#d7dada',
            //         marginTop: 5
            //     }}
            // >
            //     <Text style={{color: '#121212'}}>{message}</Text>
            // </TouchableOpacity>
        )
    }
    // sen message socket server
    // useEffect(() => {
    //     if (sendMessage !== null)
    //     {
    //         socket.current.emit('send-message', sendMessage)
    //     }
    // }, [sendMessage])
    //   // receive Message from socketServer
    // useEffect(() => {
    //     socket.current.on("receive-message", (data) => {
            
    //     })
    // }, []);
    // rêcive media
    useEffect(() => {
        const fetchMessages = async () => {
            try
            {
                // const {data} = await getMessages(chat._id, profile._id);
                const {data} = await getMessages(chat._id, profile._id);
                // console.log('testt', data)
                setMessages(data);
                // console.log('xx::', data[0].text);
            }
            catch (error)
            {
                console.log(error);
            }
        };
        socket.current.on("receive-media", (data) => {
            // console.log('tesssss', data);
            fetchMessages();
        })
    }, [Chat, messages])

    //

    // const user = useSelector(state => state.meSlice.userProfile);
    // console.log(user)
    // const [chats, setChats] = useState([]);
    // const [currentChat, setCurrentChat] = useState(null);

    // useEffect(() => {
    //     const getChats = async() => {
    //         try
    //         {
    //             const {data} = await userChats(user._id);
    //             setChats(data);
    //             // console.log('ddL: ',data);
    //         }
    //         catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     getChats()
    // }, [user])

    // 

    // 
    // 
    // const [userData, setUserData] = useState('');
    // const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    // console.log('another User: ', userData)

    useEffect(() => {
        if (receiveMessage !== null && receiveMessage.chatId === chat._id)
        {
            setMessages([...messages, receiveMessage])
        }
    }, [receiveMessage])

    // fetch data header
    // console.log('cu: ', navigation.params)
    useEffect(() => {
        // const userId = chat?.members?.find((id) => id !== currentUser);
        const userId = chat?.members?.find((id) => id !== currentUser);
        console.log('s231', userId);
        const getUserData = async() => {
            try
            {
                const res = await getUser(userId);
                if (res.data.success)
                    setUserData(res.data.user);
                    console.log('tsdasd: ',res.data.user)
            }
            catch (error)
            {
                console.log(error);
            }
        };

        if (chat !== null)
            getUserData();
    }, [chat, currentUser]);

    // fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            try
            {
                // const {data} = await getMessages(chat._id);
                const {data} = await getMessages(chat._id, profile._id);
                // console.log('testt', data)
                setMessages(data);
                // console.log('xx::', data[0].text);
            }
            catch (error)
            {
                console.log(error);
            }
        };

        if (chat !== null)
            fetchMessages();
    }, [chat]);
    // console.log('d11: ', messages);  

    // always scroll to last Message
    // useEffect(() => {
    //     scroll.current?.scrollIntoView({behavior: 'smooth'});
    // }, [messages]);

    // receve Message from parent component
    // useEffect(() => {
    //     console.log("Message Arrived: ", recivedMessage)
    //     if (recivedMessage !== null && recivedMessage.chatId === chat._id)
    //     {
    //         setMessages([...messages, recivedMessage]);
    //     }
    // }, [recivedMessage]);

    //demo pick image
    const heightAnim = useRef(new Animated.Value(0)).current;
    const [openImageLib, setOpenImageLib] = useState(null);
    const imagePiOpen = () => {
        Keyboard.dismiss();
        console.log('cccc', openImageLib);
        fetchImages();
        setOpenImageLib(!openImageLib);
        Animated.timing(heightAnim, {
            toValue: openImageLib ? 300 : 0, // Giá trị cuối cùng là 200
            duration: 400, // Thời gian chạy animation là 1000 milliseconds (1 giây)
            useNativeDriver: false // Sử dụng Native driver hay không
        }).start(); // Bắt đầu animation
        setSelectedImages([]);
    };

    // imagePiOpen();
    const [testAlbum, setAlbum] = useState([]);
    
    const fetchImages = async () => {
        // Xin quyền truy cập thư viện máy
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Chúng tôi cần quyền truy cập hình ảnh của bạn!');
            return;
        }
    
        // Lấy tất cả hình ảnh từ thư viện máy
        const album = await MediaLibrary.getAssetsAsync({
            mediaType: 'all', // Chỉ lấy hình ảnh và video
            first: 100
        });
    
        // Lấy URI cục bộ cho mỗi asset và gán vào mảng testAlbum
        const imageArrayPromises = album.assets.map(async (asset) => {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
            return assetInfo.localUri; // Sử dụng localUri thay vì uri
        });
    
        // Đợi tất cả promises hoàn thành
        const imageArray = await Promise.all(imageArrayPromises);
        setAlbum(imageArray); // Cập nhật state
    };
    
    //selected image
    const [selectedImages, setSelectedImages] = useState([]);

    // Hàm để xử lý việc chọn/bỏ chọn hình ảnh
    const handleSelectImage = (uri) => {
        if (selectedImages.includes(uri)) {
            // Nếu hình ảnh đã được chọn, bỏ chọn nó
            setSelectedImages(selectedImages.filter(item => item !== uri));
        } else {
            // Nếu hình ảnh chưa được chọn, thêm vào mảng
            setSelectedImages([...selectedImages, uri]);
        }
        console.log('seee',testAlbum[0])
    };
    const flatListRef = useRef();

    // Hàm để cuộn đến cuối danh sách
    const scrollToBottom = () => {
        flatListRef.current.scrollToEnd({ animated: true });
    };

    // Test new Message
    const {height1} = useWindowDimensions();
    const [messageCordinates, setMessageCordinates] = useState({x: 0, y: 0});
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [yLocation, setYlocation] = useState({x: 0, y: 0});
    const [isSender, setSender] = useState(false);
    const onLongPress = (e, message, touchpadRef) => {
        // console.log('onLongPress', e.nativeEvent);
        const {pageY, locationY} = e.nativeEvent;
        let y = pageY - locationY;

        const isLessDisatanceFromTop = y < 100;
        const isLessDisatanceFromBottom = height1 - y < message?.layoutHeight;
        // const isLessDisatanceFromBottom = message?.layoutHeight > 256;
        // const isLessDisatanceFromBottom = height1 - y ;
        // let localY = touchpadRef - (pageY - locationY);
        // console.log('loca1', touchpadRef);
        if (isLessDisatanceFromBottom)
        {
            console.log('Bottoom');
            y = y - message?.layoutHeight;
            // localY = touchpadRef - (pageY - locationY);
            // console.log('loca2', localY);
        }
        
        if (isLessDisatanceFromTop)
        {
            console.log('BottoomTop');
            y = y + message?.layoutHeight;
            // localY = touchpadRef + (pageY - locationY);
            // console.log('loca3', localY);

        }
        console.log('distance', isLessDisatanceFromTop);

        setMessageCordinates({
            x: 0,
            y: pageY - locationY
        });
        console.log('yLocation', touchpadRef);
        setYlocation({x: 0, y: touchpadRef + (pageY - locationY)});
        // setYlocation({x: 0, y: localY});
        setSelectedMessage(message);
    }
    // console.log('ópd', messageCordinates);

    // action sheet
    let actionSheet = React.createRef();

    // console.log('cadax', conversition);
    // chuyển tiếp tin nhắn
    const handlePressShareMess = async(item) => {
        const handleSend = async() => {
            const message = {
                chatId: item.chatId,
                senderId: profile._id,
                text: selectedShareMess.text,
            }
            
             //send message to socket server
            if (!isGroupChat)
            {
                receiverId = chat.members.find((id) => id !== currentUser);
            }
            else
            {
                // console.log('đanggg làm diệc');
                receiverId = chat.members.filter((id) => id !== currentUser);
            }
            // console.log('13123', receiverId);
            setSendMessage({...message, receiverId});
            // console.log('test223: ', sendMessage)
            // send message to database
            try {
                const {data} = await addMessage(message);
                // console.log('313',data)
                setMessages([...messages, data])
                setMess("");
            } catch (error) {
                console.log(error)
            }
            // setSendMessage({...message, receiverId});
        } 
        // const handleSendImage = async () => {
        //     const formData = new FormData();
        //     formData.append('chatId', item.chatId);
        //     formData.append('senderId', profile._id);
        
        //     // Duyệt qua mảng media và thêm từng item vào formData
        //     for (const mediaUri of selectedImages) {
        //         const fileName = mediaUri.split('/').pop(); // Lấy tên file từ URI
        //         const fileType = mediaUri.match(/\.(jpg|jpeg|png|mp4)$/i) ? 'image/jpeg' : 'video/mp4'; // Xác định loại file dựa trên đuôi file
        
        //         // Tạo một đối tượng Blob từ URI (giả định rằng bạn đã có hàm convertUriToBlob)
        //         // const blob = await convertUriToBlob(mediaUri);
        
        //         formData.append('mediaUrl', {
        //             uri: mediaUri,
        //             type: fileType,
        //             name: fileName
        //         });
        //     }
    
        //     try {
        //         const {data} = await client.post('/message/sendImage/', formData, {
        //             onDownloadProgress: ({loaded, total}) => setProgressUpload(loaded / total)
                    
        //         });
        //         // const data = await response.data();
        //         console.log('dâdasc', data);
        //         setMessages([...messages, data]);
        //         imagePiOpen();
        //     } catch (error) {
        //         console.log(error);
        //     }
        // };
        console.log('replyy', selectedShareMess);
        if (selectedShareMess.type === 'text')
        {
            handleSend();
            console.log('gửi tin nhắn');
        }
        else
        {
            console.log('gửi file', selectedShareMess.mediaUrl);
        }
    }

    // call audio
    const [modalCallAudioVisible, setModalCallAudioVisible] = useState(false);


    return (
        <Host>

        <GestureHandlerRootView style={{flex: 1}}>
        <TouchableWithoutFeedback
            onPress={() => !openImageLib ? imagePiOpen() : null}
        >
        <SafeAreaView style={styles.container}>
            {isGroupChat ? 
                <HeaderChatView chat={chat} groupName={chat.groupName} userData={userData} navigation={navigation}></HeaderChatView> :
                <HeaderChatView userData={userData} navigation={navigation} setModalCallAudioVisible={setModalCallAudioVisible}></HeaderChatView>

            }
            <KeyboardAvoidingView
                // style={{flex: 1}}
                keyboardVerticalOffset={0}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={{width: '100%', height: '100%', backgroundColor: '#fff', justifyContent: 'space-between', alignItems: 'center'}}>
                    {/* <ScrollView
                        style={{width: width, minHeight: '10%'}}
                        nestedScrollEnabled={true}
                    > */}
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            // renderItem={({item}) => <Message {...item} onLongPress={onLongPress} onPressIn={setSender} emoji={current ? items[current === null ? 0 : current].emojis : null}></Message>}
                            renderItem={({item}) => (
                                <BubbleMessage
                                    key={item._id}
                                    author={item.senderId}
                                    message={item.text}
                                    createdAt={item.createdAt}
                                    mediaUrl={item.text === '' ? item.mediaUrl : null}
                                    // Thêm các props khác nếu cần
                                    _id={item._id}
                                    senderId={item.senderId}
                                    replyMess = {item}
                                />
                            )}
                            keyExtractor={item => item.createdAt}
                            contentContainerStyle= {{paddingHorizontal: 10, gap: 10}}
                            style={{width: width, minHeight: '85%', height: '80%'}}
                            automaticallyAdjustKeyboardInsets
                            onContentSizeChange={scrollToBottom} // Cuộn đến cuối mỗi khi nội dung thay đổi
                            onLayout={scrollToBottom} // Cuộn đến cuối khi layout thay đổi
                        ></FlatList>
                        {/* <ChatBox></ChatBox> */}
                    {/* </ScrollView> */}
                    <PortalView
                        selectedMessage={selectedMessage}
                        messageCordinates={messageCordinates}
                        yLocation={yLocation}
                        setSelectedMessage={setSelectedMessage}
                        isSender={isSender}
                        items = {items}
                    ></PortalView>
                    <ChatViewBT currentUser={currentUser} chat={chat} setMessages={setMessages} messages={messages} setSendMessage socket={socket} imagePiOpen={imagePiOpen} selectedImages={selectedImages} setSelectedImages={setSelectedImages} replyTo={replyTo} setReplyTo={setReplyTo} listPinMessge={listPinMessge} setListPinMessge={setListPinMessage}></ChatViewBT>
                    {/* <View style={{width: width, height: 500, backgroundColor: 'red', position: 'absolute', bottom: 0}}>
                        <EmojiPicker></EmojiPicker>
                    </View> */}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>

        </TouchableWithoutFeedback>
        <Animated.View style={{width: '100%', height: heightAnim, backgroundColor: '#fff', marginTop: 50}}>
            <ScrollView
                style={{width: '100%', height: '100%'}}
            >
                <View style={{flexDirection: 'row', width: '100%', flexWrap: 'wrap'}}>
                    <TouchableOpacity
                        style={{width: 125, height: 120}}
                    ></TouchableOpacity>
                    {testAlbum.map((item, index) => (
                        <TouchableOpacity
                            style={{width: 125, height: 120, backgroundColor: 'pink', borderWidth: 1, borderColor: '#fff'}}
                            key={index}
                        >
                            <Image
                                source={{uri: item}}
                                style={{width: '100%', height: '100%'}}
                                resizeMode='cover'
                            ></Image>
                            <TouchableOpacity
                                style={{width: 24, height: 24, borderRadius: 20, position: 'absolute', right: 0, margin: 10, borderWidth: 1, borderColor: '#fff', backgroundColor: selectedImages.includes(item) ? '#009ef9' : 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center'}}
                                onPress={() => handleSelectImage(item)}
                            >
                                {selectedImages.indexOf(item) > 0 ? 
                                    <Text style={{color: '#fff', fontWeight: 'bold'}}>{selectedImages.indexOf(item) + 1}</Text> : null
                                }
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </Animated.View>
        <ActionSheet
            ref={actionSheet}
            // title=''
            options={['Thu hồi với mọi người', 'Thu hồi với bạn', 'Huỷ']}
            cancelButtonIndex={2}
            onPress={(index) => {handleActionSheetPress(index)}}
        ></ActionSheet>
        <BottomSheet 
            ref={bottomSheetRefShareMess} 
            // index={0} 
            snapPoints={snapPoints} 
            style={{shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            
            elevation: 5}} 
            onChange={(index) => {index != 0 ? setIsBottomSheetShareMess(true) : setIsBottomSheetShareMess(false)}}
            handleIndicatorStyle={{backgroundColor: '#fff'}}
        >
            <View style={{width: '100%', alignItems: 'center'}}>
                <View style={{width: '90%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                    <TouchableOpacity
                        onPress={() => handleClosePress()}
                    >
                        <Text style={{color: '#2f79e7', fontWeight: '700'}}>Xong</Text>
                    </TouchableOpacity>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>Gửi đến</Text>
                    <TouchableOpacity>
                        <Text style={{color: '#2f79e7', fontWeight: '700'}}>Tạo nhóm</Text>
                    </TouchableOpacity>
                </View>
                <View style={{width: '90%', height: 45, backgroundColor: '#f5f5f5', borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
                    <Image
                        source={require('./Icon/Search114.png')}
                        resizeMode='contain'
                        style={{width: 20, height: 20, marginRight: 10}}
                    ></Image>
                    <TextInput
                        placeholder='Tìm kiếm'
                        style={{width: '90%'}}
                    ></TextInput>
                </View>
                <View style={{width: '90%', alignItems: 'center'}}>
                    <ScrollView
                        style={{width: '100%', height: '100%'}}
                    >
                        {conversition.map((item, index) => (
                            <View style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 15}}>
                                <View
                                    style={{width: 50, height: 50}}
                                >
                                    <Image
                                        source={{uri: item.type === 'group' ? item.groupAvatar : item.avatar}}
                                        resizeMode='cover'
                                        style={{width: '100%', height: '100%', borderRadius: 50}}
                                    ></Image>
                                </View>
                                <Text style={{fontSize: 16, fontWeight: 'bold', width: '62%', marginLeft: 20}}>{item.type === 'group' ? item.groupName : item.userName}</Text>
                                <TouchableOpacity
                                    style={{width: 50, height: 30, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', borderRadius: 30}}
                                    onPress={() => handlePressShareMess(item)}
                                >
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Gửi</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </BottomSheet>
        {/* call audio modal*/}
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalCallAudioVisible}
        >
            <CallAudio setModalCallAudioVisible={setModalCallAudioVisible} userData={userData}></CallAudio>
        </Modal>
        </GestureHandlerRootView>
        </Host>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   height: height,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#009ef9',
    },
});