import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import uesAuth from '../hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/core';

import tw from 'tailwind-rn';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

const MessagesScreen = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const { user } = uesAuth();

  const {
    params: { matchDetails },
  } = useRoute();

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, 'matches', matchDetails.id, 'messages'),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );

    return unsub;
  }, [matchDetails, db]);

  const sendMessage = () => {
    addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    });

    setInput('');
  };

  return (
    <SafeAreaView style={tw('flex-1')}>
      <Header
        callEnabled
        title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw('flex-1')}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            inverted={-1}
            data={messages}
            keyExtractor={(message) => message.id}
            renderItem={({ item: message }) =>
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
            style={tw('pl-4')}
          />
        </TouchableWithoutFeedback>

        <View
          style={tw(
            'flex-row justify-between bg-white items-center border-t border-gray-200 px-5 py-2'
          )}
        >
          <TextInput
            style={'h-10 text-lg text-center pb-2 w-3/4 rounded-xl border'}
            placeholder='Send message..'
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Button title='Send' onPress={sendMessage} color='#FF5864' />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessagesScreen;
