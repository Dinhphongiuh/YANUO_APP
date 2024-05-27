import * as React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Dimensions, Modal } from 'react-native';
import Header from './Header';  
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import CreateStory from './StoryComponent/CreateStory';
import CreatePost from './PostComponent/CreatePostSCR';
import ListPost from './PostComponent/ListPostSCR';
import { useEffect } from 'react';
import { getListPost } from '../api/postAPI';


const fakePost = [
  {_id: 1, userId: '1', tagUser: [], content: '', medials: []}
]
const {height, width} = Dimensions.get('window')
export default function App({navigation}) {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.meSlice.userProfile);
  // modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCreatePostVisible, setModalCreatePostVisible] = useState(false);

  // post
  const [listPost, setListPost] = useState([]);

  useEffect(() => {
      const fetchListPost = async() => {
          try
          {
            const res = await getListPost(profile._id);
            if (res.status === 200)
            {
              setListPost(res.data);
              console.log('pasaz', res.data);
            }
          }
          catch (error)
          {
            console.log(error);
          }
      }
      fetchListPost();
  }, []);

  return (
   <SafeAreaView style={styles.container}>
        <Header screen={'News'}></Header>
        <SafeAreaView style={{width: '100%', height: '100%', backgroundColor: '#fff', alignItems: 'center'}}>
          <View style={{width: '100%', alignItems: 'center'}}>
            <ScrollView
              style={{width: '100%', height: '100%'}}
              showsVerticalScrollIndicator={false}
            >
              <View style={{width: '100%', alignItems: 'center'}}>
                <View style={{width: '94%', height: 50, flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                  <TouchableOpacity
                    style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}
                  >
                    <Image
                      source={{uri: profile.avatar}}
                      style={{width: '100%', height: '100%', borderRadius: 40}}
                      resizeMode='cover'
                    ></Image>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{width: '80%', height: 50, borderWidth: 1, marginLeft: 15, borderColor: '#e7e6ec', borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10}}
                    onPress={() => setModalCreatePostVisible(true)}  
                  >
                    <TextInput
                      placeholder='Bạn đang nghĩ gì?'
                      placeholderTextColor={'#000'}
                      style={{width: '85%', color: '#000', fontWeight: '600'}}
                      editable={false}
                    ></TextInput>
                    <TouchableOpacity>
                      <Image
                        source={require('./Icon/ImageIcon.png')}
                        resizeMode='contain'
                        style={{width: 30, height: 30, marginRight: 10}}
                      ></Image>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{width: '100%', height: 6, backgroundColor: '#c9ccd3', marginVertical: 20}}></View>
              <View style={{width: '100%', height: 170, alignItems: 'center'}}>
                <ScrollView
                  horizontal
                  style={{width: width - 30, height: '100%',}}
                >
                  <TouchableOpacity
                    style={{width: 110, height: '100%', backgroundColor: '#f7f8fa', borderRadius: 12, overflow: 'hidden'}}
                    onPress={() => setModalVisible(true)}
                  >
                    <View style={{width: '100%', height: '65%'}}>
                      <Image 
                        source={{uri: profile.avatar}}
                        resizeMode='cover'
                        style={{width: '100%', height: '100%'}}
                      ></Image>
                      <TouchableOpacity
                        style={{width: 40, height: 40, borderRadius: 50, backgroundColor: '#0865fe', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: -20, right: 35, borderWidth: 2, borderColor: '#fff'}}
                      >
                        <Image
                          source={require('./Icon/plush.png')}
                          resizeMode='contain'
                          style={{width: 22, height: 22}}
                        ></Image>
                      </TouchableOpacity>
                    </View>
                    <Text style={{fontWeight: '700', fontSize: 16, textAlign: 'center', marginTop: 28}}>Tạo tin</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
              <View style={{width: '100%', height: 4, backgroundColor: '#c9ccd3', marginVertical: 20}}></View>
              {/* post */}
              {listPost.map((item, index) => (
                <ListPost></ListPost>
              ))}
            </ScrollView>
          </View>

        </SafeAreaView>
        {/* modal create Story */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={modalVisible}
          
        >
          {/* <SafeAreaView style={{backgroundColor: 'red', flex: 1}}></SafeAreaView> */}
          <CreateStory setModalVisible={setModalVisible}></CreateStory>
        </Modal>
        {/* modal create Post */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={modalCreatePostVisible} 
        >
          <CreatePost setModalCreatePostVisible={setModalCreatePostVisible}></CreatePost>
        </Modal>
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#009ef9',
  }
});
