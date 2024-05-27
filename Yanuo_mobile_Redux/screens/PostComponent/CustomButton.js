import { StyleSheet, TouchableOpacity, View, Text, Dimensions, Image } from "react-native";

const {height, width} = Dimensions.get('window');
const CustomButoon = ({emoji, text, color, ...rest}) => {
    // console.log('e', typeof emoji);
    return (
        <TouchableOpacity
            {...rest}
            style={styles.root}
            activeOpacity={0.7}
        >
            <View style={styles.container}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {emoji}
                    <View style={{paddingHorizontal: 4}}></View>
                    <Text style={[styles.text, {color: color}]}>{text}</Text>
                </View>
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
            </View>
        </TouchableOpacity>
    )
};

export default CustomButoon;

const styles = StyleSheet.create({
    root: {
        // padding: 8,
    },
    container: {
        width: width- 26,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        // textTransform: 'capitalize', 
        fontSize: 12, 
        fontWeight: '600'
    }
})