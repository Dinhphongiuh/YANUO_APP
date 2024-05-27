import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Button, TextInput, ImageBackground, TouchableWithoutFeedback, StatusBar } from 'react-native';
import {useSelector} from 'react-redux';

const {height, width} = Dimensions.get('window');
export default function App({navigation}) {
    const profile = useSelector(state => state.meSlice.userProfile);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'}></StatusBar>
            <View style={{width: '100%', alignItems: 'center', height: 50, borderBottomWidth: 0.6, justifyContent: 'center', borderColor: '#e7e7e7'}}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Image
                            source={require('../Icon/ChevronLeft.png')}
                            resizeMode='contain'
                            style={{width: 20, height: 20}}
                        ></Image>
                    </TouchableOpacity>
                    <Text style={{fontSize: 16, fontWeight: '600'}}>Chỉnh sửa trang cá nhân</Text>
                    <View></View>
                </View>
            </View>
            <View style={{width: '100%', alignItems: 'center'}}>
                <ScrollView
                    style={{width: width, height: 1000}}
                    scrollEnabled
                    showsVerticalScrollIndicator
                >
                    <View style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{width: '90%', justifyContent: 'center'}}>
                            <View style={styles.content}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Ảnh đại diện</Text>
                                    <TouchableOpacity>
                                        <Text style={{color: '#0763c7', fontSize: 18}}>Chỉnh sửa</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{width: '100%', alignItems: 'center', marginVertical: 15}}>
                                    <TouchableOpacity
                                        style={{width: 130, height: 130, borderRadius: 80, overflow: 'hidden'}}
                                    >
                                        <Image
                                            source={{uri: profile.avatar}}
                                            resizeMode='cover'
                                            style={{width: '100%', height: '100%'}}
                                        ></Image>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.content}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10}}>
                                    <Text style={{fontSize: 18, fontWeight: 'bold',}}>Ảnh bìa</Text>
                                    <TouchableOpacity>
                                        <Text style={{color: '#0763c7', fontSize: 18}}>Chỉnh sửa</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{width: '100%', alignItems: 'center', marginVertical: 15}}>
                                    <TouchableOpacity
                                        style={{width: '100%',height: 220 , borderRadius: 10, overflow: 'hidden'}}
                                    >
                                        <Image
                                            source={{uri: profile.coverImage}}
                                            resizeMode='cover'
                                            style={{width: '100%', height: '100%'}}
                                        ></Image>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.content}>
                                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10}}>
                                    <Text style={{fontSize: 18, fontWeight: 'bold',}}>Tiểu sử</Text>
                                    <TouchableOpacity>
                                        <Text style={{color: '#0763c7', fontSize: 18}}>Chỉnh sửa</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{width: '100%', alignItems: 'center'}}>
                                    <TextInput
                                        value='profile.tieuSu'
                                    ></TextInput>
                                </View>
                            </View>
                            <View style={styles.content}>
                                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10}}>
                                    <Text style={{fontSize: 18, fontWeight: 'bold',}}>Chi tiết</Text>
                                    <TouchableOpacity>
                                        <Text style={{color: '#0763c7', fontSize: 18}}>Chỉnh sửa</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{width: '100%', height: 800, justifyContent: 'flex-start', alignItems: 'center', marginTop: 10}}>
                                    <View style={{width: '80%', borderBottomColor: '#f7f7f8', borderBottomWidth: 1, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{color: '#666769'}}>Giới tính</Text>
                                        <Text style={{}}>{profile.gender}</Text>
                                    </View>
                                    <View style={{width: '80%', borderBottomColor: '#f7f7f8', borderBottomWidth: 1, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{color: '#666769'}}>Ngày sinh</Text>
                                        <Text style={{}}>{profile.dateOfBirth}</Text>
                                    </View>
                                    <View style={{width: '80%', borderBottomColor: '#f7f7f8', borderBottomWidth: 1, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{color: '#666769'}}>Điện thoại</Text>
                                        <Text style={{}}>{profile.phoneNumber}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff'
    },
    header: {
        width: '94%', 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        width: '100%', 
        justifyContent: 'center', 
        borderBottomWidth: 1, 
        borderColor: '#f1f1f2',
        marginTop: 10,
        paddingBottom: 10,
    },
});