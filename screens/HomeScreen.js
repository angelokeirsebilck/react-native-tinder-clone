import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import uesAuth from '../hooks/useAuth';

import tw from 'tailwind-rn';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';

import Swiper from 'react-native-deck-swiper';

import data from '../dummyData';

import { doc, onSnapshot, collection } from '@firebase/firestore';
import { db } from '../firebase';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { logout, user } = uesAuth();
  const swiperRef = useRef(null);
  const [profiles, setProfiles] = useState([]);

  useLayoutEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate('Modal');
      }
    });

    return unsub;
  }, []);

  useEffect(() => {
    let unsub;

    const featchCards = (async) => {
      unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
        setProfiles(
          snapshot.docs
            .filter((doc) => doc.id !== user.uid)
            .map((doc) => {
              return {
                id: doc.id,
                ...doc.data(),
              };
            })
        );
      });
    };

    featchCards();

    return unsub;
  }, []);

  const swipeLeft = async () => {};

  const swipeRight = async () => {};

  return (
    <SafeAreaView style={tw('flex-1 mt-4')}>
      <View style={tw('items-center relative flex-row justify-between px-5')}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw('h-10 w-10 rounded-full')}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
          <Image style={tw('h-14 w-14')} source={require('../tinder.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name='chatbubbles-sharp' size={30} color='#FF5864' />
        </TouchableOpacity>
      </View>

      <View style={tw('flex-1 ')}>
        <Swiper
          ref={swiperRef}
          containerStyle={{ backgroundColor: 'transparent' }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          onSwipedLeft={() => {
            console.log('swipe nope');
          }}
          onSwipedRight={() => {
            console.log('swipe match');
          }}
          overlayLabels={{
            left: {
              title: 'Nope',
              style: {
                label: {
                  textAlign: 'right',
                  color: 'red',
                },
              },
            },
            right: {
              title: 'YES',
              style: {
                label: {
                  textAlign: 'left',
                  color: 'green',
                },
              },
            },
          }}
          verticalSwipe={false}
          renderCard={(card) => {
            if (card) {
              return (
                <View
                  key={card.id}
                  style={[
                    tw('relative bg-white rounded-xl'),
                    { height: '50%' },
                  ]}
                >
                  <Image
                    style={tw('h-full w-full')}
                    resizeMode='cover'
                    source={{ uri: card.photoURL }}
                  />
                  <View
                    style={[
                      tw(
                        'bg-white w-full flex-row justify-between px-6 py-2 items-center h-20 rounded-b-xl'
                      ),
                      styles.cardShadow,
                    ]}
                  >
                    <View>
                      <Text style={tw('text-xl font-bold')}>
                        {card.displayName}
                      </Text>
                      <Text>{card.job}</Text>
                    </View>
                    <Text style={tw('text-2xl font-bold')}>{card.age}</Text>
                  </View>
                </View>
              );
            } else {
              return (
                <View
                  style={[
                    tw(
                      'bg-white w-full justify-center px-6 py-2 items-center rounded-xl'
                    ),
                    styles.cardShadow,
                    { height: '50%' },
                  ]}
                >
                  <Text style={tw('font-bold mb-4')}>No more profiles</Text>
                  <Image
                    style={tw('h-20 w-full')}
                    resizeMode='contain'
                    source={{ uri: 'https://links.papareact.com/6gb' }}
                  />
                </View>
              );
            }
          }}
        />
      </View>

      <View style={[tw('flex-row justify-evenly '), { height: '20%' }]}>
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeLeft()}
          style={tw(
            'items-center justify-center rounded-full w-16 h-16 bg-red-200'
          )}
        >
          <Entypo color='red' name='cross' size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeRight()}
          style={tw(
            'items-center flex justify-center rounded-full w-16 h-16 bg-green-200'
          )}
        >
          <Entypo name='heart' color='green' size={30} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
