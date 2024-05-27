import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Dimensions, Modal, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SvgUri from 'react-native-svg-uri';
import {PanGestureHandler } from 'react-native-gesture-handler';
import {MotiView, AnimatePresence} from "moti";
import { GestureHandlerRootView } from 'react-native-gesture-handler';  
import CustomButton from './CustomButton';
import EmojiLike from '../facebookSVG-Emoj/EmojiLike';
import EmojiLove from '../facebookSVG-Emoj/EmojiLove';
import EmojiCare from '../facebookSVG-Emoj/EmojiCare';
import EmojiHaha from '../facebookSVG-Emoj/EmojiHaha';
import EmojiWow from '../facebookSVG-Emoj/EmojiWow';
import EmojiSad from '../facebookSVG-Emoj/EmojiSad';
import EmojiAngry from '../facebookSVG-Emoj/EmojiAngry';
import Backdrop from '../components/Backdrop';
import EmojiPostItem from '../PostComponent/EmojiPostItem';
import Hint from '../PostComponent/Hint';
import { getListPost } from '../../api/postAPI';

const items = [
    {emoji: <Image source={require('../Icon/Like1.png')} style={{width: 20, height: 20}}></Image>, title: 'Thích', color: "rgb(32, 120, 244)"},
    {emoji: <EmojiLike/>, title: "Thích", color: "rgb(32, 120, 244)"},
    {emoji: <EmojiLove/>, title: "Yêu thích", color: "rgb(243, 62, 88)"},
    {emoji: <EmojiCare/>, title: "Thương thương", color: "rgb(247, 177, 37)"},
    {emoji: <EmojiHaha/>, title: "haha", color: "rgb(247, 177, 37)"},
    {emoji: <EmojiWow/>, title: "Wow", color: "rgb(247, 177, 37)"},
    {emoji: <EmojiSad/>, title: "Buồn", color: "rgb(247, 177, 37)"},
    {emoji: <EmojiAngry/>, title: "Phẫn nộ", color: "rgb(233, 113, 15)"}
]
const newItems = items.slice(1);

