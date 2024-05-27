import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { isValidObjField, isValidPhoneNumber, updateError } from '../utils/validator';
import client from '../api/client';
import { useDispatch } from 'react-redux';
import {setCurrentUserId, setLogin} from '../redux/slices/globalSlice';
import { setUserProfile } from '../redux/slices/meSlice';
import AppLoader from './components/AppLoader';

export default function LoginScreen({navigation}){
    const [isFocused, setIsFocused] = useState(false);
    const [isFocusedPW, setIsFocusedPW] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);
    const [loginPending, setLoginPending] = useState(false);
    const dispatch = useDispatch();
    // 
    const [userInfo, setUserInfo] = useState({
        phoneNumber: '',
        password: '',
    });
    const [error, setError] = useState('');
    const {phoneNumber, password} = userInfo;

    const isValidForm = () => {
        if (!isValidObjField(userInfo))
        {
            return updateError('Require all fields!', setError);
        }
        if (!isValidPhoneNumber(phoneNumber))
        {
            return updateError('Invalid phone number', setError);
        }
        if (!password.trim() || password.length < 8)
        {
            return updateError('Password is too short!', setError);
        }
        return true;
    }

    const handleOnChangeText = (value, fieldName) => {
        setUserInfo({...userInfo, [fieldName]: value});
    }
    // 
    const data = [{"id": 1, "user": '0339122327', "password": "Admin"}];

    const submitForm = async () => {
        Keyboard.dismiss();
        setLoginPending(true);
        if (isValidForm())
        {
            try
            {
                const res = await client.post('/sign-in', {...userInfo});
                if (res.data.success)
                {
                    // console.log(res.data.user);
                    // await AsyncStorage.setItem('token', res.data.token);
                    // dispatch(setLogin(true));
                    // dispatch(setUserProfile(res.data.user));
                    // navigation.push('MainTabs1');
                    // setLoginPending(false);
                    setTimeout(async() => {
                        await AsyncStorage.setItem('token', res.data.token);
                        dispatch(setLogin(true));
                        dispatch(setUserProfile(res.data.user));
                        dispatch(setCurrentUserId(res.data.user._id));
                        navigation.push('MainTabs1');
                        setLoginPending(false);
                    }, 2000)
                }
                else if (!res.data.success)
                {
                    console.log('Invalid account!');
                    setError('error account');
                    setLoginPending(false);
                }
            }
            catch (error)
            {
                console.log(error.message);
                setLoginPending(false);

            }
        }
    }

    const onLogin = (phoneNumber, password) => {
        const user = data.find(u => u.user === phoneNumber && password === password);
        if (user)
        {
            // 
            const token = 'testToken';
            AsyncStorage.setItem('token', token);
            
            return true;
        }
        return false;
    }
    // 
    useEffect(() => {
        if (error)
        {
            setLoginPending(false);
            
        }
    })
    
    return (
        <>
        <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content"></StatusBar>
                <View style={{flexDirection: 'row', width: '85%', height: 35}}>
                    <TouchableOpacity
                        style={{}}
                        onPress={() => navigation.goBack()}
                    >
                        <Image
                            source={require('./Icon/BackIcon.png')}
                            style={{width: 20, height: 20}}
                        ></Image>
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, marginLeft: 16, color: '#fff', fontWeight: '600'}}>Đăng nhập</Text>
                </View>
                <View style={styles.content}>
                    <View style={{backgroundColor: '#f8fafc', height: 40, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{textAlign: 'center', fontWeight: '400'}}>Vui lòng nhập số điện thoại và mật khẩu để đăng nhập</Text>
                    </View>
                    <TouchableWithoutFeedback 
                        onPress={() => Keyboard.dismiss()}
                    >
                        <View style={{width: '90%', height: '80%'}}>
                            <View style={{borderBottomWidth: 1, borderBlockColor: isFocused ?  '#21d0f4': '#dee0e2', flexDirection: 'row'}}>
                                <TextInput
                                    placeholder='Số điện thoại'
                                    style={{fontSize: 20, width: '95%', paddingBottom: 10}}
                                    keyboardType='numeric'   
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    // onChangeText={(text) => setAccount(text)} 
                                    value={phoneNumber}
                                    onChangeText={(value) => handleOnChangeText(value, 'phoneNumber')}
                                ></TextInput>
                                {phoneNumber.length > 0 && isFocused ? 
                                <TouchableOpacity
                                    onPress={() => handleOnChangeText('', 'phoneNumber')}
                                >
                                    <Text style={{color: '#d2d4d8', fontSize: 16}}>x</Text>
                                </TouchableOpacity> : null}
                            </View>
                            <View style={{borderBottomWidth: 1, borderBlockColor: isFocusedPW ?  '#21d0f4': '#dee0e2', flexDirection: 'row'}}>
                                <TextInput
                                    placeholder='Mật khẩu'
                                    style={{fontSize: 20, width: '90%', paddingBottom: 10, marginTop: 15}}
                                    onFocus={() => setIsFocusedPW(true)}
                                    onBlur={() => setIsFocusedPW(false)}
                                    secureTextEntry={!passwordShow}
                                    // onChangeText={(text) => setPassword(text)}
                                    value={password}
                                    onChangeText={(value) => handleOnChangeText(value, 'password')}
                                ></TextInput>
                                <TouchableOpacity
                                    style={{justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => setPasswordShow(!passwordShow)}
                                >
                                    <Text style={{fontSize: 18, color: '#7c8086', textAlign: 'right'}}>{passwordShow ? 'Ẩn' : 'Hiện'}</Text>
                                </TouchableOpacity>
                            </View>
                            {error ? <Text style={{color: 'red', fontSize: 16}}>Tài khoản hoặc mật khẩu không chính xác</Text> : null}
                            <TouchableOpacity
                                style={{marginTop: 15}}
                                onPress={() => navigation.push('recoveryAccount')}
                            >
                                <Text style={{color: '#539dd7', fontSize: 14, fontWeight: '600'}}>Lấy lại mật khẩu</Text>
                            </TouchableOpacity>

                            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 25}}>
                                {phoneNumber.length > 0 && password.length > 0 ? 
                                    <TouchableOpacity
                                        // onPress={() => onLogin(account, password) ? navigation.push('MainTabs') : null}
                                        onPress={submitForm}
                                        style={{width: '65%', height: 50, backgroundColor: '#0397ff', justifyContent: 'center', alignItems: 'center', borderRadius: 40}}
                                    >
                                        <Text style={{color: '#fff', fontWeight: '500', fontSize: 18}}>Đăng nhập</Text>
                                    </TouchableOpacity>:
                                    <View
                                        style={{width: '65%', height: 50, backgroundColor: '#c0d4e3', justifyContent: 'center', alignItems: 'center', borderRadius: 40}}
                                    >
                                        <Text style={{color: '#fff', opacity: 0.8}}>Đăng nhập</Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableOpacity style={{marginBottom: 50}}>
                        <Text style={{textDecorationLine: 'underline', fontSize: 16, color: '#b2b2b2', fontWeight: '500'}}>Các câu hỏi thường gặp</Text>
                    </TouchableOpacity>
                </View>
        </SafeAreaView>
        {loginPending ? <AppLoader/> : null}
        </>
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