import {
  View,
  Text,
  Button,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import React, { useLayoutEffect } from 'react';
import uesAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/core';

import tw from 'tailwind-rn';

const LoginScreen = () => {
  const { signInWithGoogle, loading } = uesAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={tw('flex-1 ')}>
      <ImageBackground
        resizeMode='cover'
        style={tw('flex-1  flex-col justify-end items-center')}
        source={{ uri: 'https://tinder.com/static/tinder.png' }}
      >
        <TouchableOpacity
          style={[tw('absolute bottom-24 w-52 bg-white p-4 rounded-2xl'), {}]}
          onPress={signInWithGoogle}
        >
          <Text style={[tw('text-center font-bold'), { color: '#FF5864' }]}>
            Sign in & Get swiping
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
