import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, TextInput, Keyboard, } from 'react-native';
import React, { useRef, useState } from 'react';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function App({navigation, userData, groupName, chat, setModalCallAudioVisible})
{
    console.log('333', userData);
    // const userName = userData.userName != null ? userData.userName : '';
    // console.log('123', chat.members.length)
    return(
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.goBack()}
              style={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center'}}
            >
              <Image
                style={{width: 25, height: 25}}
                resizeMode='contain'
                source={require('./Icon/BackIcon.png')}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity
                style={{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'flex-start'}}
                onPress={() => navigation.push('ChatController', chat={chat})}
            >
                {groupName ?
                    <View>
                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>{groupName}</Text>
                        <Text style={{color: '#ccc', fontSize: 12}}>{chat.members.length} thành viên</Text>
                    </View> 
                    :
                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>{userData.userName}</Text>
                }
            </TouchableOpacity>
            <TouchableOpacity
                style={{width: 35}}
                onPress={() => setModalCallAudioVisible(true)}
            >
                <Image
                    source={require('./Icon/callIcon.png')}
                    resizeMode='contain'
                    style={{width: 25, height: 25}}
                ></Image>
            </TouchableOpacity>
            <TouchableOpacity
                style={{width: 35}}
            >
                <Image
                    source={require('./Icon/callVideo.png')}
                    resizeMode='contain'
                    style={{width: 25, height: 25}}
                ></Image>
            </TouchableOpacity>
            <TouchableOpacity
                style={{width: 35}}
                onLongPress={() => navigation.push('ChatController')}
            >
                <Image
                    source={require('./Icon/list.png')}
                    resizeMode='contain'
                    style={{width: 25, height: 25}}
                ></Image>
            </TouchableOpacity>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '95%', 
        height: 50, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
    }
});