import { useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback } from 'react-native';
import { Keyboard } from 'react-native';
import loginApi from '../api/loginApi';
import ConfirmOtpModal from './ConfirmSendOtp';
import { useDispatch, useSelector } from 'react-redux';
import { setConfirmModal } from '../redux/slices/sigupSlice';
import client from '../api/client';

export default function App({navigation, route}) {
  const [isFocused, setIsFocused] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const check_opacity = useRef(new Animated.Value(0)).current;
  const check_opacity1 = useRef(new Animated.Value(0)).current;
  const [check, setCheck] = useState(false);
  const [check1, setCheck1] = useState(false);
  const [valiPhone, setVaiPhone] = useState("");
//   const [confirmModal, setConfirmModal] = useState(false);
    const confirmModal = useSelector(state => state.sigupScreenSlice.confirmModal);
    const dispatch = useDispatch();

//   const userName = route.params.userName;

  const handlerCheck = () => {
  setCheck(!check);
    Animated.timing(check_opacity, {
        toValue: check ? 0 : 1,
        duration: 100,
        useNativeDriver: true
    }).start();
  }
  const handlerCheck1 = () => {
    setCheck1(!check1);
      Animated.timing(check_opacity1, {
          toValue: check1 ? 0 : 1,
          duration: 100,
          useNativeDriver: true
      }).start();
    }
    const handleSigup = async() => {
        Keyboard.dismiss();
        if (check && check1 && phoneValidation())
        {
            try
            {
                const res = await client.get(`/search/${phoneNumber}`);
                console.log(res.data);
                if (res.data.success)
                {
                    setVaiPhone("số điện thoại đã tồn tại")
                    return false;
                }
                else
                {
                    dispatch(setConfirmModal(true));
                }
            }
            catch (error)
            {
                console.log(error)
            }
            // Keyboard.dismiss();
            // dispatch(setConfirmModal(true));
        }
        // vali date number phone
    }

    const checkPhoneUsed = async() => {
        try
        {
            const res = await client.get(`/search/${phoneNumber}`);
            console.log(res.data);
            if (res.data.success)
            {
                return true;
            }
            else
            {
                setVaiPhone("số điện thoại đã tồn tại")
                return false;
            }
        }
        catch (error)
        {
            console.log(error)
        }
        return false;
    }

    const phoneValidation = () => {
        if (!phoneNumber.trim() === "")
        {
            setVaiPhone("số điện thoại không được để trống");
            return false;
        }
        else if (!/^(0)\d{9}$/.test(phoneNumber))
        {
            setVaiPhone("Số điện thoại phải bắt đầu là 0 và đúng 10 số");
            return false;
        }
        
        setVaiPhone("");
        return true;
    }

    return (
        <TouchableWithoutFeedback
            onPress={() => {Keyboard.dismiss(); dispatch(setConfirmModal(false))}}
        >
            <SafeAreaView style={[styles.container]}>
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
                <View style={{width: '100%', marginTop: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: '100%', backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{padding: 5, width: '95%'}}>Nhập số điện thoại của bạn để tạo tài khoản mới</Text>
                    </View>
                <View style={{width: '95%', marginTop: 30}}>
                    <View style={{borderBottomWidth: 1, borderBlockColor: isFocused ?  '#21d0f4': '#dee0e2', flexDirection: 'row'}}>
                                <TextInput
                                    placeholder='Số điện thoại'
                                    style={{fontSize: 18, width: '95%', paddingBottom: 10}}
                                    keyboardType='numeric'   
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    onChangeText={(text) => setPhoneNumber(text)} 
                                    onEndEditing={() => phoneValidation()}
                                    // onChange={() => phoneValidation()}
                                    value={phoneNumber}
                                ></TextInput>
                                {phoneNumber.length > 0 && isFocused ? 
                                <TouchableOpacity
                                    onPress={() => setPhoneNumber('')}
                                >
                                    <Text style={{color: '#d2d4d8', fontSize: 16}}>x</Text>
                                </TouchableOpacity> : null}
                    </View>
                    {valiPhone.length > 0 ? <Text style={{color: 'red'}}>{valiPhone}</Text>:null}
                    <View style={{flexDirection: 'row', marginTop: 15, justifyContent: 'flex-start', alignItems: 'center'}}>
                        <TouchableOpacity 
                            style={{width: 30, height: 30, borderRadius: 10, borderWidth: 2, borderColor: '#dbdfe1', justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => handlerCheck()}
                        >
                            <Animated.Image
                                source={require('./Icon/SquaCheck.png')}
                                resizeMode='contain'
                                style={{width: 35, height: 35, opacity: check_opacity, borderRadius: 15}}
                            ></Animated.Image>
                        </TouchableOpacity>
                        <Text style={{paddingLeft: 10, fontSize: 12}}>Tôi đồng ý với các</Text>
                        <TouchableOpacity><Text style={{color: '#0e61e2', paddingLeft: 5, fontSize: 12}}>điều khoản sử dụng Yanuo</Text></TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 15, justifyContent: 'flex-start', alignItems: 'center'}}>
                        <TouchableOpacity 
                            style={{width: 30, height: 30, borderRadius: 10, borderWidth: 2, borderColor: '#dbdfe1', justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => handlerCheck1()}
                        >
                            <Animated.Image
                                source={require('./Icon/SquaCheck.png')}
                                resizeMode='contain'
                                style={{width: 35, height: 35, opacity: check_opacity1, borderRadius: 15}}
                            ></Animated.Image>
                        </TouchableOpacity>
                        <Text style={{paddingLeft: 10, fontSize: 12}}>Tôi đồng ý với các</Text>
                        <TouchableOpacity><Text style={{color: '#0e61e2', paddingLeft: 5, fontSize: 12}}>điều khoản mạng xã hội của Yanuo</Text></TouchableOpacity>
                    </View>
                </View>
                </View>
                    <View style={{width: '95%', height: 65, justifyContent: 'center', alignItems: 'flex-end', zIndex: 1}}>
                    <TouchableOpacity
                        onPress={handleSigup}
                        style={{width: 40, height: 40, borderRadius: 30, backgroundColor: '#89cdfe',justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Image
                        source={require('./Icon/arrowRight.png')}
                        resizeMode='contain'
                        style={{width: 20, height: 20}}
                        ></Image>
                    </TouchableOpacity>
                    </View>
                </View>
                {confirmModal ? 
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <Animated.View style={[styles.confirmModal,]}>
                        <ConfirmOtpModal navigation={navigation} phoneNumber={phoneNumber}></ConfirmOtpModal>
                        </Animated.View>
                    </TouchableWithoutFeedback> : null
                }
                {confirmModal ? <View style={styles.dimBackground}></View> : null}
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
    },
        confirmModal: {
            position: 'absolute', 
            width: '100%', 
            height: '100%',
            shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        zIndex: 100
        },
        
        dimBackground: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            // backgroundColor: 'red',
            // opacity: 0.5,
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // Màu nền mờ gần với 
            zIndex: 2, // Đảm bảo nền nằm dưới cả confirmModal
          },
});
