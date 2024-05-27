import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import client from '../../api/client';
import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import {io} from 'socket.io-client';
// import { format, render, cancel, register } from 'timeago.js';
import TimeAgo from 'react-native-timeago';
import Vi from 'timeago.js/lib/lang/vi';

// const socket = io('http://192.168.1.176:3000');
export default function App({navigation}) {
    const profile = useSelector(state => state.meSlice.userProfile);
    const [friendRequest, setFriendRequests] = useState([]);
    const [friendProfiles, setFriendProfiles] = useState([]);
    // console.log('sd: ', friendProfiles);
    // console.log(format('2016-06-12', 'en_US'));
    // chấp nhận kb
    const fetchAcceptFriend = async(senderId) => {
        try
        {
            const res = await client.post(`/accept-friend`, {
                _id: profile._id,
                senderId: senderId
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

    // lấy thông tin các id đã gửi lời mời
    const fetchFriendProfiles = async(requestsData, createdAt) => {
        const userIds = requestsData.map(request => request.senderId);
        try {
            const profileRequests = userIds.map(id => client.get(`/user/${id}`));
            const profileResponses = await Promise.all(profileRequests);
            // const profiles = profileResponses.map(response => response.data.user);
            // setFriendProfiles(profiles);
            const profiles = profileResponses.map((response, index) => ({
                ...response.data.user,
                createdAt: requestsData[index].createdAt // Thêm trường createdAt vào mỗi profile
            }));
            setFriendProfiles(profiles);
        } catch (error) {
            console.log(error.message);
        }
    };

    // lấy lời mời kb
    const fetchFriendRequest = async() => {
        try
        {
            const res = await client.get(`/friend-requests/${profile._id}`);
            // console.log(res.data);
            if (res.data.success)
            {
                setFriendRequests(res.data.requestsData);
                fetchFriendProfiles(res.data.requestsData);
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
        
    }, [friendRequest]);

    // delete Request
    const fetchDeleteRequest = async(senderId) =>
    {
        try
        {
            const res = await client.post('/deleteRequestFriend', {senderId: senderId, _id: profile._id})
            console.log(res.data);
        }
        catch (error)
        {
            console.log(error)
        }
    }

    // socket.emit('userLogin', profile._id);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>Lời mời kết bạn</Text>
                <TouchableOpacity
                    // onPress={clickMe}
                >
                    <Text style={{color: '#0563cd', fontSize: 16}}>Xem tất cả</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginTop: 15, width: '100%', height: '100%'}}>
                {friendProfiles.map((item, index) => (
                    <TouchableOpacity 
                        style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, height: 100,}}
                        onPress={() => navigation.push('UserProfileSCR', {profile: item})}
                        key={index}
                    >
                        <View style={{width: 90, height: 90, borderRadius: 50, overflow: 'hidden'}}>
                            <Image
                                // source={require('../../assets/test.png')}
                                source={{uri: item.avatar}}
                                resizeMode='cover'
                                style={{width: '100%', height: '100%'}}
                            ></Image>
                        </View>
                        <View style={{width: '72%', flexDirection: 'row', marginLeft: 12}}>
                            <View style={{width: '45%', justifyContent: 'space-between'}}>
                                <Text style={{fontSize: 16, fontWeight: 'bold', width: '100%'}} numberOfLines={1} ellipsizeMode='tail'>{item.userName}</Text>
                                <TouchableOpacity
                                    style={{width: '100%', height: '55%', backgroundColor: '#0865fe', borderRadius: 8, justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => fetchAcceptFriend(item._id)}
                                >
                                    <Text style={{color: '#fff', fontWeight: '700'}}>Xác nhận</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{width: 10}}></View>
                            <View style={{width: '45%', alignItems:'flex-end', justifyContent: 'space-between'}}>
                                {/* <Text style={{color: '#676768'}}>{format('2016-06-12')}</Text> */}
                                <Text style={{color: '#676768'}}><TimeAgo time={item.createdAt}></TimeAgo></Text>
                                <TouchableOpacity
                                    style={{width: '100%', height: '55%', backgroundColor: '#cdcfd4', borderRadius: 8, justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => fetchDeleteRequest(item._id)}
                                >
                                    <Text style={{color: '#000', fontWeight: '700'}}>Xóa</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
                
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '94%',
        height: '100%'
    }
})