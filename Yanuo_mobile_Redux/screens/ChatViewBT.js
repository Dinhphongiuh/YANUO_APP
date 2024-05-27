import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback, ScrollView, PanResponder, TextInput, KeyboardAvoidingView} from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {useKeyboard} from '@react-native-community/hooks';
import EmojiPicker from '../components/message/emoijs/EmojiPicker';
import { addMessage, addMessageImage, getPinMessage } from '../api/MessageRequests';
import { useMessage } from './context/chatContext';
import * as ImagePicker from 'expo-image-picker';
import client from '../api/client';
import * as MediaLibrary from 'expo-media-library';
import { getUser } from '../api/UserRequests';
// import { fetch } from 'react-native-fetch-blob';

// import { useSharedValue, withTiming } from 'react-native-reanimated';    

const {height, width} = Dimensions.get('window');
export default function App({currentUser, chat, setMessages, messages, socket, imagePiOpen, selectedImages, setSelectedImages, replyTo, setReplyTo, listPinMessge, setListPinMessge})
{   
    // console.log('cudsa', currentUser);
    const isGroupChat = chat.type === 'group';
    const {sendMessage, setSendMessage} = useMessage();
    const {receiveMessage, setReceiveMessage} = useMessage();
    console.log('đâsd', receiveMessage);

    // console.log('test223: ', receiveMessage);
    const [inputWidth, setInputWidth] = useState(new Animated.Value(width / 2)); 
    const [sendBtnWidth, setSendBtnWidth] = useState(new Animated.Value(0)); 
    const inputRef = useRef();

    const [mess, setMess] = useState('');
    const [imagePick, setImagePick]  = useState(null);

    const animateInput = (mess) => {
        setMess(mess);
        Animated.timing(inputWidth, {
          toValue: mess.length > 0 ? width - 99 : width / 2,
          duration: 25,
          useNativeDriver: false
        }).start();
        Animated.timing(sendBtnWidth, {
            toValue: mess.length > 0 ? 40 : 0,
            duration: 5,
            useNativeDriver: false
        }).start();
    };

    useEffect(() => {
        if (selectedImages.length > 0)
        {
            console.log(selectedImages.length);
            setMess('');
            Animated.timing(sendBtnWidth, {
                toValue: selectedImages.length > 0 ? 40 : 0,
                duration: 5,
                useNativeDriver: false
            }).start();
            Animated.timing(inputWidth, {
                toValue: selectedImages.length > 0 ? width - 99 : width / 2,
                duration: 25,
                useNativeDriver: false
              }).start();
        }
        else
        {
            Animated.timing(sendBtnWidth, {
                toValue: selectedImages.length > 0 ? 40 : 0,
                duration: 5,
                useNativeDriver: false
            }).start();
            Animated.timing(inputWidth, {
                toValue: selectedImages.length > 0 ? width - 99 : width / 2,
                duration: 25,
                useNativeDriver: false
              }).start();
        }
        console.log(selectedImages);
    }, [selectedImages])

    //   pick image
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
                console.log(typeof response.assets[0].uri);
                setImagePick(response.assets[0].uri);
            }
        }
    };

    // console.log('dsd',mess);
      //   send Message
    const handleSend = async() => {
        const message = {
            chatId: chat._id,
            senderId: currentUser,
            text: mess,
            ...(replyTo && {replyTo: replyTo.messageId})
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
    //     // formData.append('image', imagePick); // 'image' là key mà server sẽ sử dụng để lấy file
    //     formData.append('chatId', chat._id);
    //     formData.append('senderId', currentUser);
    //     // console.log('fromDaa', formData)
    //     formData.append('image', {
    //         name: new Date() + "_profile",
    //         // chatId: chat._id,
    //         // senderId: currentUser,
    //         uri: imagePick,
    //         type: 'image/jpg'
    //     });

    //     console.log('consol: ', formData);
    //     try {
    //         const response = await addMessageImage(formData);
    //         const data = await response.json();
    //         setMessages([...messages, data]);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const [progressUpload, setProgressUpload] = useState(null);
    const handleSendImage = async () => {
        const formData = new FormData();
        formData.append('chatId', chat._id);
        formData.append('senderId', currentUser);
    
        // Duyệt qua mảng media và thêm từng item vào formData
        for (const mediaUri of selectedImages) {
            const fileName = mediaUri.split('/').pop(); // Lấy tên file từ URI
            const fileType = mediaUri.match(/\.(jpg|jpeg|png|mp4)$/i) ? 'image/jpeg' : 'video/mp4'; // Xác định loại file dựa trên đuôi file
    
            // Tạo một đối tượng Blob từ URI (giả định rằng bạn đã có hàm convertUriToBlob)
            // const blob = await convertUriToBlob(mediaUri);
    
            formData.append('mediaUrl', {
                uri: mediaUri,
                type: fileType,
                name: fileName
            });
        }

        try {
            const {data} = await client.post('/message/sendImage/', formData, {
                onDownloadProgress: ({loaded, total}) => setProgressUpload(loaded / total)
                
            });
            // const data = await response.data();
            console.log('dâdasc', data);
            setMessages([...messages, data]);
            imagePiOpen();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (progressUpload === 1)
        {
            if (isGroupChat)
            {
                const groupMembers = chat.members.filter((id) => id !== currentUser);
                socket.current.emit('send-media', { receiverId: groupMembers });
            }
            else
            {
                const receiverId = chat.members.find((id) => id !== currentUser);
                socket.current.emit('send-media', {receiverId: receiverId});
            }
        }

    }, [progressUpload]);

    // console.log('21321314', progressUpload);
    
    // Hàm giả định để chuyển đổi URI thành Blob
    const convertUriToBlob = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    };


    // sen message socket server
    useEffect(() => {
        if (sendMessage !== null)
        {
            // console.log('moksd: ', sendMessage);
            socket.current.emit('send-message', sendMessage)
        }
    }, [sendMessage])
      // receive Message from socketServer
    useEffect(() => {
        socket.current.on("receive-message", (data) => {
            setReceiveMessage(data);    
        })
    }, []);


    //  Emoji
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    // const height1 = useSharedValue(70);
    // const height1 = new Animated.Value(70);
    useEffect(() => {
        if (receiveMessage !== null && receiveMessage.chatId === chat._id)
        {
            setMessages([...messages, receiveMessage])
        }
    }, []);

    const [replyUserName, setReplyUserName] = useState('');
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                // Giả sử bạn có một hàm getUser để lấy thông tin người dùng từ server
                const res = await getUser(replyTo._id);
                // console.log('kưeks', res.data);
                if (res.data.success) {
                    if (replyTo._id === currentUser)
                        setReplyUserName('chính bạn')
                    else
                        setReplyUserName(res.data.user.userName);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (replyTo !== null)
            fetchUserName();
    }, [replyTo]);
    
    

    // console.log('loã', listPinMessge);
    const [expanded, setExpanded] = useState(false);
    const animatedHeight = useRef(new Animated.Value(60)).current; // Initial height

    const handlePress = () => {
        setExpanded(!expanded);
        Animated.timing(animatedHeight, {
            toValue: expanded ? 60 : 150, // Toggle between your initial and expanded height
            duration: 500, // Duration in milliseconds
            useNativeDriver: false // This should be false as we are animating non-Opacity or non-Transform properties
        }).start();
    };

    return (
        <>
        {/* Pin Message */}
        {listPinMessge ? 
            <Animated.View style={{width: '96%', height: animatedHeight, backgroundColor: '#fff', position: 'absolute', top: 4, borderRadius: 10, alignItems: 'center', shadowColor: "#000", shadowOffset: {width: 0, height: 12}, shadowOpacity: 0.22, shadowRadius: 16.00, elevation: 24, zIndex: 11}}>
                {expanded ? 
                    <View style={{width: expanded ? '100%' : 0, borderBottomWidth: 1, borderColor: '#e7e7e7', padding: 10}}>
                        {expanded ? 
                            <Text style={{fontWeight: '600'}}>Danh sách ghim</Text> : null
                        }
                    </View> : null
                }
                {!expanded ? 
                    <TouchableOpacity 
                        activeOpacity={0.5}
                        style={{width: '100%', height: 60, backgroundColor: '#fff', top: 4, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 10, }}
                    >
                        <View 
                            style={{width: '75%', borderRightWidth: 1, borderColor: '#dfdfdf', flexDirection: 'row', alignItems: 'center'}}
                        >
                            <Image
                                source={require('./Icon/commentLines.png')}
                                resizeMode='contain'
                                style={{width: 30, height: 30, marginRight: 10}}
                            ></Image>
                            <View style={{width: '80%', height: '100%'}}>
                                <Text style={{fontWeight: '600'}}>{listPinMessge[0].text ? listPinMessge[0].text : '[Hình ảnh]'}</Text>
                                <Text style={{color: '#898e91'}}>tin nhắn của {listPinMessge[0].userName}</Text>
                            </View>
                        </View>
                        <View style={{width: '20%', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <TouchableOpacity
                                // activeOpacity={0.5}
                                style={{flexDirection: 'row', width: listPinMessge.length > 1 ? '80%' : '60%' /*> 1 -> 80%*/, height: '100%', borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 200, padding: 10, borderColor: '#7f8288'}}
                                onPress={() => handlePress()}
                            >
                                {listPinMessge.length > 1 ?
                                    <Text style={{color: '#7c858c', fontWeight: '600'}}>+{listPinMessge.length - 1}</Text> : null
                                }
                                <Image
                                    source={require('./Icon/angleDown.png')}
                                    resizeMode='contain'
                                    style={{width: 20, height: 20, borderRadius: 40}}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity> : null
                }

                {
                    expanded ? 
                    <View style={{width: '100%', alignItems: 'center'}}>
                        <ScrollView style={{width: '100%', height: 100}}>
                            {listPinMessge.map((item, index) => (
                        <TouchableOpacity 
                            activeOpacity={0.5}
                            style={{width: '100%', height: 60, backgroundColor: '#fff', top: 4, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#e7e7e7'}}
                            key={index}
                        >
                        <View 
                            style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}
                        >
                            <Image
                                source={require('./Icon/commentLines.png')}
                                resizeMode='contain'
                                style={{width: 30, height: 30, marginRight: 10}}
                            ></Image>
                            <View style={{width: '80%', height: '100%'}}>
                                <Text style={{fontWeight: '600'}}>{item.text}</Text>
                                <Text style={{color: '#898e91'}}>tin nhắn của {item.userName}</Text>
                            </View>
                        </View>
                        </TouchableOpacity>
                    ))}
                        </ScrollView>
                    </View>
                    : null
                }

                {expanded ? 
                    <View style={{position: 'absolute', height: 40, width: '100%', bottom: -60, alignItems: 'center'}}>
                        <View style={{width: '90%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <TouchableOpacity
                                style={{flexDirection: 'row', alignItems: 'center'}}
                            >
                                <Text style={{color: '#fff', fontWeight: '600', marginRight: 10}}>Chỉnh sửa</Text>
                                <Image
                                    source={require('./Icon/Pen1.png')}
                                    resizeMode='contain'
                                    style={{width: 25, height: 25}}
                                ></Image>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{flexDirection: 'row', alignItems: 'center'}}
                                onPress={() => handlePress()}
                            >
                                <Text style={{color: '#fff', fontWeight: '600', marginRight: 10}}>Thu gọn</Text>
                                <Image
                                    source={require('./Icon/angleUp.png')}
                                    resizeMode='contain'
                                    style={{width: 25, height: 25}}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    : null
                }
            </Animated.View>
            :
            null
        }
        {expanded ?
            <TouchableWithoutFeedback
                onPress={() => handlePress()}
            >
                <View style={{width: width, height: height, backgroundColor: 'rgba(0, 0, 0, 0.7)', position: 'absolute', zIndex: 10}}></View>
            </TouchableWithoutFeedback>
            : null    
        }  
        {/*  */}
        <SafeAreaView style={{flexDirection: 'column'}}>
            <View style={styles.container}>
                {/* reply */}
                {replyTo ? 
                    <View style={{width: '100%', height: 60, backgroundColor: '#fff', position: 'absolute', top: -60, padding: 4, borderTopWidth: 1, borderColor: '#ccc', borderBottomWidth: 1}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                            <Text>Đang trả lời {replyUserName}</Text>
                            <TouchableOpacity
                                style={{width: 30, height: 30, borderRadius: 30, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center'}}
                                onPress={() => setReplyTo(null)}
                            >
                                <Text style={{fontWeight: 'bold'}}>X</Text>
                            </TouchableOpacity>
                        </View>
                        { replyTo.message === '' ? 
                            <Text>[file]</Text>
                            : 
                            <Text style={{marginBottom: 4}}>{replyTo.message}</Text>
                        }
                    </View> : null
                }
                {/*  */}
                <View style={{width: '99%', height: 50, marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
                    <TouchableOpacity
                        style={{justifyContent: 'center', alignItems: 'center', width: '10%', height: '100%', marginRight: 15}}
                    >
                        <Image
                            source={require('./Icon/EmoijIcon.png')}
                            resizeMode='contain'
                            style={{width: 55, height: 55}}
                        ></Image>
                    </TouchableOpacity>
                    <Animated.View style={{width: inputWidth, justifyContent: 'flex-start'}}>
                        <TextInput
                            placeholder='Tin nhắn'
                            placeholderTextColor={'#a0a5aa'}
                            style={{width: '100%', height: '100%', fontSize: 18}}
                            ref={inputRef}
                            onChangeText={(text) => animateInput(text)}
                            value={mess}
                            // onPressIn={imagePiOpen}
                        ></TextInput>
                    </Animated.View>
                    <Animated.View
                        style={{width: sendBtnWidth, height: '100%', justifyContent: 'center', alignItems: 'center'}}
                    >
                        <TouchableOpacity
                            style={{width: '100%'}}
                            // onPress={handleSend}
                            onPress={mess === '' ? handleSendImage : handleSend}
                        >
                            <Image
                                source={require('./Icon/sendIcon.png')}
                                resizeMode='contain'
                                style={{width: '100%', height: 25}}
                            ></Image>
                        </TouchableOpacity>
                    </Animated.View>
                    <TouchableOpacity
                        style={{justifyContent: 'center', alignItems: 'center', width: '12%', height: '100%',}}
                    >
                        <Image
                            source={require('./Icon/ellipsis.png')}
                            resizeMode='contain'
                            style={{width: 35, height: 35}}
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{justifyContent: 'center', alignItems: 'center', width: '12%', height: '100%',}}
                        // onPress={imagePiOpen}
                    >
                        <Image
                            source={require('./Icon/Voice.png')}
                            resizeMode='contain'
                            style={{width: 30, height: 30}}
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{justifyContent: 'center', alignItems: 'center', width: '12%', height: '100%',}}
                        onPress={imagePiOpen}
                    >
                        <Image
                            source={require('./Icon/ImageIcon.png')}
                            resizeMode='contain'
                            style={{width: 30, height: 30}}
                        ></Image>
                    </TouchableOpacity>
            {/* <View style={{width: '100%', height: 300, backgroundColor: 'pink', }}>
                <Text>dsd</Text>
            </View> */}
                </View>
                {/* <EmojiPicker></EmojiPicker> */}
            </View>
            {/*  */}
        </SafeAreaView>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        width: '100%', 
        height: '38%', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        elevation: 5,
        bottom: 0,
    }
});