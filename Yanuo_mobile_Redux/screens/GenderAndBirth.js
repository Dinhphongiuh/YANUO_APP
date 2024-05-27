import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback } from 'react-native';
import { Keyboard } from 'react-native';
import { useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { setConfirmModal } from '../redux/slices/sigupSlice';
import client from '../api/client';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function App({navigation, route}) {
    const [selectedGender, setSelectedGender] = useState(null);
    const [date, setDate] = useState(new Date());
    const token = route.params.token;

    const handleGenderSelection = (gender) => {
        setSelectedGender(gender);
    }

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate); // Cập nhật giá trị ngày
    };

    const handleSGNext = async() => {
        const dateBirth = date.toLocaleDateString();
        const data = {
            "dateOfBirth": dateBirth,
            "gender": selectedGender
        };
        const resBirth = await client.post('/updateGenderOfBirth', data,
            {headers: {authorization: `JWT ${token}`}}
            );
        console.log(resBirth.data);
        if (resBirth.data.success)
        {
            console.log('Update OK');
            try {
                await AsyncStorage.setItem('token', token);
            }
            catch (error) {
                console.error('Error storing the token', error);
            }
            navigation.push('backGroundSCR', {token: token})
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{flexDirection: 'row', width: '90%', height: 35, alignItems: 'center'}}>
                <Text style={{fontSize: 18, marginLeft: 16, color: '#fff', fontWeight: '600'}}>Ngày sinh và giới tính</Text>
            </View>
            <View style={styles.content}>
                <View style={{width: '100%', backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{padding: 5, width: '95%'}}>Điền ngày sinh và giới tính để nhận nội dung phù hợp</Text>
                </View>
                <View style={{width: '100%', height: '100%', alignItems: 'center'}}>
                    <View style={{height: '40%', marginTop: 15, width: '98%'}}>
                        <Text style={{fontSize: 16, fontWeight: '500'}}>Giới tính</Text>
                        <View style={{flexDirection: 'row', width: '100%'}}>
                            <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                                <TouchableOpacity
                                    style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => handleGenderSelection('male')}
                                >
                                    <Image
                                        style={{width: '70%', height: 120}}
                                        resizeMode='contain'
                                        source={selectedGender === "male" ? require('./Icon/maleActive.png'): require('./Icon/maleNoActive.png')}
                                    ></Image>
                                </TouchableOpacity>
                                <Text style={{fontSize: 16, fontWeight: '600'}}>Nam</Text>
                            </View>
                            <View style={{width: '50%', justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity
                                    style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => handleGenderSelection('female')}
                                >
                                    <Image
                                        style={{width: '70%', height: 120}}
                                        resizeMode='contain'
                                        source={selectedGender === "female" ? require('./Icon/femaleActive.png'): require('./Icon/femaleNoActive.png')}
                                    ></Image>
                                </TouchableOpacity>
                                <Text style={{fontSize: 16, fontWeight: '600'}}>Nữ</Text>
                            </View>
                        </View>
                    </View>
                <View style={{width: '100%', height: 10, backgroundColor: '#faf9fe'}}></View>
                <View style={{height: '40%', marginTop: 15, width: '98%', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 16, fontWeight: '500'}}>Ngày sinh</Text>
                    <View>
                        <DateTimePicker 
                            value={date} 
                            display='spinner'
                            mode={'date'}
                            is24Hour={false}
                            locale='vi'
                            onChange={onChangeDate}
                        ></DateTimePicker>
                    </View>
                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        {!selectedGender ? 
                            <View style={{backgroundColor: '#c2d4e2', width: '50%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
                                <Text style={{color: '#fff'}}>Tiếp tục</Text>
                            </View>:
                            <TouchableOpacity
                                style={{backgroundColor: '#039dfe', width: '50%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20}}
                                // onPress={() => navigation.push('backGroundSCR', {token: token})}
                                onPress={handleSGNext}
                            >
                                <Text style={{color: '#fff', fontWeight: '600'}}>Tiếp tục</Text>
                            </TouchableOpacity>
                        }
                        
                    </View>
                </View>
                </View>
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
      