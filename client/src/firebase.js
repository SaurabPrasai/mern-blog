// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-blog-3f8a8.firebaseapp.com",
  projectId: "mern-blog-3f8a8",
  storageBucket: "mern-blog-3f8a8.appspot.com",
  messagingSenderId: "1064929496271",
  appId: "1:1064929496271:web:7b7ea853427abe827b3bba"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);