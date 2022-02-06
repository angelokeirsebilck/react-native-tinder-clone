import { View, Text, Button } from 'react-native';

import React from 'react';
import uesAuth from '../hooks/useAuth';

const LoginScreen = () => {
  const { signInWithGoogle, loading } = uesAuth();

  return (
    <View>
      <Text>{loading ? 'Loading...' : 'Login to the app'}</Text>
      <Button title='Login' onPress={signInWithGoogle} />
    </View>
  );
};

export default LoginScreen;
