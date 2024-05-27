import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { getUser } from "../../api/UserRequests";

const MessageButton = ({author , profile, emoji, text, color, mediaUrl, currentUser, isGroupChat, navigation , messageId, senderId, replyMess, repliedMessage, ...rest}) => {
    // console.log('nal', repliedMessage);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                // Giả sử bạn có một hàm getUser để lấy thông tin người dùng từ server
                const res = await getUser(senderId);
                // console.log(res.data.user.userName);
                if (res.data.success) {
                    setUserName(res.data.user.userName);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserName();
    }, [senderId]);
    console.log('sd', userName);

    const touchpadheight = useRef(null);
    const handlePress = (e) => {
        if (touchpadheight.current)
        {
            touchpadheight.current.measure((x, y, width, height) => {
                console.log('toucjs', height);
            })
        }
    }
    return (
        <>
        {replyMess.replyTo ? 
                <TouchableOpacity 
                    // style={[{backgroundColor: 'pink', height: 20}, styles.container]}
                    style={{
                        backgroundColor: author === profile._id ? "#f5f5f5" : "#f5f5f5",
                        maxWidth: '70%',
                        alignSelf: author === profile._id ? 'flex-end' : "flex-start",
                        padding: 10,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#d7dada',
                        marginTop: 5, 
                        marginBottom: -10
                    }}
                >
                    {repliedMessage.text === '' ? 
                        <Image
                            source={{uri: repliedMessage.mediaUrl[0].url}}
                            resizeMode="contain"
                            style={{width: 80, height: 80}}
                        ></Image>
                        :
                        <Text>{repliedMessage.text}</Text>
                    }
                </TouchableOpacity>
                : null
            }
            <TouchableOpacity 
                {...rest} 
                style={{
                    backgroundColor: author === profile._id ? "#d0f0fd" : "#fefefe",
                    maxWidth: '70%',
                    alignSelf: author === profile._id ? 'flex-end' : "flex-start",
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#d7dada',
                    marginTop: 5, 
                }}
                activeOpacity={0.7}
                ref={touchpadheight}
            >
                <View style={styles.container}>
                    <View style={{}}>
                        {isGroupChat && senderId !== profile._id ?
                            <Text style={{marginBottom: 5}}>{userName}</Text> : null
                        }
                        {text ? 
                            <View>
                                {/* <Text>{replyMess.replyTo}</Text> */}
                                <Text style={[styles.text, {color: color}]}>{text}</Text>
                            </View>
                            : null
                        }
                        {
                            mediaUrl ? 
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                                {mediaUrl.map((item, index) => (
                                    <TouchableOpacity
                                        style={{width: 100, height: 100, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff',}}
                                        key={index}
                                        onPress={() => navigation.push("ViewMediaChat", url=item.url)} //show Image of video
                                    >
                                        <Image
                                            source={{uri: item.url}}
                                            style={{width: 100, height: '100%'}}
                                            resizeMode="cover"
                                        ></Image>
                                    </TouchableOpacity>
                                ))}
                            </View> : null
                        }
                    </View>
                        <View style={{position: "absolute", bottom: -40, right: -10}}>
                            {emoji}
                        </View>
                    {/* <View style={{paddingHorizontal: 4}}></View> */}
                </View>
            </TouchableOpacity>
        </>
    )
};

const styles = StyleSheet.create({
    root: {
        // backgroundColor: "rgba(0, 0, 0, 0.14)",
        padding: 10,
        
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        // textTransform: 'capitalize',
        fontSize: 18,
        color: '#121212'
    }
})

export default MessageButton;