import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import {Portal} from 'react-native-portalize';
import TextMessage from "./TextMessage";
import ImageMessage from "./ImageMessage";
import {BlurView} from 'expo-blur';
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming} from 'react-native-reanimated';
import EmojiItem from "../components/EmojiItem";

const PortalView = ({selectedMessage, messageCordinates, yLocation, setSelectedMessage, isSender, items}) => {
    if (!selectedMessage)
    {
        return null;
    }

    const [blueAmount, setBlueAmount] = useState(0);
    const scale = useSharedValue(0);
    const {height} = useWindowDimensions();

    useEffect(() => {
        if (selectedMessage)
        {
            scale.value = withSpring(1);
            const interval = setInterval(() => {
                setBlueAmount(prev => {
                    if (prev < 60)
                    {
                        return prev + 10;
                    }
                    clearInterval(interval);
                    return prev;
                });
            }, 30);
        }
        else
        {
            scale.value = 0;
            setBlueAmount(0);
        }
    }, [selectedMessage]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                translateX: withTiming(selectedMessage ? 0 : isSender ? 0 : 30, {duration: 300}),
            },
        ],
        right: isSender ? 0 : undefined,
        }
    });

    const textStyle = useAnimatedStyle(() => {
        return {
            fontSize: 30,
            transform: [{
                scale: scale.value,
            },
            {
                translateY: interpolate(scale.value, [0, 1], [50 , 0]),
            }
        ]
        }
    })

    const [current, setCurrent] = useState(null);
    const [show, setShow] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const emoijPressHanler = (index) => {
        setShow(false);
        setShowHint(false);
        setCurrent(index);
    }
   
    return (
        <Portal>
            <BlurView style={styles.container} intensity={blueAmount}>
                <TouchableOpacity 
                    activeOpacity={1}
                    onPress={() => setSelectedMessage(null)} 
                    style={styles.container}
                >
                    <Animated.View style={[styles.reaction, {top: messageCordinates.y - 70}, animatedStyle]}>
                        {items.map((item, index) => (
                            <EmojiItem 
                                onPress= {() => emoijPressHanler(index)}
                                key={item.title} data={item} 
                                index={index} 
                                scaled={current === index}
                            />
                        ))}
                        {/* <Animated.Text style={textStyle}>❤️</Animated.Text>
                        <Animated.Text style={textStyle}>❤️</Animated.Text>
                        <Animated.Text style={textStyle}>❤️</Animated.Text>
                        <Animated.Text style={textStyle}>❤️</Animated.Text>
                        <Animated.Text style={textStyle}>❤️</Animated.Text> */}
                    </Animated.View>
                    <Animated.View style={[styles.messageStyle, {top: messageCordinates?.y}, animatedStyle]}>
                    {selectedMessage?.type === 'text' ? (
                            <TextMessage {...selectedMessage}></TextMessage>
                        ) : (
                            <ImageMessage {...selectedMessage}></ImageMessage>
                        )}
                        {/* <Text style={{}}>PortalView</Text> */}
                    </Animated.View>
                </TouchableOpacity>
            </BlurView>
            <Animated.View style={[styles.messageStyle, {top: yLocation?.y}, animatedStyle]}>
                <Text style={{color: 'red'}}>PortalView</Text>
            </Animated.View>
        </Portal>
    )
};

export default PortalView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageStyle: {
        position: 'absolute'
    },
    reaction: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 50,
        flexDirection: 'row',
        // alignSelf: 'center',
        gap: 8,
    }
})