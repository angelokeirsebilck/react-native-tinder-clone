import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/core';
import tw from 'tailwind-rn';
import ChatList from '../components/ChatList';

const ChatScreen = () => {
  return (
    <SafeAreaView>
      <Header title='Chat' />
      <ChatList />
    </SafeAreaView>
  );
};

export default ChatScreen;
