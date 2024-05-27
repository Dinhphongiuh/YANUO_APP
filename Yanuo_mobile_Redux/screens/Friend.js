import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, TextInput, StatusBar, Modal, Button } from 'react-native';
import FriendRequest from './components/FriendRequest';
import { useState } from 'react';
import client from '../api/client';
import { useDispatch, useSelector } from 'react-redux';

const {height, width} = Dimensions.get('window');
export default function App({navigation}) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const myProfile = useSelector(state => state.meSlice.userProfile);

    const findFriend = async() => {
        try
        {
            const res = await client.get(`/search/${phoneNumber}`);
            if (res.data.success)
            {
                const profile = res.data.user;
                if (profile.phoneNumber === myProfile.phoneNumber)
                {
                    navigation.push('ProfileSCR');
                }
                else
                    navigation.push('UserProfileSCR', {profile: profile});
            }
            else
            {
                // console.log("số điện thoại này chưa tham gia Yanuo")
                setModalVisible(true);
            }
        }
        catch (error)
        {
          console.log(error.message);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'}></StatusBar>
            {/* Header */}
            <View style={{width: '90%', height: 50, borderBottomWidth: 0, height: 45, borderColor: '#cfcfd1', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity
                    style={{}}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={require('./Icon/ChevronLeft.png')}
                        resizeMode='contain'
                        style={{width: 20, height: 20}}
                    ></Image>
                </TouchableOpacity>
                <View style={{width: '70%', height: 35, borderWidth: 1, borderColor: '#b3b3b3', borderRadius: 8, justifyContent: 'center'}}>
                    <TextInput
                        placeholder='Nhập số điện thoại'
                        style={{padding: 5}}
                        keyboardType='numeric'
                        onChangeText={(value) => setPhoneNumber(value)}
                    ></TextInput>
                </View>
                {phoneNumber.length != 10 ? 
                    <View
                        style={{width: 35, height: 35, backgroundColor: '#d2d6d9', borderRadius: 30, justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Image
                            source={require('./Icon/arrowRight.png')}
                            resizeMode='contain'
                            style={{width: '60%', height: '60%'}}
                        ></Image>
                    </View> :
                        <TouchableOpacity
                            style={{width: 35, height: 35, backgroundColor: '#0865fe', borderRadius: 30, justifyContent: 'center', alignItems: 'center'}}
                            // onPress={() => navigation.push('UserProfileSCR')}
                            onPress={findFriend}
                        >
                        <Image
                            source={require('./Icon/arrowRight.png')}
                            resizeMode='contain'
                            style={{width: '60%', height: '60%'}}
                        ></Image>
                    </TouchableOpacity>
                }
            </View>
            <View style={{width: '94%', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, height: 50, borderColor: '#cfcfd1', marginTop: 10}}>
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    <TouchableOpacity
                        style={{backgroundColor: '#e4e6eb', width: 100, justifyContent: 'center', alignItems: 'center', height: 35, borderRadius: 18}}
                        onPress={() => navigation.push('ListFriendSCR')}
                    >
                        <Text style={{color: '#000', fontWeight: '600', fontSize: 16}}>Bạn bè</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{backgroundColor: '#e4e6eb', width: 100, justifyContent: 'center', alignItems: 'center', height: 35, borderRadius: 18, marginHorizontal: 10}}
                    >
                        <Text style={{color: '#000', fontWeight: '600', fontSize: 16}}>Danh bạ</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{width: width, height: height}}
                >
                    <View style={{width: '100%', alignItems: 'center', marginTop: 15}}>
                        <FriendRequest navigation={navigation}></FriendRequest>
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* modal */}
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
                <Text style={{textAlign: 'center', fontSize: 18, fontWeight: '600'}}>Thông báo</Text>
                <Text style={{textAlign: 'center', marginBottom: 20}}>Số điện thoại chưa đăng ký tài khoản hoặc không cho phép tìm kiếm.</Text>

                <View style={{width: '100%', borderTopWidth: 1, borderColor: '#cfcfd1'}}></View>
                <Button
                    title="Đóng"
                    onPress={() => setModalVisible(!modalVisible)}
                />
                </View>
            </Modal>
            {modalVisible ? 
                <View style={styles.dimmedBackground}></View> : null
            }
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
    },
    dimmedBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        height: '200%',
        width: '100%'
    },
});