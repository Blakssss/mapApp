// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCshcDdz9SxDgz3hTtRPC7U1XThOTze0v4",
  authDomain: "firstfirebaseproject-65828.firebaseapp.com",
  projectId: "firstfirebaseproject-65828",
  storageBucket: "firstfirebaseproject-65828.appspot.com",
  messagingSenderId: "256447436877",
  appId: "1:256447436877:web:53cd0df77b9ced3b49e404",
  measurementId: "G-PFBVWFQD4H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);
export {app, database, storage}