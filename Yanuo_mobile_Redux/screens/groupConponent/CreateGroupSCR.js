import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback, ScrollView, StatusBar, TextInput, FlatList } from 'react-native';
import {useSelector} from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from '../../api/client';
import { createGroupChat } from '../../api/ChatRequests';

const {height, width} = Dimensions.get('window');
const CATEGORY = [{key: 'Bạn bè'}, {key: 'Danh bạ'}];
export default function App({navigation}) {
    const [isFocused, setIsFocused] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const indicatorPosition = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef();
    const heightAmin = useRef(new Animated.Value(0)).current;
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');

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
            toValue: selectedTab * (width / 2),
            useNativeDriver: false,
          }).start();
        }
    };

    // 
    const profile = useSelector(state => state.meSlice.userProfile);   
    const [listFriend, setListFriend] = useState([]);
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
    }

    // create groupUser
    const createGroupChatAPI = async() => {
        const createForm = {
            userId: profile._id,
            members: selectedMembers,
            groupName: groupName.trim() === "" ? "nhóm chưa đặt tên" : groupName 
        }
        try
        {
            const {data} = await createGroupChat(createForm);
            // console.log(res.data);

            if (data)
                navigation.goBack();
            else
                setError("nhóm phải có trên 2 thành viên")
        }
        catch (error) {
            console.log(error)
        }
    }

    // console.log('selec', selectedMembers);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'}></StatusBar>
            {/* header */}
            <View style={{width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#dedede'}}>
                <TouchableOpacity
                    style={{width: 25, height: 25, marginHorizontal: 14}}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={require('../Icon/xMarkBlack.png')}
                        resizeMode='contain'
                        style={{width: '100%', height: '100%'}}
                    ></Image>
                </TouchableOpacity>
                <View style={{paddingHorizontal: 0}}>
                    <Text style={{fontSize: 16, fontWeight: '600'}}>Nhóm mới</Text>
                    <Text style={{color: '#6e6e6e'}}>đã chọn: {!selectedMembers.length > 0 ? 0 : selectedMembers.length}</Text>
                </View>
            </View>
            {/* content */}
            <View style={{width: '100%', backgroundColor: '#fff', alignItems: 'center', height: '100%',}}>
                <View style={{width: '90%', flexDirection: 'row', marginVertical: 15, alignItems: 'center'}}>
                    <TouchableOpacity
                        style={{width: 80, height: 80, borderRadius: 100, backgroundColor: '#ecf0f2', justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Image
                            source={require('../Icon/Camera.png')}
                            resizeMode='contain'
                            style={{width: '60%', height: '60%'}}
                        ></Image>
                    </TouchableOpacity>
                    <View style={{width: '60%', justifyContent: 'space-between', marginLeft: 15, borderBottomWidth: 1, borderColor: isFocused ? '#21d0f4' : '#fff', flexDirection: 'row',}}>
                        <TextInput
                            placeholder='Đặt tên nhóm'
                            placeholderTextColor={'#7e848b'}
                            style={{color: '#000', fontSize: 18, paddingVertical: 8}}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            value={groupName}
                            onChangeText={(value) => setGroupName(value)}
                        ></TextInput>
                        <TouchableOpacity
                            
                        >
                            <Image
                                source={require('../Icon/EmoijIcon.png')}
                                resizeMode='contain'
                                style={{width: 60, height: 50}}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{width: '90%', height: 40, backgroundColor: '#fafafa', borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <TouchableOpacity
                        style={{width: 20, height: 20, justifyContent: 'center', alignItems: 'center', }}
                    >
                        <Image
                            source={require('../Icon/Search114.png')}
                            resizeMode='contain'
                            style={{width: '100%', height: '100%'}}
                        ></Image>
                    </TouchableOpacity>
                    <TextInput
                        placeholder='Tìm tên hoặc số điện thoại'
                        style={{fontSize: 16, marginLeft: 10, width: '80%'}}
                    ></TextInput>
                    {searchText.length > 0 ?
                        <TouchableOpacity
                            style={{marginRight: 15}}
                        >
                            <Text style={{fontSize: 20}}>x</Text>
                        </TouchableOpacity> : null
                    }
                </View>
                <View style={{width: '90%'}}>
                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TouchableOpacity
                            style={{width: '50%', alignItems: 'center', justifyContent: 'center', height: 40}}
                            onPress={() => handleTabPress(0)}
                        >
                            <Text style={{fontSize: 20}}>Bạn bè</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width: '50%', alignItems: 'center', justifyContent: 'center', height: 40}}
                            onPress={() => handleTabPress(1)}
                        >
                            <Text style={{fontSize: 20}}>Danh bạ</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{backgroundColor: '#d2d3d6', width: '100%', height: 2}}>
                        <Animated.View style={{borderWidth: 1, borderColor: '#006cf5', width: '40%', position: 'absolute', left: indicatorPosition}}></Animated.View>
                    </View>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        // showsHorizontalScrollIndicator={true}
                        style={{}}
                        snapToInterval={width}
                        decelerationRate={'fast'}
                        ref={scrollViewRef}
                        scrollEventThrottle={16}
                        onScroll={handleScroll}
                    >
                        <View style={[styles.page, { backgroundColor: '#fff' }]}>
                            {/* <Text>Trang 1</Text> */}
                            <ScrollView
                                style={{width: '100%', height: '10%'}}
                                showsVerticalScrollIndicator
                            >
                                {listFriend.map((item, index) => (
                                    <TouchableOpacity
                                        style={{width: '100%', height: 50, alignItems: 'center', flexDirection: 'row', marginVertical: 12}}
                                        onPress={() => handleSelectMember(item)}
                                        key={index}
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
                                    </View>
                                </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                        <View style={[styles.page, { backgroundColor: 'powderblue' }]}>
                            <Text>Trang 2</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
            <Animated.View style={{width: '100%', height: heightAmin, position: 'absolute', bottom: 0, alignItems: 'center', flexDirection: 'row', shadowColor: "#000", shadowOffset: {width: 2, height: 2}, shadowOpacity: 0.25, shadowRadius: 16.00, elevation: 24, backgroundColor: '#fff'}}>
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
                            onPress={() => createGroupChatAPI()}
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f7f7f7',
    },
    page: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        height: height
    },
});
