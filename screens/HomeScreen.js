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

import generateId from '../lib/generateId';

import {
  doc,
  onSnapshot,
  collection,
  setDoc,
  getDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from '@firebase/firestore';
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

    const featchCards = async () => {
      const passes = await getDocs(
        collection(db, 'users', user.uid, 'passes')
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ['test'];

      const swipes = await getDocs(
        collection(db, 'users', user.uid, 'swipes')
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

      unsub = onSnapshot(
        query(
          collection(db, 'users'),
          where('id', 'not-in', [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
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
        }
      );
    };

    featchCards();

    return unsub;
  }, [db]);

  const swipeLeft = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`You swiped left on ${userSwiped.displayName}`);

    setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];

    const loggedInProfile = await (
      await getDoc(doc(db, 'users', user.uid))
    ).data();

    console.log(`You swiped right on ${userSwiped.displayName}`);

    // check if user swiped on you
    await getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          // matched
          setDoc(
            doc(db, 'users', user.uid, 'swipes', userSwiped.id),
            userSwiped
          );

          // Create match
          setDoc(doc(db, 'matches', generateId(userSwiped.id, user.uid)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          console.log('matched!!');

          navigation.navigate('Match', {
            loggedInProfile,
            userSwiped,
          });
        } else {
          setDoc(
            doc(db, 'users', user.uid, 'swipes', userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

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
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex);
            console.log('swipe nope');
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
            console.log('swipe right');
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
