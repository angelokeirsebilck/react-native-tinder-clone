import { Entypo } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React from 'react';

import uesAuth from './hooks/useAuth';
import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MatchScreen from './screens/MatchScreen';
import ModalScreen from './screens/ModalScreen';
import MessagesScreen from './screens/MessagesScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = uesAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='Chat' component={ChatScreen} />
            <Stack.Screen name='Messages' component={MessagesScreen} />
          </Stack.Group>
          <Stack.Group
            screenOptions={{
              presentation: 'modal',
            }}
          >
            <Stack.Screen name='Modal' component={ModalScreen} />
          </Stack.Group>
          <Stack.Group
            screenOptions={{
              presentation: 'transparentModal',
            }}
          >
            <Stack.Screen name='Match' component={MatchScreen} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name='Login' component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
