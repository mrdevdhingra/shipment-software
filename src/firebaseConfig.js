import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA6gVL-ktrt58RGS7-pSTrU0SlgQU74kWk",
  authDomain: "instoreshipping.firebaseapp.com",
  projectId: "instoreshipping",
  storageBucket: "instoreshipping.appspot.com",
  messagingSenderId: "751656104166",
  appId: "1:751656104166:web:0c20cb28185e2fe9b5cb27"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
