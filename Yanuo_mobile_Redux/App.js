import MainStackNavigator from './navigations/MainStackNavigator';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { MessageProvider } from './screens/context/chatContext';
import { SocketProvider } from './screens/context/socketContext';

export default function App()
{
  return (
    <Provider store={store}>
      <SocketProvider>
        <MessageProvider>
        <NavigationContainer>
          <MainStackNavigator navigation={useNavigation}>
          </MainStackNavigator>
        </NavigationContainer>
        </MessageProvider>
        </SocketProvider>
    </Provider>
  )
}