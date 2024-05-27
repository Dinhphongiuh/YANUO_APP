import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback, ScrollView, PanResponder, ActivityIndicator, Modal, TextInput} from 'react-native';
import {useSelector} from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from '../../api/client';

const {height, width} = Dimensions.get('window');
export default function App({navigation, route}) 
{
    const chat = route.params.chat;
    const isGroupChat = chat.type === 'group' ? true : false;
    const [modalVisible, setModalVisible] = useState(false);
    console.log('dsd', chat);

    // member
    const heightAmin = useRef(new Animated.Value(0)).current;
    const [selectedMembers, setSelectedMembers] = useState([]);
    const profile = useSelector(state => state.meSlice.userProfile);   
    const [listFriend, setListFriend] = useState([]);
    // Hàm kiểm tra xem một người bạn có phải là thành viên của nhóm hay không
    const isFriendMemberOfChat = (friendId) => {
        return chat.members.includes(friendId);
    };
    
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
    }, [profile._id]);

    const handleRemoveMember = (index) => {
        // Tạo một bản sao mới của mảng để tránh thay đổi trực tiếp trên trạng thái
        const newSelectedMembers = [...selectedMembers];
        // Loại bỏ thành viên tại vị trí index
        newSelectedMembers.splice(index, 1);
        // Cập nhật trạng thái với mảng mới
        setSelectedMembers(newSelectedMembers);

        setSelectedMembers(newSelectedMembers);

        const toValue = newSelectedMembers.length > 0 ? 80 : 0;
        Animated.timing(heightAmin, {
            toValue: toValue,
            duration: 500,
            useNativeDriver: false
        }).start();
      };
    
    const handleSelectMember = (member) => {
        let newSelectedMembers = [...selectedMembers];
        if (newSelectedMembers.includes(member)) {
        // Nếu thành viên đã được chọn, loại bỏ khỏi mảng
            newSelectedMembers = newSelectedMembers.filter(m => m !== member);
        } else {
        // Thêm thành viên vào mảng
            newSelectedMembers.push(member);
        }
        setSelectedMembers(newSelectedMembers);

        const toValue = newSelectedMembers.length > 0 ? 80 : 0;
        Animated.timing(heightAmin, {
            toValue: toValue,
            duration: 500,
            useNativeDriver: false
        }).start();
    };

    // console.log(selectedMembers);
    const handleAddMembersToGroup = async() => {
        const storedToken = await AsyncStorage.getItem('token');
        try
        {
            const newMemberIds = selectedMembers.map(member => member._id);
            console.log(newMemberIds);
            const res = await client.post('/chat/group/addMembers', {
                chatId: chat._id,
                newMemberId: newMemberIds
            },
            {
                headers: {
                    Authorization: `JWT ${storedToken}`
                }
            })
            console.log(res.data);
        }
        catch (erro)
        {
            console.log(erro);
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            {/* header */}
            <View style={{width: '100%', height: 45, alignItems: 'center', flexDirection: 'row'}}>
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
                <Text style={{color: '#fff', fontSize: 18, fontWeight: '600'}}>Tuỳ chọn</Text>
            </View>
            {/* Content */}
            <View style={{width: '100%', height: '100%', backgroundColor: '#fff', alignItems: 'center'}}>
                <ScrollView
                    style={{width: '100%', height: height}}
                >
                    <View style={{width: '100%', height: '100%', backgroundColor: '#fff', alignItems: 'center', paddingTop: 15}}>
                        <View style={{width: '90%', alignItems: 'center'}}>
                            <TouchableOpacity
                                style={{width: 80, height: 80, backgroundColor: 'pink', borderRadius: 80}}
                            >
                                <Image
                                    source={{uri: chat.groupAvatar}}
                                    resizeMode='cover'
                                    style={{width: '100%', height: '100%', borderRadius: 80}}
                                ></Image>
                                {/* image Avatar */}
                            </TouchableOpacity>
                            <Text style={{marginVertical: 15, color: '#000', fontSize: 18, fontWeight: 'bold'}}>{chat.groupName}</Text>
                        </View>
                        <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15}}>
                            <TouchableOpacity
                                style={{width: 50, height: 100, justifyContent: 'center', alignItems: 'center'}}
                            >
                                <View style={{width: 55, height: 55, borderRadius: 50, backgroundColor: '#f7f7f7', justifyContent: 'center', alignItems: 'center'}}>
                                    <Image
                                        source={require('../Icon/Search114.png')}
                                        resizeMode='contain'
                                        style={{width: '50%', height: '50%'}}
                                    ></Image>
                                </View>
                                <Text style={{textAlign: 'center', fontSize: 12, marginVertical: 8}}>Tìm tin nhắn</Text>
                            </TouchableOpacity>
                            {isGroupChat ? 
                                <TouchableOpacity
                                    style={{width: 50, height: 100, justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => setModalVisible(true)}
                                >
                                    <View style={{width: 55, height: 55, borderRadius: 50, backgroundColor: '#f7f7f7', justifyContent: 'center', alignItems: 'center'}}>
                                        <Image
                                            source={require('../Icon/addGroupU.png')}
                                            resizeMode='contain'
                                            style={{width: '50%', height: '50%'}}
                                        ></Image>
                                    </View>
                                    <Text style={{textAlign: 'center', fontSize: 12, marginVertical: 8}}>Thêm thành viên</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    style={{width: 50, height: 100, justifyContent: 'center', alignItems: 'center'}}
                                >
                                    <View style={{width: 55, height: 55, borderRadius: 50, backgroundColor: '#f7f7f7', justifyContent: 'center', alignItems: 'center'}}>
                                        <Image
                                            source={require('../Icon/UserNoActive.png')}
                                            resizeMode='contain'
                                            style={{width: '50%', height: '50%'}}
                                        ></Image>
                                    </View>
                                    <Text style={{textAlign: 'center', fontSize: 12, marginVertical: 8}}>Trang cá nhân</Text>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity
                                style={{width: 50, height: 100, justifyContent: 'center', alignItems: 'center'}}
                            >
                                <View style={{width: 55, height: 55, borderRadius: 50, backgroundColor: '#f7f7f7', justifyContent: 'center', alignItems: 'center'}}>
                                    <Image
                                        source={require('../Icon/ImageIcon.png')}
                                        resizeMode='contain'
                                        style={{width: '50%', height: '50%'}}
                                    ></Image>
                                </View>
                                <Text style={{textAlign: 'center', fontSize: 12, marginVertical: 8}}>Đổi hình nền</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{width: 50, height: 100, justifyContent: 'center', alignItems: 'center'}}
                            >
                                <View style={{width: 55, height: 55, borderRadius: 50, backgroundColor: '#f7f7f7', justifyContent: 'center', alignItems: 'center'}}>
                                    <Image
                                        source={require('../Icon/messageHiden.png')}
                                        resizeMode='contain'
                                        style={{width: '50%', height: '50%'}}
                                    ></Image>
                                </View>
                                <Text style={{textAlign: 'center', fontSize: 12, marginVertical: 8}}>Tắt thông báo</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{width: '100%', height: 10, backgroundColor: '#f5f6f8', marginTop: 10}}></View>
                        <View style={{width: '90%', marginTop: 14}}>
                            <TouchableOpacity
                                style={{width: '100%',}}
                            >
                                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', width: '50%', alignItems: 'center'}}>
                                        <Image
                                            source={require('../Icon/ImageIcon.png')}
                                            style={{width: 22, height: 22}}
                                        ></Image>
                                        <Text style={{marginHorizontal: 10}}>Ảnh , file, link đã gửi</Text>
                                    </View>
                                    <Text>{'>'}</Text>
                                </View>
                                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                                    <View></View>
                                    <View>
                                        {/* show ảnh */}
                                        
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{width: '100%', height: 10, backgroundColor: '#f5f6f8', marginTop: 10}}></View>
                        {isGroupChat ? 
                        <TouchableOpacity 
                            style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                            onPress={() => navigation.push('MemberController', chats={chat})}
                        >
                            <View>
                                <Image
                                    source={require('../Icon/UserNoActive.png')}
                                    style={{width: 23, height: 23}}
                                ></Image>
                            </View>
                            <View style={{width: '90%', borderBottomWidth: 1, borderColor: '#e0e0e0', flexDirection: 'row', justifyContent: 'space-between', height: 45, alignItems: 'center'}}>
                                <Text style={{paddingVertical: 10, fontSize: 16}}>Xem thành viên {`(${chat.members.length})`}</Text>
                                <Text>{'>'}</Text>
                            </View>
                        </TouchableOpacity> : null
                        }
                        <TouchableOpacity 
                            style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                            // rời nhóm
                        >
                            <View>
                                <Image
                                    source={require('../Icon/UserNoActive.png')}
                                    style={{width: 23, height: 23}}
                                ></Image>
                            </View>
                            <View style={{width: '90%', borderBottomWidth: 1, borderColor: '#e0e0e0', flexDirection: 'row', justifyContent: 'space-between', height: 45, alignItems: 'center'}}>
                                <Text style={{paddingVertical: 10, fontSize: 16, color: 'red'}}>Rời nhóm</Text>
                                <Text>{'>'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            {/* modal */}
            <Modal 
                style={{width: '100%', height: height, justifyContent: 'space-between'}}
                animationType='slide'
                visible={modalVisible}
                
            >
                <SafeAreaView style={{alignItems: 'center', justifyContent: 'space-between', height: height}}>
                    <View style={{width: '100%', height: 50, backgroundColor: '#f7f7f7', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#dedede'}}>
                        <TouchableOpacity
                            style={{marginHorizontal: 20}}
                            onPress={() => setModalVisible(false)}
                        >
                            <Image
                                source={require('../Icon/xmark.png')}
                                resizeMode='contain'
                                style={{width: 30, height: 30}}
                            ></Image>
                        </TouchableOpacity>
                        <View>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Mời vào cộng đồng</Text>
                            <Text style={{color: '#787878', fontSize: 12}}>Đã chọn: {selectedMembers.length}</Text>
                        </View>
                    </View>
                    <View style={{width: '90%', height: 45, backgroundColor: '#fafafa', marginTop: 15, flexDirection: 'row', alignItems: 'center', borderRadius: 8}}>
                        <Image
                            source={require('../Icon/Search114.png')}
                            style={{width: 20, height: 20, marginHorizontal: 10}}
                        ></Image>
                        <TextInput
                            placeholder='Tìm tên hoặc số điện thoại'
                            style={{fontSize: 18}}
                        ></TextInput>
                    </View>
                    <View style={{width: '90%', alignItems: 'center', height: height, borderTopWidth: 1, borderColor: '#f7f7f7'}}>
                        <ScrollView
                            style={{width: '100%', height: '100%'}}
                        >
                            {listFriend.map((item, index) => (
                                
                                    <TouchableOpacity
                                        style={{width: '100%', height: 50, alignItems: 'center', flexDirection: 'row', marginVertical: 12}}
                                        onPress={() => handleSelectMember(item)}
                                        key={index}
                                        disabled={isFriendMemberOfChat(item._id)}
                                    >
                                    <TouchableOpacity
                                        style={{width: 30, height: 30, borderWidth: 1, borderColor: '#d7d9dd', borderRadius: 30, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}
                                        onPress={() => handleSelectMember(item)}
                                    >
                                        {selectedMembers.includes(item) && (
                                                <Image
                                                    source={require('../Icon/SquaCheck.png')}
                                                    resizeMode='cover'
                                                    style={{width: '100%', height: '100%'}} 
                                                ></Image>
                                        )}
                                    </TouchableOpacity>
                                    <View style={{width: 45, height: 45, borderRadius: 50, marginHorizontal: 15, overflow: 'hidden'}}>
                                        {/* avatar */}
                                        <Image
                                            source={{uri: item.avatar}}
                                            resizeMode='cover'
                                            style={{width: '100%', height: '100%'}}
                                        ></Image>
                                    </View>
                                    <View>
                                        <Text style={{fontSize: 18, fontWeight: '500'}}>{item.userName}</Text>
                                        {isFriendMemberOfChat(item._id) ? <Text>Đã tham gia</Text> : null}
                                    </View>
                                </TouchableOpacity>
                                ))}
                        </ScrollView>
                    </View>
                </SafeAreaView>
                    <Animated.View style={{width: '100%', height: heightAmin, position: 'absolute', bottom: 0, alignItems: 'center', flexDirection: 'row', shadowColor: "#000", shadowOffset: {width: 2, height: 2}, shadowOpacity: 0.25, shadowRadius: 16.00, elevation: 24, backgroundColor: '#fff', zIndex: 9999}}>
                        <ScrollView
                            horizontal
                            style={{}}
                        >
                        {selectedMembers.map((item, index) => (
                            <TouchableOpacity
                                style={{width: 50, height: 50, borderRadius: 70, overflow: 'visible', marginHorizontal: 10}}
                                key={index}
                                onPress={() => handleRemoveMember(index)}
                            >
                                <Image 
                                    source={{uri: item.avatar}}
                                    resizeMode='cover'
                                    style={{width: '100%', height: '100%', borderRadius: 40}}
                                ></Image>
                                <TouchableOpacity
                                    style={{position: 'absolute', width: 20, height: 20, backgroundColor: '#e3e6ea', right: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10, borderRadius: 10, borderWidth: 0.5, borderColor: '#fff'}}
                                >
                                    <Text style={{color: '#688599', fontWeight: '600'}}>x</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                        </ScrollView>
                        {selectedMembers.length > 0 ? 
                            <View style={{width: 50, height: 50, marginRight: 12}}>
                                <TouchableOpacity
                                    style={{width: '100%', height: '100%', backgroundColor: '#1194ff', justifyContent: 'center', alignItems: 'center', borderRadius: 60, marginRight: 12}}
                                    onPress={() => handleAddMembersToGroup()}
                                >
                                    <Image
                                        source={require('../Icon/arrowRight.png')}
                                        resizeMode='contain'
                                        style={{width: '60%', height: '60%'}}
                                    ></Image>
                                </TouchableOpacity>
                            </View> : null
                        }
                    </Animated.View>
            </Modal>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#009ef9',
    },
})