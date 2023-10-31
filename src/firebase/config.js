// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqJa4PzpM3XFdbmRC3kqY2cqWhwLH4I2E",
  authDomain: "fitadmindb.firebaseapp.com",
  projectId: "fitadmindb",
  storageBucket: "fitadmindb.appspot.com",
  messagingSenderId: "260661220183",
  appId: "1:260661220183:web:2d1ae26c3787dc843ea412",
  measurementId: "G-YB3JGWKS3X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig