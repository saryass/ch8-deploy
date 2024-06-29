// Import the functions you need from the firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBO2wEFh56gtL8SjdQB0luoXeYPZHeOaIU",
    authDomain: "the8-dev.firebaseapp.com",
    projectId: "the8-dev",
    storageBucket: "the8-dev.appspot.com",
    messagingSenderId: "901985343200",
    appId: "1:901985343200:web:dfe65128d2522e827de285",
    measurementId: "G-8KZ306Z98L"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
const db = getFirestore(app);

export { db };