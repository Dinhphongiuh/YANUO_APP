import { useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, TextInput, ImageBackground, FlatList } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { StatusBar } from 'react-native';

const {height, width} = Dimensions.get('window');
export default function LoginScreen({navigation}) {
    const scrollPageref = useRef();

    const [activeIndex, setActiveIndex] = useState(0);
    const [listImage, setListImage] = useState([
        {"id": 1, "title": "Gọi video ổn định", "content": "Trò chuyện thật đã với hình ảnh sắc nét, tiếng chât, âm chuẩn dưới mọi điều kiện mạng", "image": require('./image/bak1.png')},
        {"id": 2, "title": "Chat nhóm tiện lợi", "content": "Cùng trao đổi, giữ liên lạc với gia đình, bạn bè và đồng nghiệp mọi lúc mọi nơi", "image": require('./image/bak2.png')},
        {"id": 3, "title": "Gửi ảnh nhanh chóng", "content": "Chia sẻ hình ảnh chất lượng cao với bạn bè và người thân nhanh chóng và dễ dàng", "image": require('./image/bak3.png')},
        {"id": 4, "title": "Nhật ký bạn bè", "content": "Nơi cập nhật hoạt động mới nhất của những người bạn quan tâm", "image": require('./image/bak4.png')},
        {"id": 5, "image": require('./image/zaloIcon.png')}

    ]);

    const getItemLayout = (data, index) => ({
        length: width,
        offset: width * index,
        index: index
    });
    const handleScrollFlatlit = (event) => {
        let scrollPosision = event.nativeEvent.contentOffset.x;
        let index = scrollPosision / width + 50;
        setActiveIndex(index);
    }
    const renderItemFL = ({item, index}) => {
        return (
            <View
                style={{width: width, height: '100%', justifyContent: 'space-around', alignItems: 'center'}}
            >
                <Image
                    source={item.image}
                    style={{width: '100%', height: '65%'}}
                    resizeMode='contain'
                ></Image>
                <View style={{width: width, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#212121', fontWeight: '600', padding: 10, fontSize: 16}}>{item.title}</Text>
                    <Text style={{width: '80%', color: '#818389', fontSize: 14, textAlign: 'center'}}>{item.content}</Text>
                </View>
                <Text></Text>
            </View>
        )
    };



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content"></StatusBar>
            <ImageBackground
                source={require('../assets/backgroundLogin.png')}
                style={{width: '100%', height: '100%', flex: 1, alignItems: 'center', justifyContent: 'space-between'}}
                resizeMode='cover'
            >
                <View style={{height: '65%', width: '100%'}}>
                    <SwiperFlatList
                        data={listImage}
                        ref={scrollPageref}
                        getItemLayout={getItemLayout}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        pagingEnabled
                        onScroll={handleScrollFlatlit}
                        renderItem={renderItemFL}
                        showPagination
                        paginationActiveColor='#1483ee'
                        paginationDefaultColor='#dfdfdf'
                        paginationStyleItem={{width: 8, height: 8}}
                        // paginationStyle={{justifyContent: 'space-around'}}
                    >    
                    </SwiperFlatList>
                </View>
                <View style={styles.containerBottom}>
                    <TouchableOpacity
                        onPress={() => navigation.push('loginScreen')}
                        style={[styles.btn, {backgroundColor: '#00a1ff'}]}
                    >
                        <Text style={{fontSize: 18, fontWeight: '500', color: '#fff'}}>Đăng nhập</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btn, {backgroundColor: '#f1f3f7'}]}
                        onPress={() => navigation.push('sigupUserNameSCR')}
                    >
                        <Text style={{fontSize: 18, fontWeight: '500', color: '#212325'}}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#ffffff',
    },
    containerBottom: {
        width: '80%',
        marginBottom: 15
    },
    btn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginBottom: 12,
    }
  });
  