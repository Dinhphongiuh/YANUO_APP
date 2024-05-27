import { useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback } from 'react-native';
import { Keyboard } from 'react-native';
import { useDispatch } from 'react-redux';
import {setSaveEmail, setSaveUserName} from '../redux/slices/sigupSlice'

export default function App({navigation}) {
  const [isFocused, setIsFocused] = useState(false);
//   const [userName, setUserName] = useState('');
  const [Email, setEmail] = useState('');
  const [heightVal, setHeightVali] = useState(new Animated.Value(0));
  const _valOpacity = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();

  const checkNull = (t) => {
    setIsFocused(t);
    Animated.timing(_valOpacity, {
      toValue: Email.length > 0 ? 0 : 1,
      duration: 100,
      useNativeDriver: false,
    }).start();
    Animated.timing(heightVal, {
      toValue: Email.length > 0 ? 0 : 30,
      duration: 200,
      useNativeDriver: false
    }).start()
  };

  const handleSGNext = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(Email))
    {
      dispatch(setSaveEmail(Email));
      navigation.push('sigupUserPhoneSCR');
    }
  }

    return (
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
      >
        <SafeAreaView style={styles.container}>
          <View style={{flexDirection: 'row', width: '90%', height: 35, alignItems: 'center'}}>
                <TouchableOpacity
                    style={{}}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={require('./Icon/BackIcon.png')}
                        style={{width: 18, height: 18}}
                    ></Image>
                </TouchableOpacity>
                <Text style={{fontSize: 18, marginLeft: 16, color: '#fff', fontWeight: '600'}}>Tạo tài khoản</Text>
          </View>
          <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.content}>
              <View style={{width: '95%', marginTop: 10}}>
                <Text style={{fontSize: 18, fontWeight: '500', paddingBottom: 10}}>Email</Text>
                <View style={{borderBottomWidth: 1, borderBlockColor: isFocused ?  '#21d0f4': '#dee0e2', flexDirection: 'row'}}>
                              <TextInput
                                  placeholder='Example@gmail.com'
                                  style={{fontSize: 18, width: '95%', paddingBottom: 10}}
                                  // keyboardType='te'   
                                  onFocus={() => checkNull(true)}
                                  // onBlur={() => setIsFocused(false)}
                                  onBlur={() => checkNull(false)}
                                  onChangeText={(text) => {setEmail(text); checkNull(true)}} 
                                  value={Email}
                              ></TextInput>
                              {Email.length > 0 && isFocused ? 
                              <TouchableOpacity
                                  onPress={() => setEmail('')}
                              >
                                  <Text style={{color: '#d2d4d8', fontSize: 16}}>x</Text>
                              </TouchableOpacity> : null}
                  </View>
                  <Animated.View style={{opacity: _valOpacity, height: heightVal}}>
                    <Text style={{fontSize: 16, paddingTop: 10, paddingBottom: 10, color: '#fb4e5d'}}>Vui lòng nhập Email</Text>
                  </Animated.View>
                  <Text style={{paddingTop: 10, paddingBottom: 10}}>Lưu ý khi đặt tên: </Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: 20, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                      <View style={{width: 5, height: 5, borderRadius: 5, backgroundColor: '#000'}}></View>
                    </View>
                    <Text style={{fontSize: 15, paddingLeft: 5}}>Không vi phạm</Text>
                    <TouchableOpacity><Text style={{color: '#1a9fdf'}}> Quy định đặt tên trên Yanuo.</Text></TouchableOpacity>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: 20, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                      <View style={{width: 5, height: 5, borderRadius: 5, backgroundColor: '#000'}}></View>
                    </View>
                    <Text style={{fontSize: 15, paddingLeft: 5, width: '90%'}}>Nên sử dụng tên thật giúp bạn bè dễ nhận ra bạn</Text>
                  </View>
              </View>
                <View style={{width: '95%', height: 65, justifyContent: 'center', alignItems: 'flex-end'}}>
                  <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 30, backgroundColor: '#89cdfe',justifyContent: 'center', alignItems: 'center'}}
                    // onPress={() => {userName.length > 0 ? navigation.push('sigupUserPhoneSCR', {userName: userName}) : null}}
                    onPress={() => handleSGNext()}
                  >
                    <Image
                      source={require('./Icon/arrowRight.png')}
                      resizeMode='contain'
                      style={{width: 20, height: 20}}
                    ></Image>
                  </TouchableOpacity>
                </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#009ef9',
  },
  content:{
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
}
});
      