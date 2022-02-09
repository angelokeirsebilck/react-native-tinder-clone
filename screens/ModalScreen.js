import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import tw from 'tailwind-rn';
import uesAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { doc, serverTimestamp, setDoc } from '@firebase/firestore';
import { db } from '../firebase';

const ModalScreen = () => {
  const { user } = uesAuth();
  const navigation = useNavigation();

  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);

  const incompleteForm = !age || !job || !image;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Update your profile',
      headerStyle: {
        backgroundColor: '#FF5864',
      },
      headerTitleStyle: {
        color: 'white',
      },
    });
  }, []);

  const updateUserProfile = () => {
    setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate('Home');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <View style={tw('flex-1 items-center pt-1')}>
      <Image
        style={tw('h-20 w-full')}
        resizeMode='contain'
        source={{ uri: 'https://links.papareact.com/2pf' }}
      />
      <Text style={tw('text-xl text-gray-500 p-2 font-bold')}>
        Welcome {user.displayName}
      </Text>
      <Text style={tw('mb-2 text-red-400 font-bold')}>
        Step 1: The Profile Pic
      </Text>
      <TextInput
        value={image}
        onChangeText={(text) => setImage(text)}
        style={tw('text-center text-xl pb-2 w-3/4 h-12 rounded-xl border mb-2')}
        placeholder='Enter a profile pic url'
      />
      <Text style={tw('mb-2  text-red-400 font-bold')}>Step 2: The Job</Text>
      <TextInput
        value={job}
        onChangeText={(text) => setJob(text)}
        style={tw('text-center text-xl pb-2 w-3/4 h-12 rounded-xl border mb-2')}
        placeholder='Enter your job'
      />
      <Text style={tw('mb-2  text-red-400 font-bold')}>Step 3: The Age</Text>
      <TextInput
        value={age}
        onChangeText={(text) => setAge(text)}
        style={tw('text-center text-xl pb-2 w-3/4 h-12 rounded-xl border')}
        placeholder='Enter your age'
        maxLength={2}
        keyboardType='numeric'
      />

      <TouchableOpacity
        disabled={incompleteForm}
        onPress={updateUserProfile}
        style={[
          tw('w-64 p-3 rounded-xl absolute bottom-10'),
          incompleteForm ? tw('bg-gray-400') : tw('bg-red-400'),
        ]}
      >
        <Text style={tw('text-center text-white text-xl')}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
