import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback, ScrollView, PanResponder, KeyboardAvoidingView, FlatList, Platform, Keyboard} from 'react-native';
import TextMessage from './TextMessage';
import ImageMessage from './ImageMessage';
import { useRef, useState } from 'react';

const MessageScreen = props => {
    const {type, isSender, sender, onLongPress, onPressIn, ...rest} = props;
    
    const touchpadRef = useRef(null);

    const handleLongPress = (e) => {
        if (touchpadRef.current) {
            touchpadRef.current.measure((x, y, width, height) => {
                // Gọi onLongPress từ lớp cha và truyền chiều cao
                onLongPress(e, {...props, layoutHeight}, height);
            });
        }
    };

    const [layoutHeight, setLayoutHeight] = useState(0);

    const onLayout = e => {
        const {height} = e.nativeEvent.layout;
        setLayoutHeight(height);
    }
    console.log('Layout height', layoutHeight);

    return (
        <TouchableOpacity 
            activeOpacity={0.9}
            onPressIn={() => onPressIn(isSender)}
            onLongPress={handleLongPress} 
            ref={touchpadRef}
            onLayout={onLayout}
        >
            <View style={[styles.container, isSender && styles.sender]}>
                {!isSender && (
                    <Image
                        source={{uri: sender.avatar}}
                        resizeMode='cover'
                        style={styles.avatar}
                    ></Image>
                )}
                {type === 'text' ? (
                    <TextMessage {...rest} isSender={isSender} /> 
                ) : (
                    <ImageMessage {...rest}/>
                )
                }
            </View>
        </TouchableOpacity>
    )
};

export default MessageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
      sender: {
        justifyContent: 'flex-end',
      },
      avatar: {
        width: 24,
        height: 24,
        marginLeft: 12,
        backgroundColor: '#eee',
        borderRadius: 15,
      },
})