const {height, width} = Dimensions.get('window');
export default function App({navigation}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [current, setCurrent] = useState(null);
    const [show, setShow] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const onGesture = (event) => {
        if (event.nativeEvent.absoluteY >= 310 && event.nativeEvent.absoluteY <= 490 && event.nativeEvent.absoluteX >= 16 && event.nativeEvent.absoluteX <= 367)
        {
            setShowHint(false);
            console.log('inside');
        }
        else
        {
            console.log('out side');
        }

        const currentItem = Math.floor(event.nativeEvent.x / 50);
        if (currentItem >= 0 && currentItem < items.length - 1)
        {
            setCurrent(currentItem + 1);
        }
        else
        {
            setCurrent(null);
        }
        console.log(event.nativeEvent.x);
    }

    const gestureEnded = () => {
        setShow(false);
        setShowHint(false);
    };

    const btnPressHandler = () => {
        setCurrent(null);
        setShow(true);
        setShowHint(true);
    }

    const onClose = () => {
        setShow(false);
        setShowHint(false);
        setCurrent(null);
    }

    const emoijPressHanler = (index) => {
        setShow(false);
        setShowHint(false);
        setCurrent(index);
    }

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaView style={styles.container}>
                <View style={{width: '90%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <TouchableOpacity
                        style={{width: 45, height: 45, borderRadius: 60, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}}
                    >  
                        <Image
                            source={require('../../assets/test.png')}
                            resizeMode='cover'
                            style={{width: '100%', height: '100%'}}
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{width: '62%', marginLeft: 12}}
                    >
                        <Text style={{fontWeight: 'bold'}}>UserName</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{color: '#69686d', fontSize: 12,}}>Date Time</Text>
                            <Image
                                source={require('../Icon/elipsis11.png')}
                                resizeMode='contain'
                                style={{width: 10, height: 10, marginHorizontal: 6}}
                            ></Image>
                            <Image
                                source={require('../Icon/public.png')}
                                resizeMode='contain'
                                style={{width: 14, height: 14}}
                            ></Image>
                        </View>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity>
                            <Image
                                source={require('../Icon/elipsis1.png')}
                                resizeMode='contain'
                                style={{width: 25, height: 25, marginRight: 10}}
                            ></Image>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                source={require('../Icon/Xmark1.png')}
                                resizeMode='contain'
                                style={{width: 25, height: 25}}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* contentb */}
                <Animated.View style={{width: '94%', alignItems: 'center'}}>
                <TouchableOpacity 
                    style={[styles.capContent, isExpanded && styles.expanded]}
                    onPress={() => setIsExpanded(!isExpanded)}
                >
                    <Text
                        numberOfLines={isExpanded ? undefined : 2}
                        style={styles.text}
                    >
                        192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75192.168.1.75
                    </Text>
                    {!isExpanded && (
                        <TouchableOpacity 
                            onPress={() => setIsExpanded(true)}
                            style={styles.moreButtonContainer}
                        >
                            <Text style={styles.moreButton}>Xem thêm</Text>
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </Animated.View>
            {/* medial */}
            <TouchableOpacity
                style={{width: '100%', height: 200}}
            >
                <Image
                    source={require('../Icon/Test12.jpg')}
                    resizeMode='contain'
                    style={{width: '100%', height: '100%'}}
                ></Image>
            </TouchableOpacity>
            {/* Controller */}
            <View style={{width: '94%', alignItems: 'center', marginTop: 4}}>
                {/* hiển thị like ,... */}
                <View style={{width: '100%', flexDirection: 'row', height: 40, borderBottomWidth: 1, borderColor: '#e6e5e9', alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row'}}>
                        <SvgUri
                            source={require('../facebookSVG-Emoj/like.svg')}
                        ></SvgUri>
                        <Text>1K</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{marginRight: 10}}>1K bình luận</Text>
                        <Text>1K lượt chia sẻ</Text>
                    </View>
                </View>
                {/* like cmt, ... */}
                {/* <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 50}}>
                    <TouchableOpacity
                        style={{flexDirection: 'row', alignItems: 'center'}}
                    >
                        <Image
                            source={require('../Icon/Like1.png')}
                            resizeMode='contain'
                            style={{width: 25, height: 25, marginRight: 4}}
                        ></Image>
                        <Text style={{color: '#67686b', fontSize: 14, fontWeight: '600'}}>Thích</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{flexDirection: 'row', alignItems: 'center'}}
                    >
                        <Image
                            source={require('../Icon/comment1.png')}
                            resizeMode='contain'
                            style={{width: 20, height: 20, marginRight: 4}}
                        ></Image>
                        <Text style={{color: '#67686b', fontSize: 14, fontWeight: '600'}}>Bình luận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{flexDirection: 'row', alignItems: 'center'}}
                    >
                        <Image
                            source={require('../Icon/message1.png')}
                            resizeMode='contain'
                            style={{width: 20, height: 20, marginRight: 4}}
                        ></Image>
                        <Text style={{color: '#67686b', fontSize: 14, fontWeight: '600'}}>Gửi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{flexDirection: 'row', alignItems: 'center'}}
                    >
                        <Image
                            source={require('../Icon/share1.png')}
                            resizeMode='contain'
                            style={{width: 20, height: 20, marginRight: 4}}
                        ></Image>
                        <Text style={{color: '#67686b', fontSize: 12, fontWeight: '600'}}>Chia sẻ</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 50}}>
                    <AnimatePresence>
                        {  show && (
                            <PanGestureHandler onGestureEvent={onGesture} onEnded={gestureEnded}>
                                <MotiView style={styles.motiContainer}>
                                    {/* <Backdrop></Backdrop> */}
                                    <MotiView style={styles.floatBox}>
                                        <View style={styles.emojiBox}>
                                            {newItems.map((item, index) => (
                                                <EmojiPostItem
                                                    onPress={() => emoijPressHanler(index + 1)}
                                                    key={item.title}
                                                    data={item}
                                                    index={index} 
                                                    scaled={current === index}
                                                ></EmojiPostItem>
                                            ))}
                                        </View>
                                    </MotiView>
                                </MotiView>
                            </PanGestureHandler>
                        )}
                    </AnimatePresence>
                    {show && <Hint hint={showHint}></Hint>}
                    {show && <Backdrop onPress={() => {onClose()}}
                    ></Backdrop>}
                    <CustomButton
                        onPress={() => {current === null ? setCurrent(1) : setCurrent(null)}}
                        onLongPress = {btnPressHandler}
                        color={current === null ? '#67686b' : items[current].color}
                        emoji={items[current === null ? 0 : current].emoji}
                        // emoji={current ? items[current === null ? 0 : current].emoji : null}
                        // emoji={current === null ? 0 : items[current].emoji}
                        text={items[current === null ? 0 : current].title}
                    ></CustomButton>
                </View>
            </View>
            <View style={{width: '100%', height: 4, backgroundColor: '#c9ccd3', marginVertical: 20}}></View>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
    //   backgroundColor: '#009ef9',
    },
    expanded: {
        height: 'auto', // Cho phép chiều cao tự động mở rộng
    },
    text: {
        flexShrink: 1, // Cho phép text co lại nếu không đủ chỗ
    },
    capContent: {
        width: '100%',
        // backgroundColor: 'red',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10, // Thêm padding cho nội dung không chạm vào cạnh
    },
    motiContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 130,
        width: '100%',
        // backgroundColor: 'red',
        zIndex: 10
    },
    floatBox: {
        alignItems: 'center',
        
    },
    emojiBox: {
        // width: 250,
        flexDirection: 'row',
        borderRadius: 33,
        backgroundColor: '#fff',
        // backgroundColor: '#000'
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }
});