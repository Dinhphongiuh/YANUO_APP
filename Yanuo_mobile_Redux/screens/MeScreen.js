import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Header from './Header';  
import { useDispatch, useSelector } from 'react-redux';
import { setLogin } from '../redux/slices/globalSlice';

export default function App({navigation}) {
  const dispatch = useDispatch();
  //profile
  const profile = useSelector(state => state.meSlice.userProfile);
  // console.log(profile);
  const handleLougout = async() => {
    try
    {
      await AsyncStorage.removeItem('token');
      console.log('Token has been removed');
      dispatch(setLogin(false));
      navigation.push('HomeLogin');
    }
    catch (error) {
      console.log('Error', error);
    }
  }

  return (
   <SafeAreaView style={styles.container}>
      <Header screen={'MeScreen'}></Header>
      <SafeAreaView style={styles.content}>
        <View style={{width: '100%', height: '100%'}}>
          {/*  */}
          <ScrollView
            style={{width: '100%', }}
          >
            <TouchableOpacity
              style={{width: '100%', height: 80,justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff'}}
              onPress={() => navigation.push('ProfileSCR')}
            >
              <View style={{width: '95%', height: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', flexDirection: 'row'}}>
                <Image
                  // source={require('../assets/test.png')}
                  source={{uri: profile.avatar}}
                  resizeMode='cover'
                  style={{width: 50, height: 50, borderRadius: 40}}
                ></Image>
                <View style={{width: '75%', justifyContent: 'flex-start'}}>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>{profile.userName}</Text>
                  <Text style={{color: '#707070', marginTop: 2}}>Xem trang cá nhân</Text>
                </View>
                <TouchableOpacity>
                  <Text>Icon</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{width: '100%', height: 80, backgroundColor: '#fff', marginTop: 10, justifyContent: 'center', alignItems: 'center'}}
              onPress={() => handleLougout()}
            >
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Đăng Xuất</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#009ef9',
  },
  content: {
    width: '100%', 
    height: '100%', 
    backgroundColor: '#f3f4f6'
  }
});
