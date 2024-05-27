import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import HomeLoginScreen from '../screens/HomeLoginScreen';
import loginScreen from '../screens/LoginScreen';
import RecoveryAccountSR from '../screens/RecoveryAccountSR';
import ChatScreen from '../screens/ChatScreen';
import SigupUserName from '../screens/SignupUserName';
import SigupPhone from '../screens/SignupPhone';
import SigupOTP from '../screens/SiguoOTP';
import PasswordConfrimSCreen from '../screens/PasswordConfrim';
import GenderAndBirthSCR from '../screens/GenderAndBirth';
import BackgroundSCR from '../screens/BackgroundSG';
import ProfileSCR from '../screens/ProfileScreen';
import ViewMediaSCR from '../screens/components/viewImage';
import previewAvataPick from '../screens/components/previewAvataPick';
import profileShowInfo from '../screens/components/profileShowInfo';
import FriendSCR from '../screens/Friend';
import ListFriendSCR from '../screens/components/ListFriend';
import UserProfileSCR from '../screens/components/UserProfile';
import CreateGroupSCR from '../screens/groupConponent/CreateGroupSCR';
import ChatController from '../screens/chatController/ChatController';
import MemberController from '../screens/chatController/MemberController';
import ViewMediaChat from '../screens/chatController/ViewMediaChat';
import CreateStorySCR from '../screens/StoryComponent/CreateStory';
import axios from 'axios';
import client from '../api/client';
import TabNavigation from '../navigations/TabNavigation';
import { useDispatch, useSelector } from "react-redux";
import { StackActions } from "@react-navigation/native";
import { setCurrentUserId, setLogin } from "../redux/slices/globalSlice";
import { setUserProfile } from "../redux/slices/meSlice";
import SignupEmail from '../screens/SignupEmail';
// import {} from '../redux/slices/globalSlice';

const Stack = createNativeStackNavigator();

const MainStackNavigator = ({navigation}) => {
    const isLogin = useSelector(state => state.global.isLogin);
    const dispatch = useDispatch();
      
      const logToken = async() => {
        const storedToken = await AsyncStorage.getItem('token');
        try
        {
          const res = await client.post('/sign-token',{}, {
            headers: {
              authorization: `JWT ${storedToken}`,
            }
          })
          console.log(res.data);
          if (res.data.success)
          {
            dispatch(setLogin(true));
            dispatch(setUserProfile(res.data.user));
            dispatch(setCurrentUserId(res.data.user._id));
          }
        }
        catch (error)
        {
          console.log(error.message);
        }
      }

      useEffect(() => {
        logToken();
    }, []);

    return (
        // <NavigationContainer>
            <Stack.Navigator>
                {
                    !isLogin ? 
                    <Stack.Screen
                        name='HomeLogin'
                        component={HomeLoginScreen}
                        options={{headerShown: false, gestureEnabled: false}}
                    ></Stack.Screen> :
                    <Stack.Screen
                        name='MainTabs'
                        component={TabNavigation}
                        options={{headerShown: false, gestureEnabled: false}}
                    ></Stack.Screen>
                }
                <Stack.Screen
                    name='HomeLogin1'
                    component={HomeLoginScreen}
                    options={{headerShown: false, gestureEnabled: false}}
                ></Stack.Screen>
                <Stack.Screen
                    name='loginScreen'
                    component={loginScreen}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='recoveryAccount'
                    component={RecoveryAccountSR}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='sigupUserNameSCR'
                    component={SigupUserName}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name="signupEmailSCR"
                    component={SignupEmail}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='sigupUserPhoneSCR'
                    component={SigupPhone}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='sigupOTPSCR'
                    component={SigupOTP}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='PasswordConfrimSCR'
                    component={PasswordConfrimSCreen}
                    options={{headerShown: false, gestureEnabled: false}}
                ></Stack.Screen>
                <Stack.Screen
                    name='genderAndBirthSCR'
                    component={GenderAndBirthSCR}
                    options={{headerShown: false, gestureEnabled: false}}
                ></Stack.Screen>
                <Stack.Screen
                    name='backGroundSCR'
                    component={BackgroundSCR}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='MainTabs1'
                    component={TabNavigation}
                    options={{headerShown: false, gestureEnabled: false}}
                ></Stack.Screen>
                <Stack.Screen
                    name='ChatSCR'
                    component={ChatScreen}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='ProfileSCR'
                    component={ProfileSCR}
                    options={{headerShown: false, gestureEnabled: false}}
                ></Stack.Screen>
                <Stack.Screen
                    name='ViewMediaSCR'
                    component={ViewMediaSCR}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='previewAvataPick'
                    component={previewAvataPick}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='profileShowInfo'
                    component={profileShowInfo}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='FriendSCR'
                    component={FriendSCR}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='ListFriendSCR'
                    component={ListFriendSCR}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='UserProfileSCR'
                    component={UserProfileSCR}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='CreateGroupSCR'
                    component={CreateGroupSCR}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='ChatController'
                    component={ChatController}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='MemberController'
                    component={MemberController}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='ViewMediaChat'
                    component={ViewMediaChat}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
                <Stack.Screen
                    name='CreateStorySCR'
                    component={CreateStorySCR}
                    options={{headerShown: false, gestureEnabled: true}}
                ></Stack.Screen>
            </Stack.Navigator>
    //   </NavigationContainer>
    )
};

export default MainStackNavigator;