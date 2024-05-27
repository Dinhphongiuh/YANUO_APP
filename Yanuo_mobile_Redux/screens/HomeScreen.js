import * as React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback, ScrollView } from 'react-native';
import HeaderView from './Header';
import HomeChatScreen from './HomeChatScreen';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenDropMenu } from '../redux/slices/HomeScreenSlice';
import { StatusBar } from 'react-native';
import { userChats } from '../api/ChatRequests';
import { useState } from 'react';
import { useEffect } from 'react';

const {height, width} = Dimensions.get('window');
export default function App({navigation}) {
  // const [openDropMenu, setOpenDropMenu] = React.useState(false);
  const openDropMenu = useSelector(state => state.homeScreenSlice.openDropMenu);
  
  const dispatch = useDispatch();
  const menuPosision = React.useRef(new Animated.Value(0)).current;
  const menuTranslate_y = React.useRef(new Animated.Value(-15)).current;

  // const toggleVisibilityOn = () => {
    // setOpenDropMenu(!openDropMenu);
    // dispatch(setOpenDropMenu(!openDropMenu));
    Animated.timing(menuPosision, {
      toValue: openDropMenu ? 1 : 0,
      duration: !openDropMenu ? 10 : 5,
      useNativeDriver: true,
    }).start();
    Animated.timing(menuTranslate_y, {
      toValue: openDropMenu ? 0 : -15,
      duration: !openDropMenu ? 100 : 50,
      useNativeDriver: true,
    }).start();
  // };

      // chat
      const profile = useSelector(state => state.meSlice.userProfile);

      const [chats, setChats] = useState([]);
      const [onlineUsers, setOnlineUsers] = useState([]);
      const [currentChat, setCurrentChat] = useState(null);
      const [sendMessage, setSendMessage] = useState(null);
      const [receivedMessage, setReceivedMessage] = useState(null);
      console.log('cur: ', currentChat);
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
      }, [profile._id]);

      // console.log(chats);
  
  return (
    <TouchableWithoutFeedback
      // onPress={() => {openDropMenu ? toggleVisibilityOn() : null}}
    >
      <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content"></StatusBar>
        <HeaderView screen={"Home"}></HeaderView>
        <View style={{width: '100%', flex: 1, backgroundColor: '#fff', height: '100%'}}>
          <View 
            style={{backgroundColor: '#f1f3f5', width: width, height: '100%',  position: 'relative', flexDirection: 'row', opacity: openDropMenu ? '0.4' : null}}
          >
            {/* content */}
            <ScrollView
              style={{width: width, minHeight: '100%', backgroundColor: '#fff'}}
              scrollEnabled
              showsVerticalScrollIndicator = {true}
              nestedScrollEnabled
            >
              <HomeChatScreen navigation={navigation}></HomeChatScreen>
            </ScrollView>
          </View>
          <Animated.View
            style={[{ opacity: menuPosision, transform: [{translateY: menuTranslate_y}]}, styles.triangle]}
          ></Animated.View>
          {openDropMenu ? 
            <Animated.View
              onStartShouldSetResponder={() => true} // ngăn TouchableWithoutFeedback
              style={{width: width / 1.5, height: 'auto', backgroundColor: '#f9fafd', position: 'absolute', zIndex: 999, top: 15, left: width / 3.2, borderRadius: 10, opacity: 1, transform: [{translateY: menuTranslate_y}], shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.32, shadowRadius: 5.46, elevation: 9, justifyContent: 'space-between'}}
            >
              <View style={{borderBottomWidth: 1, borderBlockColor: '#c2c6cc' }}>
                <TouchableOpacity
                  style={{width: '100%', height: 20, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginTop: 10, marginLeft: 30, marginBottom: 15}}
                  onPress={() => navigation.push('FriendSCR')}
                >
                  <Image
                    source={require('./Icon/AddUserIcon.png')}
                    resizeMode='contain'
                    style={{width: 24, height: 24}}
                  ></Image>
                  <Text style={styles.dropMenu_btn_text}>Thêm bạn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{width: '100%', height: 20, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginTop: 10, marginLeft: 30, marginBottom: 15}}
                  onPress={() => navigation.push('CreateGroupSCR')}
                >
                  <Image
                    source={require('./Icon/addGroupU.png')}
                    resizeMode='contain'
                    style={{width: 24, height: 24}}
                  ></Image>
                  <Text style={styles.dropMenu_btn_text}>Tạo nhóm</Text>
                </TouchableOpacity>
              </View>
              <View style={{borderBottomWidth: 1, borderBlockColor: '#c2c6cc' }}>
                <TouchableOpacity
                  style={{width: '100%', height: 20, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginTop: 0, marginLeft: 30, marginBottom: 15, marginTop: 10}}
                >
                  <Image
                    source={require('./Icon/messageHiden.png')}
                    resizeMode='contain'
                    style={{width: 24, height: 24}}
                  ></Image>
                  <Text style={styles.dropMenu_btn_text}>Tin nhắn đang chờ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{width: '100%', height: 20, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginTop: 10, marginLeft: 30, marginBottom: 15}}
                >
                  <Image
                    source={require('./Icon/CalendarIcon.png')}
                    resizeMode='contain'
                    style={{width: 24, height: 24}}
                  ></Image>
                  <Text style={styles.dropMenu_btn_text}>Lịch Yanuo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{width: '100%', height: 20, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginTop: 10, marginLeft: 30, marginBottom: 15}}
                >
                  <Image
                    source={require('./Icon/VideoIcon.png')}
                    resizeMode='contain'
                    style={{width: 24, height: 24}}
                  ></Image>
                  <Text style={styles.dropMenu_btn_text}>Tạo cuộc gọi nhóm</Text>
                </TouchableOpacity>
              </View>
              <View style={{}}>
                <TouchableOpacity
                  style={{width: '100%', height: 20, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginTop: 10, marginLeft: 30, marginBottom: 15}}
                >
                  <Image
                    source={require('./Icon/DesktopIcon.png')}
                    resizeMode='contain'
                    style={{width: 24, height: 24}}
                  ></Image>
                  <Text style={styles.dropMenu_btn_text}>Thiết bị đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </Animated.View> : null
          }
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#009ef9',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#f9fafd',
    position: 'absolute',
    left: width - 55,
    top: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  dropMenu_btn_text:{
    fontSize: 16,
    paddingRight: 30,
    paddingLeft: 15,
  }
});
