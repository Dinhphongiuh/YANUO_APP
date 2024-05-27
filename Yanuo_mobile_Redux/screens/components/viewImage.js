import { useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Button, TextInput, ImageBackground, TouchableWithoutFeedback, Animated, PanResponder } from 'react-native';


const {height, width} = Dimensions.get('window');
export default function ViewImage({profileImage, closeImage}) {
    const showOpacity = useRef(new Animated.Value(1)).current;
    const [checkShow, setCheckShow] = useState(false);
    const onShow = () => {
        setCheckShow(!checkShow);
        Animated.timing(showOpacity, {
            toValue: checkShow ? 1 : 0,
            duration: 450,
            useNativeDriver: true,
        }).start();
    };

    //
    const dismiss = 150;
    const pan = useRef(new Animated.ValueXY()).current;
    const [isPressed, setIsPressed] = useState(false);
    
    const panResponder = useRef(
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onPanResponderGrant: () => {
            setIsPressed(true);
            pan.setOffset({
              x: pan.x._value,
              y: pan.y._value,
            });
          },
          onPanResponderMove: Animated.event(
            [null, { dx: pan.x, dy: pan.y }],
            { useNativeDriver: false }
          ),
          onPanResponderRelease: () => {
            setIsPressed(false);
            pan.flattenOffset();
            Animated.spring(
              pan,
              { toValue: { x: 0, y: 0 }, useNativeDriver: false }
            ).start();
          },
        })
    ).current;

    


    return (
        // <TouchableWithoutFeedback onPress={onShow}>

        <SafeAreaView style={styles.container}>
            <Animated.View style={[pan.getLayout(), {flex: 1, width: width, height: height, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}]}
                {...panResponder.panHandlers}
            >
                <Animated.View 
                    style={[{width: '100%', alignItems: 'center', opacity: showOpacity}]}
                >
                    <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity
                            style={{width: 28, height: 28, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => closeImage()}
                        >
                            <Image
                                source={require('../Icon/xmark.png')}
                                resizeMode='contain'
                                style={{width: '60%', height: '60%'}}
                            ></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                source={require('../Icon/ellipsisWhite.png')}
                                resizeMode='contain'
                                style={{width: 26, height: 26}}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <Animated.View 
                    style={[{width: '100%', height: '60%',}]}
                >
                    <TouchableWithoutFeedback onPress={onShow}>
                        <View style={[{width: '100%', height: '100%',}]}>
                            <Image
                                source={{uri:profileImage}}
                                resizeMode='cover'
                                style={{width: '100%', height: '100%'}}
                            ></Image>
                        </View>
                    </TouchableWithoutFeedback>
                </Animated.View>
                <Animated.View style={{width: '100%', alignItems: 'center',  opacity: showOpacity}}>
                    <View style={{width: '96%'}}>
                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>Đình Phong</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#818181' }}>date . </Text>
                            <Text style={{color: '#818181' }}>Private</Text>
                        </View>
                    </View>
                    {/* phần hiển thị cảm xúc */}
                    <View style={{width: '100%', marginVertical: 10}}></View>
                    {/*  */}
                    <View style={{borderTopWidth: 1, borderColor: '#fff', width: '100%', alignItems: 'center', height: 45, justifyContent: 'center'}}>
                        <View style={{width: '100%' ,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <TouchableOpacity
                                style={{flexDirection: 'row'}}
                            >
                                <Image
                                    source={require('../Icon/like.png')}
                                    resizeMode='contain'
                                    style={{width: 20, height: 20}}
                                ></Image>
                                <Text style={{color: '#fff', paddingHorizontal: 8, fontWeight: '600'}}>Thích</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{flexDirection: 'row'}}
                            >
                                <Image
                                    source={require('../Icon/comment.png')}
                                    resizeMode='contain'
                                    style={{width: 20, height: 20, transform: [{ scaleX: -1 }],}}
                                ></Image>
                                <Text style={{color: '#fff', paddingHorizontal: 8, fontWeight: '600',}}>Bình luận</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{flexDirection: 'row'}}
                            >
                                <Image
                                    source={require('../Icon/messageFb.png')}
                                    resizeMode='contain'
                                    style={{width: 20, height: 20}}
                                ></Image>
                                <Text style={{color: '#fff', paddingHorizontal: 8, fontWeight: '600'}}>Gửi</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{flexDirection: 'row'}}
                            >
                                <Image
                                    source={require('../Icon/share.png')}
                                    resizeMode='contain'
                                    style={{width: 20, height: 20}}
                                ></Image>
                                <Text style={{color: '#fff', paddingHorizontal: 8, fontWeight: '600'}}>Chia sẻ</Text>
                            </TouchableOpacity>
                        </View> 
                    </View>
                </Animated.View >

            </Animated.View>
        </SafeAreaView>
        // </TouchableWithoutFeedback>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // width: '100%',
        // height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: '#fff',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
})