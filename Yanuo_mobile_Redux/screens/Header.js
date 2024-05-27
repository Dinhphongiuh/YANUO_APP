import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, TextInput, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { Animated, Easing } from 'react-native';
import { setOpenDropMenu } from '../redux/slices/HomeScreenSlice';
import { useDispatch, useSelector } from 'react-redux';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function App({screen})
{
    const openDropMenu = useSelector(state => state.homeScreenSlice.openDropMenu);
    const dispatch = useDispatch();
    const openMenu = () => {
        dispatch(setOpenDropMenu(!openDropMenu));
    }
    const [isFocused, setIsFocused] = useState(false);
    

    const [state, setState] = useState({
        "keyWord": '',
        "addMenu": [{label: 'Item 1', value: 1}, {label: 'Item 2', value: 2}]
    });

    const _input_box_translate_x = useRef(new Animated.Value(width)).current;
    const _back_button_opacity = useRef(new Animated.Value(0)).current;
    const _content_translate_y = useRef(new Animated.Value(height)).current;
    const _content_opacity = useRef(new Animated.Value(0)).current;
    const initiWWidth = width * 0.6;
    const initiWWidth1 = width - 40;
    const [inputWidth, setInputWidth] = useState(new Animated.Value(initiWWidth)); 

    const _onFucus = () => {
        setIsFocused(true);

            Animated.timing(_input_box_translate_x, {
                toValue: 100,
                duration: 200,
                useNativeDriver: true
            }).start();
            Animated.timing(_back_button_opacity, {
                toValue: 1,
                duration: 200,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
            Animated.timing(_content_translate_y, {
                toValue: 0,
                duration: 0,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
            Animated.timing(_content_opacity, {
                toValue: 1,
                duration: 100,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();

            Animated.timing(inputWidth, {
                toValue: initiWWidth1,
                duration: 200,
                useNativeDriver: false
            }).start();
    }

    const _onBlur = () => {
        setIsFocused(false);
        Keyboard.dismiss();

            Animated.timing(_input_box_translate_x, {
                toValue: width,
                duration: 200,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true
            }).start();
            Animated.timing(_back_button_opacity, {
                toValue: 0,
                duration: 50,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
            Animated.timing(_content_translate_y, {
                toValue: height,
                duration: 0,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
            Animated.timing(_content_opacity, {
                toValue: 0,
                duration: 200,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
            Animated.timing(inputWidth, {
                toValue: initiWWidth,
                duration: 100,
                useNativeDriver: false
            }).start();
    }
    const handlePress = () => {
        if (openDropMenu) {
          openMenu();
          _onFucus();
        } else {
          _onFucus();
        }
      }

    return (
        <SafeAreaView>
            <View style={{width: '90%', height: 50, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
            {!isFocused ? 
                <TouchableOpacity
                activeOpacity={1}
                // underlayColor={'#ccd0d5'}
                // onPress={!openDropMenu ? _onFucus : openMenu}
                onPress={handlePress}
              style={{width: 30, height: 30}}
            >
              <Image
                style={{width: 30, height: 30}}
                resizeMode='contain'
                source={require('./Icon/searchIcon.png')}
              ></Image>
            </TouchableOpacity> :
            <TouchableOpacity
                activeOpacity={1}
                // underlayColor={'#ccd0d5'}
                onPress={_onBlur}
              style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'flex-end', marginLeft: 20}}
            >
              <Image
                style={{width: 25, height: '50%'}}
                resizeMode='contain'
                source={require('./Icon/BackIcon.png')}
              ></Image>
            </TouchableOpacity>
            }
            
            <Animated.View style={{width: inputWidth, alignItems: 'center', justifyContent: 'center', marginLeft: 10}}>
                <TextInput 
                    style={[{width: '100%', alignItems: 'flex-start', padding: 5}, 
                    isFocused && styles.focusedTextInput]}
                    placeholderTextColor={!isFocused ? '#fff' : '#7e848b'}
                    // onFocus={() => {this.setState({isFocused: true});console.log(this.state.ifFocused)}}
                    onFocus={_onFucus}
                    // onBlur={() => {this.setState({isFocused: false}); console.log(this.state.ifFocused)}}
                    // onBlur={() => {this._onBlur()}}
                    placeholder='Tìm kiếm'
            
                >
                {/* <Text style={{color: '#fff', fontSize: 14}}>Tìm kiếm</Text> */}
                </TextInput>

            </Animated.View>
            {screen === 'Home' ? 
                <TouchableOpacity style={{}}>
                    <Image
                        resizeMode='contain'
                        style={{width: 30, height: 30}}
                        source={require('./Icon/qr-code.png')}
                    ></Image>
                </TouchableOpacity>
                : screen === 'News' ? 
                <TouchableOpacity style={{width: 50}}>
                    <Image
                        resizeMode='contain'
                        style={{width: 30, height: 30}}
                        source={require('./Icon/penToSquare.png')}
                    ></Image>
                </TouchableOpacity>
                : screen === 'MeScreen' ? 
                <TouchableOpacity style={{width: 50, justifyContent: 'center', alignItems: 'flex-end'}}>
                    <Image
                        resizeMode='contain'
                        style={{width: 30, height: 30}}
                        source={require('./Icon/Setting.png')}
                    ></Image>
                </TouchableOpacity>
                : null
            }

            {screen === 'Home' ? 
                !isFocused ? 
                    <TouchableOpacity 
                        onPress={openMenu}
                        style={{}}
                    >
                    {!isFocused ? <Image
                    resizeMode='contain'
                    style={isFocused ? styles.addBtnNoActive : styles.addBtnActive}
                    source={require('./Icon/add.png')}
                    ></Image> : null}
                </TouchableOpacity> : null
                 : screen === 'News' ? 
                 <TouchableOpacity 
                        style={{}}
                    >
                    {!isFocused ? <Image
                    resizeMode='contain'
                    style={isFocused ? styles.addBtnNoActive : styles.addBtnActive}
                    source={require('./Icon/bellIcon.png')}
                    ></Image> : null}
                </TouchableOpacity> 
                : null
            }
            {/* {renderButton()} */}
            {/*  */}
            </View>

            {isFocused ? 
                <Animated.View
                style={[styles.contentSearchTool, {opacity: _content_opacity, transform: [{translateY: _content_translate_y}]}]}
            >
                <SafeAreaView
                    style={styles.content_search_tool_area}
                >
                    <View style={styles.separator}/>
                    <Text>Hi</Text>
                </SafeAreaView>
            </Animated.View> : null    
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    input_box: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'white',
        width: width - 32
    },
    focusedTextInput:{
        backgroundColor: 'white',
        borderRadius: 5,
        borderStyle: 'solid',
        width: '70%',
    },
    addBtnActive:{
        width: 30,
        height: 30,
    },
    addBtnNoActive:{
        width: 0,
        height: 0
    },
    contentSearchTool:{
        width: width,
        // height: '92.7%',
        height: '100%',
        // position: 'absolute',
        // position: 'relative',
        // left: 0,
        // bottom: 0,
        // zIndex: 999,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    }
})