import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeSCR from '../screens/HomeScreen';
import ContactSCR from '../screens/ContactScreen';
import DiscoverySCR from '../screens/DiscoveryScreen';
import NewsScreen from '../screens/NewsScreen';
import MeScreen from '../screens/MeScreen';
import { Image, View, Text } from "react-native";

const BottomTab = createBottomTabNavigator();

const TabNavigation = () => (
    <BottomTab.Navigator
      initialRouteName='Home'
      screenOptions={{
        tabBarStyle: {
          height: '10%',
          borderTopWidth: 1,
          borderTopColor: '#cdcdcd'
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'white',
      }}
    >
      <BottomTab.Screen
        name='HomeScreen'
        component={HomeSCR}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size, focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center', width: 100, height: '100%'}}>
              <Image
                style={{height: '50%', width: '100%'}}
                resizeMode='contain'
                source={focused ? require('../screens/Icon/MessageActive.png') : require('../screens/Icon/messagerNoActiveIcon.png')}
              ></Image>
              <Text
                style={{
                  color: focused ? '#0C75ED' : '#A3A3A3',
                  textAlign: 'center'
                }}
              >
                Tin nhắn
              </Text>
            </View>
          )
        }}
      ></BottomTab.Screen>
      <BottomTab.Screen
        name='ContactScreen'
        component={ContactSCR}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size, focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center', width: 100, height: '100%'}}>
              <Image
                style={{height: '50%', width: '100%'}}
                resizeMode='contain'
                source={focused ? require('../screens/Icon/ContactActive.png') : require('../screens/Icon/contactNoActive.png')}
              ></Image>
              <Text
                style={{
                  color: focused ? '#0C75ED' : '#A3A3A3',
                  textAlign: 'center'
                }}
              >
                Danh bạ
              </Text>
            </View>
          )
        }}
      ></BottomTab.Screen>
      {/*  */}
      <BottomTab.Screen
        name='DiscoveryScreen'
        component={DiscoverySCR}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size, focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center', width: 100, height: '100%'}}>
              <Image
                style={{height: 25}}
                resizeMode='contain'
                source={focused ? require('../screens/Icon/categoryActive.png') : require('../screens/Icon/categoryNoActive.png')}
              ></Image>
              <Text
                style={{
                  color: focused ? '#0C75ED' : '#A3A3A3',
                  textAlign: 'center'
                }}
              >
                Khám phá
              </Text>
            </View>
          )
        }}
      ></BottomTab.Screen>
      <BottomTab.Screen
        name='NewsScreen'
        component={NewsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size, focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center', width: 100, height: '100%'}}>
              <Image
                style={{height: 25}}
                resizeMode='contain'
                source={focused ? require('../screens/Icon/ClockActive.png') : require('../screens/Icon/ClockNoActive.png')}
              ></Image>
              <Text
                style={{
                  color: focused ? '#0C75ED' : '#A3A3A3',
                  textAlign: 'center'
                }}
              >
                Bảng tin
              </Text>
            </View>
          )
        }}
      ></BottomTab.Screen>
      <BottomTab.Screen
        name='MeScreen'
        component={MeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size, focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center', width: 100, height: '100%'}}>
              <Image
                style={{height: 25}}
                resizeMode='contain'
                source={focused ? require('../screens/Icon/UserActive.png') : require('../screens/Icon/UserNoActive.png')}
              ></Image>
              <Text
                style={{
                  color: focused ? '#0C75ED' : '#A3A3A3',
                  textAlign: 'center'
                }}
              >
                Cá nhân
              </Text>
            </View>
          )
        }}
      ></BottomTab.Screen>
    </BottomTab.Navigator>
);

export default TabNavigation;