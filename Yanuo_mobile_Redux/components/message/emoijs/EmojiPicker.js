import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback, ScrollView, PanResponder, TextInput, KeyboardAvoidingView, useWindowDimensions} from 'react-native';
import React, { memo, useMemo, useRef, useState } from 'react';
import { TabView } from 'react-native-tab-view';
import categories from './emoijData/categories';
import EmojiCategory from './EmojiCategory';
import TabBar from './TabBar';

// export default function App()
// {
//     return (
//         <View>

//         </View>
//     )
// };

const EmojiPicker = () => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes, setRoutes] = useState(categories.tabs.map(tab => ({ key: tab.category, title: tab.tabLabel })));

    const renderScene = ({ route }) => (
		<EmojiCategory 
			category={route.key}
		/>
	)

    return (
        <TabView
			renderTabBar={props => <TabBar setIndex={setIndex} {...props} />}
			navigationState={{index, routes}}
			onIndexChange={setIndex}
			renderScene={renderScene}
			initialLayout={{ width: layout.width }}
		/>
    )
};

export default memo(EmojiPicker);