import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Dimensions, Modal, StatusBar } from 'react-native';
// import {MediaStream} from 'react-native-webrtc';
// import {ClientRoleType} from 'react-native-agora';

export default function CallAudio({setModalCallAudioVisible, userData}) 
{
    // console.log('dax', userData);
    const handleCancePhone = () => {
        setModalCallAudioVisible(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'light-content'} backgroundColor='lightgreen'></StatusBar>
            {/* Header */}
            <View style={{width: '94%', height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity>
                    <Image
                        source={require('../Icon/angleDownFF.png')}
                        resizeMode='contain'
                        style={{width: 25, height: 25}}
                    ></Image>
                </TouchableOpacity>
                <View style={{width: '68%', marginLeft: 30}}>
                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>{userData.userName}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity>
                        <Image
                            source={require('../Icon/userAddFF.png')}
                            resizeMode='contain'
                            style={{width: 25, height: 25}}
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={require('../Icon/dsIcon.png')}
                            resizeMode='contain'
                            style={{width: 25, height: 25, marginLeft: 15}}
                        ></Image>
                    </TouchableOpacity>
                </View>
            </View>
            {/* content */}
            <View style={{width: '94%', height: '80%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 90}}>
                <View style={{width: 120, height: 120, borderRadius: 100, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                        source={{uri: userData.avatar}}
                        resizeMode='cover'
                        style={{width: '100%', height: '100%'}}
                    ></Image>
                </View>
                <Text style={{color: '#fff', fontWeight: 'bold', marginTop: 20, fontSize: 20}}>{userData.userName}</Text>
                <Text style={{color: '#fff',}}>Đang gọi...</Text>
            </View>
            <View style={{width: '94%', height: 60, backgroundColor: '#232322', marginBottom: 100, borderRadius: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20}}>
                <TouchableOpacity>
                    <Image
                        source={require('../Icon/videoSlash.png')}
                        resizeMode= 'contain'
                        style={{width: 35, height: 35}}
                    ></Image>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{width: 45, height: 45, backgroundColor: '#ff4941', borderRadius: 40, alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => handleCancePhone()}
                >
                    <Image
                        source={require('../Icon/phoneDown.png')}
                        resizeMode='contain'
                        style={{width: '80%', height: '80%'}}
                    ></Image>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#353535',
    },
});