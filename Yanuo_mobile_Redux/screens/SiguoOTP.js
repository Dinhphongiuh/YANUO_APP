import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback } from 'react-native';
import { Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setConfirmModal } from '../redux/slices/sigupSlice';
import { verifyOTPCode } from '../api/OTP';

export default function App({navigation}) {
    const [isFocused, setIsFocused] = useState(null);
    const [otpNumber, setOtpNumber] = useState(['', '', '', '', '', '']);
    const refs = useRef([]);
    const otpNumberStr = otpNumber.join('');
    const Email = useSelector(state => state.sigupScreenSlice.Email);
    const [error, setError] = useState('');

    const [countDown, setCountDown] = useState(60);
    const [showResend, setShowResend] = useState(true);

    const [heightVal, setHeightVali] = useState(new Animated.Value(0));
    const _valOpacity = useRef(new Animated.Value(0)).current;

    const dispatch = useDispatch();

    const handleInputChange = (index, text) => {
        const newOtpNumber = [...otpNumber];
        newOtpNumber[index] = text;
        setOtpNumber(newOtpNumber);
        if (text.length === 0 && index > 0)
        {
            let newIndex = index - 1;
            while (newIndex >= 0 && newOtpNumber[newIndex] == '')
            {
                newIndex--;
            }
            if (newIndex >= 0)
            {
                refs.current[newIndex].focus();
            }
        }
        else if (text.length === 1 && index < otpNumber.length - 1)
        {
            refs.current[index + 1].focus();
        }
    };

    const handleInputFocus = (index) => {
        for (let i = index - 1; i >= 0; i--) {
            if (otpNumber[i] === '') {
                refs.current[i].focus();
                return;
            }
        }
        setIsFocused(index);
        refs.current[index].focus();
    };

    const handleInputBlur = (index) => {
        setIsFocused(null);
        refs.current[index].blur();
    }

    useEffect(() => {
        let interval;
        if (countDown > 0)
        {
            interval = setInterval(() => {
                setCountDown(prevContdown => prevContdown - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [countDown]);

    const handleResend = () => {
        setCountDown(60);
        setShowResend(false);
    };

    const handleConfirmOTP = async() => {
        const otpCode = otpNumber.join('');
        const data = {
            email: Email,
            otpCode
        }
        try {
            const res = await verifyOTPCode(data);
            // console.log(res.status);
            if (res.data.success)
            {
                navigation.push('PasswordConfrimSCR');
            }
            else
            {
                // console.log('sai');
            }
        } catch (error) {
            // console.log(error);
            setError('Mã xác minh không chính xác')
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
                        onPress={() => {navigation.goBack(); dispatch(setConfirmModal(false))}}
                    >
                        <Image
                            source={require('./Icon/BackIcon.png')}
                            style={{width: 18, height: 18}}
                        ></Image>
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, marginLeft: 16, color: '#fff', fontWeight: '600'}}>Nhập mã xác thực</Text>
            </View>
            <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.content}>
                <View style={{width: '100%', marginTop: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: '100%', backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{padding: 5, width: '95%'}}>Vui lòng không chia sẽ mã xác thực để tránh mất tài khoản</Text>
                    </View>
                <View style={{width: '95%', marginTop: 30}}>
                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <Image
                            source={require('./Icon/OTPIcon.png')}
                            resizeMode='contain'
                        ></Image>
                    </View>
                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>Đã gửi mã xác minh đến số Number</Text>
                        <Text style={{fontSize: 18, fontWeight: '400', color: '#838a93', marginTop: 5}}>Điền mã xác nhận đã nhận vào bên dưới</Text>
                        <View style={{marginTop: 15, justifyContent: 'space-between', flexDirection: 'row'}}>
                            {otpNumber.map((digit, index) => (
                                <View style={{borderBottomWidth: 1, borderBlockColor: isFocused === index ?  '#21d0f4': '#dee0e2', flexDirection: 'row', width: '10%', marginLeft: 8, marginRight: 8}}>
                                        <TextInput
                                            key={index}
                                            ref={(ref) => refs.current[index] = ref}
                                            style={{fontSize: 18, width: '100%', paddingBottom: 10, textAlign: 'center'}}
                                            keyboardType='numeric'   
                                            maxLength={1}
                                            // onFocus={() => setIsFocused(true)}
                                            onFocus={() => handleInputFocus(index)}
                                            // onBlur={() => setIsFocused(false)}
                                            onBlur={() => handleInputBlur(index)}
                                            // onChangeText={(text) => setPhoneNumber(text)}
                                            onChangeText={(text) => handleInputChange(index, text)} 
                                            value={digit}
                                            onKeyPress={({nativeEvent}) => {
                                                if (nativeEvent.key === 'Backspace')
                                                {
                                                    handleInputChange(index, '');
                                                }
                                            }}
                                        ></TextInput>
                                </View>
                            ))}
                        </View>
                        {
                            error.length > 0 ?
                            <View style={{opacity: 1, height: 30}}>
                                <Text style={{fontSize: 16, paddingTop: 10, paddingBottom: 10, color: '#fb4e5d'}}>{error}</Text>
                            </View> : null
                        }
                        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
                            {countDown > 0 ? (
                                <Text>Gửi lại mã<Text style={{color: '#1093ff'}}>({countDown})</Text> </Text>
                                ) : 
                                (
                                    <TouchableOpacity
                                        onPress={handleResend}
                                    >
                                        <Text style={{fontSize: 18, color: '#1093ff', fontWeight: '500'}}>Gửi lại mã</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                            {otpNumber[5] === '' ? 
                                <View style={{width: '55%', height: 40, backgroundColor: '#c0d4e3', justifyContent: 'center', alignItems: 'center', borderRadius: 50}}><Text style={{color: 'white', fontWeight: '500'}}>Tiếp tục</Text></View> :
                                <TouchableOpacity 
                                    style={{width: '55%', height: 40, backgroundColor: '#1294ff', justifyContent: 'center', alignItems: 'center', borderRadius: 50}}
                                    onPress={() => handleConfirmOTP()}
                                >
                                    <Text style={{color: 'white', fontWeight: '500'}}>Tiếp tục</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
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
      