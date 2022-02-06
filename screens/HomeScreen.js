import { View, Text, Button } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/core';
import uesAuth from '../hooks/useAuth';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { logout } = uesAuth();

  return (
    <View>
      <Text>Homescreen</Text>
      <Button
        title='Chat screen go'
        onPress={() => navigation.navigate('Chat')}
      />

      <Button title='Logout' onPress={logout} />
    </View>
  );
};

export default HomeScreen;
