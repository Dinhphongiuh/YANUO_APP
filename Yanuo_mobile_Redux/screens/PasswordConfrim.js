import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {isValidObjField, updateError} from '../utils/validator';
import client from '../api/client';
import { StackActions } from '@react-navigation/native';

export default function App({navigation}) {
    // 
    const [userInfo, setUserInfo] = useState({
        userName: useSelector(state => state.sigupScreenSlice.userName),
        phoneNumber: useSelector(state => state.sigupScreenSlice.phoneNumber),
        password: '',
        confirmPassword: '',
        email: useSelector(state => state.sigupScreenSlice.Email),
        isActived: false,
    });

    const {userName, password, confirmPassword, phoneNumber} = userInfo;

    const [isFocusedPW, setIsFocusedPW] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);

    const [isFocusedPWC, setIsFocusedPWC] = useState(false);
    const [passwordShowC, setPasswordShowC] = useState(false);
    const [error, setError] = useState('');

    // 
    const validationSchema = Yup.object({
        password: Yup.string().trim().min(8, 'Password is too short!').required('Password is required!'),
        confirmPassword: Yup.string().equals([Yup.ref('password'), null], 'Password does not match!')
    })
    // 

    const handleOnChangeText = (value, fieldName) => {
        setUserInfo({...userInfo, [fieldName]: value});
    };

    const valPassword = () => {
        if (!isValidObjField(userInfo))
            return updateError('không được để trống!', setError);
        if (!password.trim() || password.length < 8)
            return updateError('mật khẩu không được ít hơn 8 ký tự!', setError);
        if (password !== confirmPassword)
            return updateError('mật khẩu nhập lại không chính xác!', setError);
        return true;
    }

    const onCreateAccount = async (values, formikActions) => {
        // if (valPassword)
        // {
            // console.log({userName: userName, phoneNumber: phoneNumber, password: password, confirmPassword: confirmPassword});
            console.log(values);
            const res = await client.post('/create-user', {...values});
            if (res.data.success)
            {
                const signInRes = await client.post('/sign-in', {phoneNumber: values.phoneNumber, password: values.password});
                if (signInRes.data.success)
                {
                    // await AsyncStorage.setItem('token', signInRes.data.token);
                    navigation.dispatch(
                        StackActions.replace('genderAndBirthSCR', {
                            token: signInRes.data.token
                        })
                    )
                    // navigation.push('genderAndBirthSCR', {token: });
                    
                }
            }
            console.log(res.data);
        // }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={{flexDirection: 'row', width: '90%', height: 35, alignItems: 'center'}}>
                    <Text style={{fontSize: 18, marginLeft: 16, color: '#fff', fontWeight: '600'}}>Tạo mật khẩu</Text>
                </View>
                <View style={styles.content}>
                    <Formik
                        initialValues={userInfo} onSubmit={onCreateAccount}
                    >
                        {({values, errors, handleSubmit, handleChange, isSubmitting}) => {
                            const {userName, phoneNumber, password, confirmPassword} = values;

                            return <>
                                <View style={{width: '96%', marginTop: 20}}>
                                    <Text style={styles.text}>Tạo mật khẩu</Text>
                                    <View style={{borderBottomWidth: 1, borderBlockColor: isFocusedPW ?  '#21d0f4': '#dee0e2', flexDirection: 'row'}}>
                                            <TextInput
                                                placeholder='Mật khẩu'
                                                style={{fontSize: 20, width: '90%', paddingBottom: 10, marginTop: 15}}
                                                onFocus={() => setIsFocusedPW(true)}
                                                onBlur={() => setIsFocusedPW(false)}
                                                secureTextEntry={!passwordShow}
                                                // onChangeText={(text) => setPassword(text)}
                                                onChangeText={handleChange('password')}
                                                onChange={valPassword}
                                                value={password}
                                            ></TextInput>
                                            <TouchableOpacity
                                                style={{justifyContent: 'center', alignItems: 'center'}}
                                                onPress={() => setPasswordShow(!passwordShow)}
                                            >
                                                <Text style={{fontSize: 18, color: '#7c8086', textAlign: 'right'}}>{passwordShow ? 'Ẩn' : 'Hiện'}</Text>
                                            </TouchableOpacity>
                                    </View>
                                    {error ? <Text style={{color: 'red', marginTop: 5, marginBottom: 5}}>{error}</Text> : null}
                                    <Text style={[styles.text, {marginTop: 30}]}>Nhập lại mật khẩu</Text>
                                    <View style={{borderBottomWidth: 1, borderBlockColor: isFocusedPWC ?  '#21d0f4': '#dee0e2', flexDirection: 'row'}}>
                                            <TextInput
                                                placeholder='Nhập lại mật khẩu'
                                                style={{fontSize: 20, width: '90%', paddingBottom: 10, marginTop: 15}}
                                                onFocus={() => setIsFocusedPWC(true)}
                                                onBlur={() => setIsFocusedPWC(false)}
                                                secureTextEntry={!passwordShowC}
                                                // onChangeText={(text) => setPasswordC(text)}
                                                onChangeText={handleChange('confirmPassword')}
                                                onChange={valPassword}
                                                value={confirmPassword}
                                            ></TextInput>
                                            <TouchableOpacity
                                                style={{justifyContent: 'center', alignItems: 'center'}}
                                                onPress={() => setPasswordShowC(!passwordShowC)}
                                            >
                                                <Text style={{fontSize: 18, color: '#7c8086', textAlign: 'right'}}>{passwordShowC ? 'Ẩn' : 'Hiện'}</Text>
                                            </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        style={{marginTop: 30, width: '100%', height: 50, backgroundColor: '#0397ff', borderRadius: 30, justifyContent: 'center', alignItems: 'center'}}
                                        // onPress={onCreateAccount}
                                        isSubmitting={isSubmitting}
                                        onPress={handleSubmit}
                                    >
                                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>Xác nhận</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        }}
                    </Formik>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
};

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
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600'
    }
});