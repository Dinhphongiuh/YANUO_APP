import { StatusBar } from 'react-native';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback, ScrollView, PanResponder, ActivityIndicator} from 'react-native';

export default function CreateStory({navigation, setModalVisible}) {
    // console.log(setModalVisible);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'}></StatusBar>
            {/* Header */}
            <View style={{width: '94%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                >
                    <Image
                        source={require('../Icon/xMarkBlack.png')}
                        resizeMode='contain'
                        style={{width: 25, height: 25}}
                    ></Image>
                </TouchableOpacity>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>Tạo tin</Text>
                <View style={{flexDirection: 'row',}}>
                    <TouchableOpacity
                    >
                        <Image
                            source={require('../Icon/Camera.png')}
                            resizeMode='contain'
                            style={{width: 30, height: 30, marginRight: 15}}
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{width: 30, height: 30, alignItems: 'center', justifyContent: 'center'}}
                    >
                        <Image
                            source={require('../Icon/userCircle1.png')}
                            resizeMode='contain'
                            style={{width: '100%', height: '100%'}}
                        ></Image>
                        <View style={{width: 20, height: 20, position: 'absolute', backgroundColor: '#fff', bottom: -4, borderRadius: 30, overflow: 'hidden', right: -4, alignItems: 'center', justifyContent: 'center'}}>
                            <Image
                                source={require('../Icon/gearBlack.png')}
                                resizeMode= 'contain'
                                style={{width: '100%', height: '100%'}}
                            ></Image>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {/*  */}
            <View style={{width: '94%'}}></View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
    },
});