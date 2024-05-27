import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function RecoveryAccountSR({navigation}){
    const [isFocused, setIsFocused] = useState(false);
    const [account, setAccount] = useState('');
    
    
    return (
        <SafeAreaView style={styles.container}>
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
                <Text style={{fontSize: 18, marginLeft: 16, color: '#fff', fontWeight: '600'}}>Lấy lại mật khẩu</Text>
            </View>
            <View style={styles.content}>
                <View style={{backgroundColor: '#f8fafc', height: 40, width: '100%', alignItems: 'flex-start', justifyContent: 'center'}}>
                    <Text style={{textAlign: 'left', fontWeight: '400', paddingLeft: 15}}>Nhập số điện thoại để lấy lại mật khẩu</Text>
                </View>
                <TouchableWithoutFeedback 
                    onPress={() => Keyboard.dismiss()}
                >
                    <View style={{width: '90%', height: '90%'}}>
                        <View style={{borderBottomWidth: 1, borderBlockColor: isFocused ?  '#21d0f4': '#dee0e2', flexDirection: 'row'}}>
                            <TextInput
                                placeholder='Số điện thoại'
                                style={{fontSize: 20, width: '95%', paddingBottom: 10}}
                                keyboardType='numeric'   
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onChangeText={(text) => setAccount(text)} 
                                value={account}
                            ></TextInput>
                            {account.length > 0 && isFocused ? 
                            <TouchableOpacity
                                onPress={() => setAccount('')}
                            >
                                <Text style={{color: '#d2d4d8', fontSize: 16}}>x</Text>
                            </TouchableOpacity> : null}
                        </View>

                        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 25}}>
                            {account.length > 0 ? 
                                <TouchableOpacity
                                    style={{width: '65%', height: 50, backgroundColor: '#0397ff', justifyContent: 'center', alignItems: 'center', borderRadius: 40}}
                                >
                                    <Text style={{color: '#fff', fontWeight: '500', fontSize: 18}}>Tiếp tục</Text>
                                </TouchableOpacity>:
                                <View
                                    style={{width: '65%', height: 50, backgroundColor: '#c0d4e3', justifyContent: 'center', alignItems: 'center', borderRadius: 40}}
                                >
                                    <Text style={{color: '#fff', opacity: 0.8}}>Tiếp tục</Text>
                                </View>
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </SafeAreaView>
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