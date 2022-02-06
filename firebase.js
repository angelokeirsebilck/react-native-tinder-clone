// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCADOHXYcGVkNCttbqeV2Xl2kepeyb51DU',
  authDomain: 'tinder-clone-angelo.firebaseapp.com',
  projectId: 'tinder-clone-angelo',
  storageBucket: 'tinder-clone-angelo.appspot.com',
  messagingSenderId: '1093469108015',
  appId: '1:1093469108015:web:2dcf18ddbecb62626593da',
  measurementId: 'G-BNCMK9FVQB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

const db = getFirestore();

export { auth, db };
