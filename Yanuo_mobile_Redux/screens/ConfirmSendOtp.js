import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setConfirmModal, setSavePhoneNumber } from '../redux/slices/sigupSlice';
import { sendSigupMailOTP } from '../api/OTP';

export default function App({navigation, phoneNumber}) {
    const dispatch = useDispatch();
    const Email = useSelector(state => state.sigupScreenSlice.Email)

    const handleSGNext = async() => {
        // gui OTP
        const data = {
            email: Email,
            subject: "YANUO Verification",
            message: 'Mã xác nhận đăng ký tài khoản YANUO',
            duration: 1,
        }
        try
        {
            const res = await sendSigupMailOTP(data);
            if (res.status === 200)
            {
                dispatch(setSavePhoneNumber(phoneNumber));
                navigation.push('sigupOTPSCR')
            }
            else
            {
                console.log('false');
            }
        }
        catch (error)
        {
            console.log(error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{width: '80%', backgroundColor: '#fff', borderRadius: 20, justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{marginTop: 20, fontSize: 20, fontWeight: '500'}}>Xác nhận Email</Text>
                <Text style={{marginTop: 5, fontSize: 20, fontWeight: '500'}}>{Email} ?</Text>
                <Text style={{textAlign: 'center', color: '#716f71', marginBottom: 20, marginTop: 8}}>số điện thoại này sẽ được sử dụng để nhận mã xác thực</Text>
                <View style={{borderTopWidth: 1, borderColor: '#cbc8ca', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-around'}}>
                    <TouchableOpacity
                        style={{height: 30, justifyContent: 'center', alignItems: 'center', width: '40%'}}
                        onPress={() => dispatch(setConfirmModal(false))}
                    >
                        <Text style={{color: '#087af6', fontSize: 18, fontWeight: '400'}}>Huỷ</Text>
                    </TouchableOpacity>
                    <View style={{borderRightWidth: 1, height: '100%', borderColor: '#cbc8ca'}}></View>
                    <TouchableOpacity
                        style={{height: 45, justifyContent: 'center', alignItems: 'center', width: '40%'}}
                        // onPress={() => navigation.push('sigupOTPSCR')}
                        onPress={() => handleSGNext()}
                    >
                        <Text style={{color: '#087af6', fontSize: 18, fontWeight: '400'}}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red',
        position: 'absolute',
        width: '100%',
        height: '100%',
        // top: '60%',
      },
});